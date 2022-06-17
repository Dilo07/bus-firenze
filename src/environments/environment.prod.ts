const packageObj = require('../../package.json');
const version = packageObj.version;

export const environment = {
  production: true,
  security: {
    type: 'keycloak',
    configFile: 'assets/config/prod/config-app.json?version=' + version
  },
  header: {
    img: 'assets/images/Logo_BUS_Firenze.png',
    title: 'BUS Firenze'
  },
  footer: {
    year: 'v. ' + version + ' 2021',
    title: 'Powered by Movyon',
    link: 'https://www.movyon.com/',
    mail: 'ZTLFi.BusSupport@movyon.com'
  }
};
