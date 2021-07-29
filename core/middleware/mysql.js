'use strict'
/**
 * mysql中间件
 */
const mysql = require('mysql');
const config = require('../config/index.js');

const pool = mysql.createPool(koacrab.conf.common.mysql || config.mysql);

module.exports = function() {
  return async function mysql(ctx, next) {
    if (ctx.mysql) return await next();

    ctx.mysql = function(sql, values) {
      
      return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
          if (err) {
            reject( err )
          } else {
            connection.query(sql, values, ( err, rows) => {
              if ( err ) {
                reject( err )
              } else {
                resolve( rows )
              }
              connection.release()
            })
          }
        })
      })
    };

    await next();
  }
}


