var fs = require('fs');
var gm = require('gm');
var aws = require('aws-sdk');

var error = "Operation requested";

const postProcessResource = (resource, fn) => {
    var ret = null;
    if (fn) {
	ret = fn(resource);
    }
    try {
	fs.unlinkSync(resource);
    } catch (err) {
	console.log(err);
    }
    return ret;
}

const blur = (event, callback) => {
    gm(event.link)
	.blur(event.blur1, event.blur2)
	.write(event.name, function(err, stdout){
	    if (err) throw err
	    callback(null, postProcessResource(event.name, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
	});
};

const crop = (event, callback) => {
    gm(event.link)
	.crop(event.crop1, event.crop2, event.crop3, event.crop4)
	.write(event.name, function(err){
	    if (err) throw err
	    callback(null, postProcessResource(event.name, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
	});
};

const resize = (event, callback) => {
    if (event.resize3=='!') {
    	gm(event.link)
	    .resize(event.resize1, event.resize2, event.resize3)
	    .write(event.name, function(err){
		if (err) throw err
	    callback(null, postProcessResource(event.name, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
	    });
    }
    else {
	gm(event.link)
	    .resize(event.resize1, event.resize2)
	    .write(event.name, function(err){
	   	if (err) throw err
	    callback(null, postProcessResource(event.name, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
	    });
    }
};

const rotate = (event, callback) => {
    gm(event.link)
	.rotate("white", event.rotate1)
	.write(event.name, function(err){
	    if (err) throw err
	    callback(null, postProcessResource(event.name, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
	});
};

const sepia = (event, callback) => {
    gm(event.link)
	.sepia()
	.write(event.name, function (err) {
	    if (err) throw err
	    callback(null, postProcessResource(event.name, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
	});
};

const convert = (event, callback) => {
    var coolVar = event.name;
    var partsArray = coolVar.split('.');
    gm(event.name)
	.write(partsArray[0]+"."+event.convert1, function (err) {
	    if (err) throw err
	    callback(null, postProcessResource(event.name, (file) => new Buffer(fs.readFileSync(file)).toString('base64')));
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
