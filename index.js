#!/usr/bin/env node

"use strict";

var fs            = require("fs");
var path          = require("path");
var program       = require("commander");
var details       = require("./package.json");

program
	.version(details.version)
	.usage("[options] <file>")
	.option("-c, --config", "A default file to use as a sublime project config.")
	.parse(process.argv);

var config = fs.readFileSync(program.config
	? path.join(process.env.PWD, program.config)
	: __dirname + "/sublime-folder.sublime-project"
);

var folders = program
	.args
	.map(join(process.env.PWD))
	.map(function (folder) {
		if (!isDirectory(folder)) throw new Error("File must be a directory: " + folder);
		return fs.readdirSync(folder).map(join(folder));
	})
	.reduce([].concat.bind([]))
	.filter(isDirectory)
	.forEach(function (folder) {
		var name = folder.split("/").pop();
		var project = path.join(folder, name + ".sublime-project");
		fs.writeFileSync(project, config);
	});

function join (dir) { return function (file) { return path.join(dir, file); }; }
function isDirectory (file) { return fs.statSync(file).isDirectory(); }
