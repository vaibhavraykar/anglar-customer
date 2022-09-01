// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { domain } from "process";

export const environment = {
  production: false, 

// domain:'http://localhost:8091',
// support:'dev-tradesupport@360tf.trade', 


// domain:'http://Nimai-Prd-LB-1296056161.ap-south-1.elb.amazonaws.com' ,
// support:'tradesupport@360tf.trade',
//----------Dev server--------------------

// domain:'http://136.232.244.190:8081',
// support:'dev-tradesupport@360tf.trade', 

// ------Local host--------
// domain:'http://localhost:8081',
// support:'dev-tradesupport@360tf.trade', 
//----------UAT------------------------
domain: 'https://uat.360tf.trade',
support:'uat_tradesupport@360tf.trade',

//-------Production--------------------
// domain:'https://prod.360tf.trade' ,
// support:'tradesupport@360tf.trade',

//-------Pre-Production--------------------
// domain:'https://preprod.360tf.trade' ,
// support:'tradesupport@360tf.trade',


// domain:'http://nimai-preprod-alb-1213915872.me-south-1.elb.amazonaws.com',
// support:'tradesupport@360tf.trade',

name:'360tf',
legal:'legal@360tf.trade',
enquiry:' enquiries@360tf.trade',
info:'info@360tf.trade',
website:'www.360tf.trade',




//domain:'http://203.115.123.93:8080'  /// Testing  server
//domain:'http://203.115.123.93:9090'  /// Client port
//domain:'http://10.1.1.86:8080'  /// prod port
//domain:'http://nimai-pilot-lb-468660897.me-south-1.elb.amazonaws.com'  /// production port
//domain:'https://uat.nimaitrade.com' //AWS

//domain:'http://localhost:8080/paypal',

};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
