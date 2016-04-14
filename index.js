'use strict';
var im = require('imagemagick');
var fs = require('fs');


var postProcessResource = function(resource, fn){
    var ret = null;
    if (resource) {
        if (fn) {
            ret = fn(resource);
        }
        try {
            fs.unlinkSync(resource);
        } catch (err) {
            // Ignore
        }
    }
    return ret;
};


var identify = function(event, callback){
    if (!event.base64Image) {
        var msg = 'Invalid identify request: no "base64Image" field supplied';
        console.log(msg);
        callback(msg);
        return;
    }
    var tmpFile = `/tmp/inputFile.${(event.inputExtension || 'png')}`;
    var buffer = new Buffer(event.base64Image, 'base64');
    fs.writeFileSync(tmpFile, buffer);
    var args = event.customArgs ? event.customArgs.concat([tmpFile]) : tmpFile;
    im.identify(args, function(err, output){
        fs.unlinkSync(tmpFile);
        if (err) {
            console.log('Identify operation failed:', err);
            callback(err);
        } else {
            console.log('Identify operation completed successfully');
            callback(null, output);
        }
    });
};

var resize = function(event, callback){
    if (!event.base64Image) {
        var msg = 'Invalid resize request: no "base64Image" field supplied';
        console.log(msg);
        callback(msg);
        return;
    }
    // If neither height nor width was provided, turn this into a thumbnailing request
    if (!event.height && !event.width) {
        event.width = 100;
    }
    var resizedFile = `./resized.${(event.outputExtension || 'png')}`;
    var buffer = new Buffer(event.base64Image, 'base64');
    delete event.base64Image;
    delete event.outputExtension;
    event.srcData = buffer;
    event.dstPath = resizedFile;
    try {
        im.resize(event, function(err, stdout, stderr){
            if (err) {
                throw err;
            } else {
                console.log('Resize operation completed successfully');
                callback(null, postProcessResource(resizedFile, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
            }
        });
    } catch (err) {
        console.log('Resize operation failed:', err);
        callback(err);
    }
};

var convert = function(event, callback){
    event.customArgs = event.customArgs || [];
    var inputFile = null;
    var outputFile = null;
    if (event.base64Image) {
        inputFile = `/tmp/inputFile.${(event.inputExtension || 'png')}`;
        var buffer = new Buffer(event.base64Image, 'base64');
        fs.writeFileSync(inputFile, buffer);
        event.customArgs.unshift(inputFile);
    }
    if (event.outputExtension) {
        outputFile = `/tmp/outputFile.${event.outputExtension}`;
        event.customArgs.push(outputFile);
    }
    im.convert(event.customArgs, function(err, output){
        if (err) {
            console.log('Convert operation failed:', err);
            callback(err);
        } else {
            console.log('Convert operation completed successfully');
            postProcessResource(inputFile);
            if (outputFile) {
                callback(null, postProcessResource(outputFile, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
            } else {
                // Return the command line output as a debugging aid
                callback(null, output);
            }
        }
    });
};





exports.handler = function(event, context, callback){
    var operation = event.operation;
    delete event.operation;
    if (operation) {
        console.log(`Operation ${operation} 'requested`);
    }

    switch (operation) {
        case 'ping':
            callback(null, 'pong');
            break;
        case 'getDimensions':
            event.customArgs = ['-format', '%wx%h'];
        case 'identify':
            identify(event, callback);
            break;
        case 'thumbnail':  // Synonym for resize
        case 'resize':
            resize(event, callback);
            break;
        case 'getSample':
            event.customArgs = ['rose:'];
            event.outputExtension = event.outputExtension || 'png';
        case 'convert':
            convert(event, callback);
            break;
        default:
            callback(new Error(`Unrecognized operation "${operation}"`));
    }
};
