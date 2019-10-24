#!/usr/bin/env node 
'use strict';

var fs = require('fs');
var path = require('path');

// Check args.
var args = process.argv.slice(2);
if (args.length < 1 || args.length > 2) {
    console.info('Usage: ' + path.basename(process.argv[1]) + ' source_file [target_file]');
    console.info('       Resolves imports and removes export statements.');
    process.exit(0);
}

if (args.length == 2) {
    // Create or override the output file.
    var fileDescriptor = fs.openSync(args[1], 'w');
    fs.writeSync(fileDescriptor, mash(path.normalize(path.resolve(args[0])), new Set()));
    fs.closeSync(fileDescriptor);
} else {
    // Print to the console.
    console.info(mash(path.normalize(path.resolve(args[0])), new Set()));
}

/**
 * Resolves imports and removes export statements.
 *
 * @param {string} filePath Full path to the file.
 * @param {Set<string>} included Set of the already included files.
 * @returns Content of the given file with its imports resolved and without exports.
 */
function mash(filePath, included) {
    if (included.has(filePath)) {
        return '';
    }
    included.add(filePath);

    var input = fs.readFileSync(filePath, {
        encoding: 'utf-8',
        flag: 'r'
    });

    // Remove exports.
    input = input.replace(/export (const|function|class|interface|type)/g, '$1');

    // Include imported files.
    var dir = path.dirname(filePath) + path.sep;
    input = input.replace(/import {[^}]+} from '([^']+)';/g, function(substring, importPath) {
        var fullPathWithoutExtension = path.resolve(dir, importPath);
        var fullPath;
        if (fs.existsSync(fullPathWithoutExtension + '.ts')) {
            fullPath = fullPathWithoutExtension + '.ts';
        } else if (fs.existsSync(fullPathWithoutExtension + '.js')) {
            fullPath = fullPathWithoutExtension + '.js';
        } else if (fs.existsSync(fullPathWithoutExtension)) {
            fullPath = fullPathWithoutExtension;
        } else {
            return '';
        }
        return mash(fullPath, included);
    });
    return input;
}
