var fs = require('fs');
var babel = require('babel-core');
var plugin = require('./main');
var classPlugin = require('babel-plugin-transform-class-properties');
var env = require('babel-preset-env');
var react = require('babel-preset-react');

var fileName = process.argv[2];

fs.readFile(fileName, function(err, data) {
	if (err) throw err;

	var src = data.toString();

	var out = babel.transform(src, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	console.log(out.code);
})