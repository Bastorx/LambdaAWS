// var im = require('imagemagick');
var fs = require('fs');
var gm = require('gm');

// gm('max-small_height.jpg')
// .size(function (err, size) {
//   if (err) throw err
//   console.log(size.width > size.height ? 'wider' : 'taller than you');
// });

gm('max-small_height.jpg').blur(10, 10).write('lscp.jpg', function(err){
    if (err) throw err
    console.log("Written montage image.")});
