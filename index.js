var gm = require('gm');
gm = gm.subClass({imageMagick: true});
var aws = require('aws-sdk');

var error = "Operation requested";

const blur = (event, callback) => {
    gm(event.link)
	.blur(event.params[0], event.params[1])
	.toBuffer('PNG', function(err, buffer){
	    if (err) throw err;
        callback(null, buffer);
	});
};

const crop = (event, callback) => {
    gm(event.link)
	.crop(event.params[0], event.params[1], event.params[2], event.params[3])
	.toBuffer('PNG', function(err, buffer){
	    if (err) throw err;
	    callback(null, buffer);
	});
};

const resize = (event, callback) => {
    if (event.params[2]=='!') {
    	gm(event.link)
	    .resize(event.params[0], event.params[1], event.params[2])
	    .toBuffer('PNG', function(err, buffer){
        if (err) throw err;
        callback(null, buffer);
	    });
    }
    else {
	gm(event.link)
	    .resize(event.params[0], event.params[1])
        .toBuffer('PNG', function(err, buffer){
        if (err) throw err;
        callback(null, buffer);	    
    });
    }
};

const rotate = (event, callback) => {
    gm(event.link)
	.rotate("white", event.params[0])
        .toBuffer('PNG', function(err, buffer){
        if (err) throw err;
        callback(null, buffer);  
	});
};

const sepia = (event, callback) => {
    gm(event.link)
	   .sepia()
        .toBuffer('PNG', function(err, buffer){
        if (err) throw err;
        callback(null, buffer);  
	});
};

exports.handler = (event, context, callback) => {
    aws.config.loadFromPath('./package.json');
    const op = event.op;
    delete event.op;
    var i = 0;
    if (!op) {
    	console.log(error);
    }
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
    	default :
    	    callback(new Error("Unrecognized operation ${op}"));
	}
};
