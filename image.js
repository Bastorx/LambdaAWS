var im = require('imagemagick');
var fs = require('fs');


im.resize({
  srcPath: 'max.jpg',
  dstPath: 'max-small_mix.jpg',
  progressive: true,
  width: 256, 
  height:   256, 
}, function(err, stdout, stderr){
  if (err) throw err;
  console.log('max-small.jpg done !!!');
});