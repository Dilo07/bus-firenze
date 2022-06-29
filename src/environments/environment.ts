// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const packageObj = require('../../package.json');
const version = packageObj.version;

export const environment = {
  production: false,
  security: {
    type: 'keycloak', // noAuth - keycloak.
    configFile: 'assets/config/test/config-app.json?version=' + version
  },
  header: {
    img: 'assets/images/logo-firenze.png',
    imgBottom: 'assets/images/logo-bottom-movyon.png',
    title: 'Bus Firenze'
  },
  footer: {
    year: 'v. ' + version + ' 2021',
    title: 'Powered by Movyon',
    link: 'https://www.movyon.com/',
    mail: 'ZTLFi.BusSupport@movyon.com'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
