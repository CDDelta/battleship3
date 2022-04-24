// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  gqlQueryUri: 'http://localhost:8000/subgraphs/name/harmony/battleship3',
  gqlSubscriptionUri:
    'http://localhost:8001/subgraphs/name/harmony/battleship3',
  gameContractAddress: '0x7a7b3a1f88d07d4aaa481474ee1853d715c1a70e',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
