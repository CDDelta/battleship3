// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IBoardSetupVerifier.sol";
import "./interfaces/IFireShotVerifier.sol";
import "./interfaces/IGame.sol";

contract Game is IGame {
    uint256 public gameIndex;

    mapping(uint256 => Game) public games;

    /// The number of unique hits it takes to win a game.
    uint256 public constant WIN_HIT_COUNT = 17;

    IBoardSetupVerifier boardSetupVerifier;
    IFireShotVerifier fireShotVerifier;

    constructor(address _boardSetupVerifier, address _fireShotVerifier) {
        boardSetupVerifier = IBoardSetupVerifier(_boardSetupVerifier);
        fireShotVerifier = IFireShotVerifier(_fireShotVerifier);
    }

    function gameState(uint256 _gameId)
        external
        view
        returns (
            address[2] memory _participants,
            uint256[2] memory _boards,
            uint256 _turn,
            uint256[2] memory _hits,
            address _winner
        )
    {
        _participants = games[_gameId].participants;
        _boards = games[_gameId].boards;
        _turn = games[_gameId].turn;
        _hits = games[_gameId].hits;
        _winner = games[_gameId].winner;
    }

    function startGame(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external {
        require(boardSetupVerifier.verifyProof(a, b, c, input), "Invalid ship configuration!");

        games[gameIndex].participants[0] = msg.sender;
        games[gameIndex].boards[0] = input[0];

        emit Started(gameIndex, msg.sender);

        gameIndex++;
    }

    function joinGame(
        uint256 _gameId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external {
        require(boardSetupVerifier.verifyProof(a, b, c, input), "Invalid ship configuration!");

        games[_gameId].participants[1] = msg.sender;
        games[_gameId].boards[1] = input[0];

        emit Joined(_gameId, msg.sender);
    }

    function playFirstTurn(uint256 _gameId, uint256 _shotIndex) external {
        Game storage game = games[_gameId];

        require(game.turn == 0, "Not the first turn!");
        require(msg.sender == game.participants[0], "Not turn!");
        require(_shotIndex < 100, "Shot coordinates invalid!");

        game.shots[_shotIndex] = game.turn;
        game.turn++;

        emit ShotFired(_gameId, uint8(_shotIndex));
    }

    function playTurn(
        uint256 _gameId,
        uint256 _nextShotIndex,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input
    ) external {
        Game storage game = games[_gameId];

        uint256 prevPlayerIndex = (game.turn - 1) % 2;
        uint256 currPlayerIndex = game.turn % 2;

        require(game.turn > 0, "The first turn!");
        require(msg.sender == game.participants[currPlayerIndex], "Not turn!");
        require(game.winner == address(0), "Game already over!");
        require(_nextShotIndex < 100, "Next shot coordinates invalid!");
        require(
            input[1] == game.boards[prevPlayerIndex] &&
            game.turn - 1 == game.shots[input[2] + prevPlayerIndex * 100] &&
            fireShotVerifier.verifyProof(a, b, c, input), "Invalid proof!"
        );

        if (input[0] != 0) {
            game.hits[prevPlayerIndex]++;
        }

        emit ShotLanded(_gameId, uint8(input[0]));

        if (game.hits[prevPlayerIndex] >= WIN_HIT_COUNT) {
            game.winner = game.participants[prevPlayerIndex];
            emit Won(_gameId, game.winner);
        } else {
            require(game.shots[_nextShotIndex + currPlayerIndex * 100] == 0, "Shots must be unique!");

            game.shots[_nextShotIndex + currPlayerIndex * 100] = game.turn;
            emit ShotFired(_gameId, uint8(_nextShotIndex));
            game.turn++;
        }
    }
}