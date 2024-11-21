// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBWD_S-ixA0gQn6pWEMQl81Juvj6FlU1F0",
    authDomain: "sistema-unidad-terrritorial.firebaseapp.com",
    projectId: "sistema-unidad-terrritorial",
    storageBucket: "sistema-unidad-terrritorial.appspot.com",
    messagingSenderId: "110154609263",
    appId: "1:110154609263:web:07ffec8194534c5fca539a"
  },
  mercadoPagoToken: 'TEST-5725591517376732-112116-279c25bc5549617ea60a46548ebad9c7-128007453', // Access Token de Prueba
  mercadoPagoPublicKey: 'TEST-ebdedb36-3ad0-4f6b-8301-9669bdc08a83', // Public Key de Prueba
  appUrl: window.location.hostname === 'localhost' ? 'http://localhost:8100' : 'https://sistema-unidad-terrritorial.web.app',
  integrationModel: 'Marketplace' //Nuevo modelo de integración
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
