var fs = require('fs');
var gm = require('gm');

/////// BLUR ///////
// var event = {op:'blur', name:'cropped.jpg', p1:30, p2:10};
/////// CROP ///////
// var event = {op:'crop', name:'cat.png', p1:250, p2:250, p3:10, p4:10};
/////// RESIZE ///////
// var event = {op:'resize', name:'max-small_height.jpg', p1:700, p2:500};
/////// ROTATE ///////
// var event = {op:'rotate', name:'cat_fun.jpg', p1:220};
/////// SEPIA ///////
// var event = {op:'sepia', name:'cropped-North.jpg'};
/////// CONVERT ///////
//var event = {op:'convert', name:'cropped-North.jpg', p1:'png'};


//var event = {op:['crop', 'blur'], name:'chat.jpg', crop1:50, crop2:50, crop3:10, crop4:10, blur1:20, blur2:20};

var error = "Operation requested";

const blur = (event, callback) => {
    gm(event.link)
	.blur(event.blur1, event.blur2)
	.write(event.name, function(err, stdout){
	    if (err) throw err
	    fs.readFile(event.name, function(err, data) {
		var encodeImage = new Buffer(data, 'binary').toString('base64');
		callback(encodeImage);
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
		callback(encodeImage);
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
		    callback(encodeImage);
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
		    callback(encodeImage);
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
		callback(encodeImage);
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
		callback(encodeImage);
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
		callback(encodeImage);
	    });
	});
}

exports.handler = (event, callback) => {
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
