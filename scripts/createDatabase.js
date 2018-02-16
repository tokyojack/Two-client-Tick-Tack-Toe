var mysql = require('mysql');

var config = require('../config/config');
var connection = mysql.createConnection(config.db);

connection.query('CREATE TABLE `users` ( \
 `id` int(11) NOT NULL AUTO_INCREMENT, \
 `username` varchar(50) NOT NULL, \
 `password` char(60) NOT NULL, \
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
 PRIMARY KEY (`id`), \
 UNIQUE KEY `username` (`username`) \
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1');

console.log('Success: Database Created!');

connection.end();
