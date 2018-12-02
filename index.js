"use strict";

const PLUGIN_NAME = "gulp-sqippy";

const sqip = require("sqip"),
	through = require("through2"),
	path = require("path"),
	fs = require("fs"),
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
		var options = {};
	}

	const resultObject = sqip({
		filename: filepath,
		numberOfPrimitives: parseInt(options.primitives) || 20,
		blur: options.blur || 10,
		mode: options.mode || 5,
	});
	return resultObject.final_svg;
};

var getFileSizeMb = function(filePath) {
	const stats = fs.statSync(filePath);
	return stats.size / 1000000.0;
};

/**
 * Handle stream and pass through the options
 * @param options - primitives, blur and mode
 */
var gulpSqip = function(options) {
	if (typeof options == "undefined") {
		var options = {};
		options.includeSource = options.includeSource === false ? false : true;
	}

	return through.obj(function(sourceFile, enc, callback) {
		const sourceInfo = path.parse(sourceFile.path);
		if (sourceFile && sourceFile.isBuffer()) {
			// log which file is being processed
			let sizeText;
			try {
				sizeText = getFileSizeMb(sourceFile.path).toFixed(1) + "mb";
			} catch (err) {
				sizeText = "unknown";
			}
			log(
				"Processing '%s' (%s with %s primitives)",
				sourceInfo.name + sourceInfo.ext,
				sizeText,
				options.primitives || "default"
			);
			// make the new file
			const sqipResult = makeSvgPlaceholder(sourceFile.path, options);
			const svgFile = sourceFile.clone();
			svgFile.contents = Buffer.from(sqipResult);
			// set new file name
			const appendName = typeof options.appendName == "string" ? options.appendName : "";
			const prependName =
				typeof options.prependName == "string" ? options.prependName : "";
			svgFile.path = path.join(
				sourceInfo.dir,
				prependName + sourceInfo.name + appendName + ".svg"
			);
			// send file(s) along
			this.push(svgFile);
			if (options.includeSource) {
				this.push(sourceFile);
			}
			callback();
		} else {
			this.emit(
				"error",
				new PluginError(
					PLUGIN_NAME,
					"Source must be a file in buffer format: " + sourceFile.path
				)
			);
			callback();
		}
	});
};

module.exports = gulpSqip;
