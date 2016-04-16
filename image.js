var fs = require('fs');
var gm = require('gm');

/////// BLUR ///////
var event = {op:'blur', link:'http://www.fastandfood.fr/wp-content/uploads/2016/03/emoji_gaufre-300x202@2x.jpg', name:'cropped-North.jpg', p1:30, p2:10};
/////// CROP ///////
// var event = {op:'crop', name:'cat.png', p1:250, p2:250, p3:10, p4:10};
/////// RESIZE ///////
// var event = {op:'resize', name:'max-small_height.jpg', p1:700, p2:500};
/////// ROTATE ///////
// var event = {op:'rotate', name:'cat_fun.jpg', p1:220};
/////// SEPIA ///////
// var event = {op:'sepia', name:'cropped-North.jpg'};
/////// CONVERT ///////
// var event = {op:'convert', name:'cropped-North.jpg', p1:'png'};


// var event = {op:'crop', name:'cat.png', p1:250, p2:250, p3:10, p4:10};
var error = "Operation requested";

const blur = (event) => {
    gm(event.link)
	.blur(event.p1, event.p2)
	.write(event.name, function(err){
	    if (err) throw err
		console.log("Written montage image.")
	});
	fs.readFile(event.name, function(err, data) {
		if (err) throw err;	
		console.log("etape de l'encode");	
		var encodeImage = new Buffer(data, 'binary').toString('base64');
		console.log(encodeImage)
		return encodeImage;
	});
};

const crop = (event) => {
    gm(event.name)
	.crop(event.p1, event.p2, event.p3, event.p4)
	.write(event.name, function(err){
	    if (err) throw err
		console.log("Written montage image.")
	});
};

const resize = (event) => {
	if (event.p3=='!') {
    	gm(event.name)
		.resize(event.p1, event.p2, event.p3)
		.write(event.name, function(err){
		    if (err) throw err
	    	console.log("Written montage image.");
		});
		return event;
	}
	else {
		gm(event.name)
		.resize(event.p1, event.p2)
		.write(event.name, function(err){
	   	 if (err) throw err
	   		console.log("Written montage image.");
		});
		return event;
	}
};

const rotate = (event) => {
    gm(event.name)
	.rotate("white", event.p1)
	.write(event.name, function(err){
	    if (err) throw err
	    console.log("Written montage image.")
	});
};

const sepia = (event) => {
	gm(event.name)
	.sepia()
	.write(event.name, function (err) {
	    if (err) throw err
	    console.log("Written montage image.")
	});
};

const convert = (event) => {
	var coolVar = event.name;
	var partsArray = coolVar.split('.');
	gm(event.name)
		.write(partsArray[0]+"."+event.p1, function (err) {
	    if (err) throw err
	    console.log("Written montage image.")
	});
}


// exports.handler = (event) => {
const op = event.op
delete event.op;
if (!op) {Ô
	console.log(error);
}
switch (op) {
	case 'blur':
		blur(event);
		break;
	case 'resize':
		resize(event);
		break;
	case 'crop':
		crop(event);
		break;
	case 'rotate':
		rotate(event);
		break;
	case 'sepia':
		sepia(event);
		break;
	case 'convert':
		convert(event);
		break;
	default :
		console.log(new Error("Unrecognized operation ${op}"));
	}
// };