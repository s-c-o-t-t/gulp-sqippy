"use strict";

const PLUGIN_NAME = "gulp-sqippy";

const sqip = require("sqip"),
	through = require("through2"),
	path = require("path"),
	log = require("fancy-log");

const sqipModes = [
	{
		name: "combo",
		code: 0,
	},
	{
		name: "triangle",
		code: 1,
	},
	{
		name: "rect",
		code: 2,
	},
	{
		name: "ellipse",
		code: 3,
	},
	{
		name: "circle",
		code: 4,
	},
	{
		name: "rotatedrect",
		code: 5,
	},
	{
		name: "beziers",
		code: 6,
	},
	{
		name: "rotatedellipse",
		code: 7,
	},
	{
		name: "polygon",
		code: 8,
	},
];

/**
 * run SQIP to generate the SVG code
 * @param filepath - The source file path
 * @param options - primitives, blur and mode
 * @returns {string} - The SVG XML code
 */
var makeSvgPlaceholder = function(filepath, options) {
	if (typeof options == "undefined") {
		var options = {
			default: true,
		};
	}

	const resultObject = sqip({
		filename: filepath,
		numberOfPrimitives: options.primitives || 20,
		blur: options.blur || 10,
		mode: options.mode || 5,
	});
	return resultObject.final_svg;
};

/**
 * Handle stream and pass through the options
 * @param options - primitives, blur and mode
 */
var gulpSqip = function(options) {
	if (typeof options == "undefined") {
		var options = {
			default: true,
		};
	}

	return through.obj(function(sourceFile, enc, callback) {
		if (sourceFile === null || sourceFile.isDirectory()) {
			// empty file or directory
			this.push(sourceFile);
			return callback();
		}
		if (sourceFile.isBuffer()) {
			const f = path.parse(sourceFile.path);
			log("Processing", f.name + f.ext);
			const sqipResult = makeSvgPlaceholder(sourceFile.path, options);
			const svgFile = sourceFile.clone();
			svgFile.contents = Buffer.from(sqipResult);
			const appendName = typeof options.appendName == "string" ? options.appendName : "";
			const prependName =
				typeof options.prependName == "string" ? options.prependName : "";
			svgFile.path = path.join(f.dir, prependName + f.name + appendName + ".svg");
			this.push(svgFile);
			callback();
		} else {
			this.emit("error", new PluginError(PLUGIN_NAME, "Only Buffer format is supported"));
			callback();
		}
	});
};

module.exports = gulpSqip;
