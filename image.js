var fs = require('fs');
var gm = require('gm');
var aws = require('aws-sdk');

var error = "Operation requested";

const blur = (event, callback) => {
    gm(event.link)
	.blur(event.blur1, event.blur2)
	.write(event.name, function(err, stdout){
	    if (err) throw err
	    fs.readFile(event.name, function(err, data) {
		var encodeImage = new Buffer(data, 'binary').toString('base64');
		callback(null, encodeImage);
	    });
	});
};

const crop = (event, callback) => {
    gm(event.link)
	.crop(event.crop1, event.crop2, event.crop3, event.crop4)
	.write(event.name, function(err){
	    if (err) throw err
	    fs.readFile(event.name, function(err, data) {
		var encodeImage = new Buffer(data, 'binary').toString('base64');
		callback(null, encodeImage);
	    });
	});
};

const resize = (event, callback) => {
    if (event.resize3=='!') {
    	gm(event.link)
	    .resize(event.resize1, event.resize2, event.resize3)
	    .write(event.name, function(err){
		if (err) throw err
		fs.readFile(event.name, function(err, data) {
		    var encodeImage = new Buffer(data, 'binary').toString('base64');
		    callback(null, encodeImage);
		});
	    });
    }
    else {
	gm(event.link)
	    .resize(event.resize1, event.resize2)
	    .write(event.name, function(err){
	   	if (err) throw err
		fs.readFile(event.name, function(err, data) {
		    var encodeImage = new Buffer(data, 'binary').toString('base64');
		    callback(null, encodeImage);
		});
	    });
    }
};

const rotate = (event, callback) => {
    gm(event.link)
	.rotate("white", event.rotate1)
	.write(event.name, function(err){
	    if (err) throw err
	    fs.readFile(event.name, function(err, data) {
		var encodeImage = new Buffer(data, 'binary').toString('base64');
		callback(null, encodeImage);
	    });
	});
};

const sepia = (event, callback) => {
    gm(event.link)
	.sepia()
	.write(event.name, function (err) {
	    if (err) throw err
	    fs.readFile(event.name, function(err, data) {
		var encodeImage = new Buffer(data, 'binary').toString('base64');
		callback(null, encodeImage);
	    });
	});
};

const convert = (event, callback) => {
    var coolVar = event.name;
    var partsArray = coolVar.split('.');
    gm(event.name)
	.write(partsArray[0]+"."+event.convert1, function (err) {
	    if (err) throw err
	    fs.readFile(event.name, function(err, data) {
		var encodeImage = new Buffer(data, 'binary').toString('base64');
		callback(null, encodeImage);
	    });
	});
}

exports.handler = (event, context, callback) => {
    aws.config.loadFromPath('./package.json');

    const op = event.op;
    delete event.op;
    var i = 0;
    if (!op) {
	console.log(error);
    }
    while(typeof op[i] !== 'undefined') {
	switch (op[i]) {
	case 'blur':
	    blur(event, callback);
	    break;
	case 'resize':
	    resize(event, callback);
	    break;
	case 'crop':
	    crop(event, callback);
	    break;
	case 'rotate':
	    rotate(event, callback);
	    break;
	case 'sepia':
	    sepia(event, callback);
	    break;
	case 'convert':
	    convert(event, callback);
	    break;
	default :
	    callback(new Error("Unrecognized operation ${op}"));
	}
	i++;
    }
};