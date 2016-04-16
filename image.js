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
var event = {op:'convert', name:'cropped-North.jpg'};


// var event = {op:'crop', name:'cat.png', p1:250, p2:250, p3:10, p4:10};
var error = "Operation requested";

const blur = (event) => {
    gm(event.name)
	.blur(event.p1, event.p2)
	.write(event.name, function(err){
	    if (err) throw err
		console.log("Written montage image.")
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
	}
	else {
		gm(event.name)
		.resize(event.p1, event.p2)
		.write(event.name, function(err){
	   	 if (err) throw err
	   		console.log("Written montage image.");
		});
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

const op = event.op
delete event.op;
if (!op) {
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
	callback(new Error("Unrecognized operation ${op}"));
}


// gm('max-small_height.jpg')
// .size(function (err, size) {
//   if (err) throw err
//   console.log(size.width > size.height ? 'wider' : 'taller than you');
// });

// var fd = fs.open('./max-small.jpg', 'r+', function(err, fd) {
//    if (err) {
//        return console.error(err);
//    }
//   console.log("File opened successfully!");
// });

// var event = {func:'blur', name:'max-small.jpg', p1:20, p2:30};


// if (event.func == 'blur') {
// 	gm(event.name).blur(event.p1, event.p2).write(event.name, function(err){
//     if (err) throw err
//     console.log("Written montage image.")
// 	});
// }
// else {
// 	console.log(error)
// }

// exports.handler = (event, callback) => {
//     const op = event.op
//     delete event.op;
//     if (op) {
// 	console.log(error);
//     }
//     switch (op) {
//     case 'blur':
// 	blur(event, callback);
// 	break;
//     case 'resize':
// 	resize(event, callback);
// 	break;
//     case 'crop':
// 	crop(event, callback);
// 	break;
//     case 'rotate':
// 	rotate(event, callback);
// 	break;
//     default :
// 	callback(new Error("Unrecognized operation ${op}"));
//     }
// };

