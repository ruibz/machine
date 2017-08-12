var util = require('util');

function Hello(req, res) { 
	var name; 
	this.setName = function(thyName) { 
		name = thyName; 
	}; 
  this.sayHello = function() { 
    console.log("hello");
  }; 
}; 
module.exports = Hello;
