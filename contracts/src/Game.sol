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

    modifier playerTurn(uint256 _gameId) {
        require(msg.sender == games[_gameId].participants[games[_gameId].turn % 2], "Not turn!");
        _;
    }

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

        gameIndex++;
        games[gameIndex].participants[0] = msg.sender;
        games[gameIndex].boards[0] = input[0];

        emit Started(gameIndex, msg.sender);
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

    function playFirstTurn(uint256 _gameId, uint256[2] memory _shot) external {
        Game storage game = games[_gameId];

        require(game.turn == 0, "Not the first turn!");
        require(msg.sender == game.participants[0], "Not turn!");
        require(_shot[0] < 10 && _shot[1] < 10, "Shot coordinates invalid!");

        game.shots[game.turn] = _shot;
        game.turn++;

        emit ShotFired(_gameId, uint8(_shot[0]), uint8(_shot[1]));
    }

    function playTurn(
        uint256 _gameId,
        uint256[2] memory _nextShot,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[8] memory input
    ) external playerTurn(_gameId) {
        Game storage game = games[_gameId];

        require(game.turn > 0, "The first turn!");
        require(game.winner == address(0), "Game already over!");
        require(_nextShot[0] < 10 && _nextShot[1] < 10, "Next shot coordinates invalid!");
        require(
            input[5] == game.boards[game.turn % 2] &&
            input[6] == game.shots[game.turn - 1][0] &&
            input[7] == game.shots[game.turn - 1][1] &&
            fireShotVerifier.verifyProof(a, b, c, input), "Invalid proof!"
        );

        for (uint256 i = 0; i <= 5; i++) {
            if (i == 5) {
                // Emit a ShotLanded event with ship id 5 to indicate a missed shot.
                emit ShotLanded(_gameId, 5);
                break;
            }

            if (input[i] == 1) {
                game.hits[(game.turn - 1) % 2]++;
                emit ShotLanded(_gameId, uint8(i));
                break;
            }
        }

        if (game.hits[(game.turn - 1) % 2] >= WIN_HIT_COUNT) {
            game.winner = game.participants[(game.turn - 1) % 2];
            emit Won(_gameId, game.winner);
        } else {
            for (uint256 i = game.turn % 2; i < game.turn; i += 2) {
                require(game.shots[i][0] != _nextShot[0] && game.shots[i][1] != _nextShot[1], "Shots must be unique!");
            }

            game.shots[game.turn] = _nextShot;
            emit ShotFired(_gameId, uint8(_nextShot[0]), uint8(_nextShot[1]));
            game.turn++;
        }
    }
}