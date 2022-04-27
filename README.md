# Battleship3

An on-chain battleship game based on zero-knowledge proofs. Battleship3 uses zero-knowledge proofs to guarantee the integrity of game rules while protecting the privacy of the players' boards without the use of a trusted server.

The circuit design used in Battleship3 was initially inspired by the [Battlezips](https://github.com/jp4g/BattleZips) project and improves in the completeness of constraints specified and game rules implemented.

## Development

### Circuits

To start with circuit development, run

```bash
npm run setup:download-ptau
```

to download the result of the Hermez Powers of Tau ceremony.

Then, run the following after making any changes to a circuit

```bash
npm run full-build
```

and the following to create proofs

```bash
npm run full-prove
```

### Contracts

To deploy the verifier and game contracts, first run the following to deploy the game's verifier contracts

```bash
npm run deploy:verifiers
```

and update the game contract deployment script with the outputted verifier contract addresses before running the following to deploy the game contract

```bash
npm run deploy:game
```

### Subgraph

To start a local development instance of the game's subgraph, run

```bash
npm run start:dev
```

and run the following to deploy the subgraph

```bash
npm run create
npm run deploy
```

### Frontend

To start developing the frontend, first run

```bash
npm run generate:graphql-typings
npm run generate:contract-typings
npm run copy-circuits
```

Then, run the following to start a local frontend build

```bash
npm run start
```

## Future Work

- Complete circuit implementation for ensuring player boards have no ship collisions.

- UI/UX improvements and polish.
