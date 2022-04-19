// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGame {
    event Started(uint256 _gameId, address _by);
    event Joined(uint256 _gameId, address _by);
    event ShotFired(uint256 _gameId, uint8 _shotX, uint8 _shotY);
    event ShotLanded(uint256 _gameId, uint8 _shipId);
    event Won(uint256 _gameId, address _by);

    struct Game {
        /// The address of the two players.
        address[2] participants;
        /// The hash committing to the ship configuration of each playment.
        uint256[2] boards;
        /// The turn number of this game.
        uint256 turn;
        /// Mapping from turn number to shot coordinates.
        mapping(uint256 => uint256[2]) shots;
        /// The number of hits each player has made on a ship.
        uint256[2] hits;
        /// The winner of the game.
        address winner;
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
        );

    function startGame(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external;

    function joinGame(
        uint256 _gameId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external;

    function playFirstTurn(uint256 _gameId, uint256[2] memory _shot) external;

    function playTurn(
        uint256 _gameId,
        uint256[2] memory _nextShot,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[8] memory input
    ) external;
}