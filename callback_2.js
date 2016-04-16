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


var event = {op:['crop', 'blur'], name:'chat.jpg', crop1:50, crop2:50, crop3:10, crop4:10, blur1:20, blur2:20};

var error = "Operation requested";

const blur = (event, callback) => {
    gm(event.name)
	.blur(event.blur1, event.blur2)
	.write(event.name, function(err, stdout){
	    if (err) throw err
//	    callback(stdout);
	    console.log("Written blur montage image.");
	});
};

const crop = (event, callback) => {
    gm(event.name)
	.crop(event.crop1, event.crop2, event.crop3, event.crop4)
	.write(event.name, function(err){
	    if (err) throw err
//	    callback(stdout);
	    console.log("Written montage crop image.");
	});
};

const resize = (event, callback) => {
    if (event.p3=='!') {
    	gm(event.name)
	    .resize(event.resize1, event.resize2, event.resize3)
	    .write(event.name, function(err){
		if (err) throw err
		console.log("Written montage image.");
		callback(stdout);
	    });
	}
    else {
	gm(event.name)
	    .resize(event.resize1, event.resize2)
	    .write(event.name, function(err){
	   	if (err) throw err
		callback(stdout);
	   	console.log("Written montage image.");
	    });
    }
};

const rotate = (event, callback) => {
    gm(event.name)
	.rotate("white", event.rotate1)
	.write(event.name, function(err){
	    if (err) throw err
	    callback(stdout);
	    console.log("Written montage image.");
	});
};

const sepia = (event, callback) => {
    gm(event.name)
	.sepia()
	.write(event.name, function (err) {
	    if (err) throw err
	    callback(stdout);
	    console.log("Written montage image.");
	});
};

const convert = (event, callback) => {
    gm(event.name)
	.write(event.name, function (err) {
	    if (err) throw err
	    callback(stdout);
	    console.log("Written montage image.");
	});
}

exports.handler = (event, context, callback) => {
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

const callback = (test) => {
    console.log("nope");
};

var op = event.op;
var i = 0;

while(typeof op[i] !== 'undefined') {
    switch (op[i]) {
    case 'blur':
	blur(event, callback);
	console.log("2");
	break;
    case 'resize':
	resize(event, callback);
	break;
    case 'crop':
	crop(event, callback);
	console.log("1");
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
