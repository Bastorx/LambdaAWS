// var im = require('imagemagick');
var fs = require('fs');
var gm = require('gm');

// gm('max-small_height.jpg')
// .size(function (err, size) {
//   if (err) throw err
//   console.log(size.width > size.height ? 'wider' : 'taller than you');
// });

gm('chat.jpg')
//    .blur(10, 10)
//    .rotate('white',-25)
//    .resize(250, 250, "!")
    .crop(250, 250, 50, 60)
    .write('lscp.jpg', function(err){
    if (err) throw err
    console.log("Written montage image.")});

const blur = (event, callback) => {
    gm(event.file_image)
	.blur(event.p1, event.p2)
	.write(event.file_image, function(err){
	    if (err) throw err
	    
	});
};

exports.handler = (event, callback) => {
    const op = event.op
    delete event.op;
    if (operation) {
	console.log("Operation requested");
    }
    switch (op) {
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
    default :
	callback(new Error("Unrecognized operation ${operation}"));
    }
};
