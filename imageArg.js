var im = require('imagemagick');
var fs = require('fs');

// function convert(event, callback) {
//     if (event.base64Image) {
//         inputFile = `/tmp/inputFile.${(event.inputExtension || 'png')}`;
//         var buffer = new Buffer(event.base64Image, 'base64');
//         fs.writeFileSync(inputFile, buffer);
//         event.customArgs.unshift(inputFile);
//     }
//     im.convert()
// }

// var event = {''};

// im.convert(event, function(err, stdout){
//   if (err) throw err;
//   console.log('stdout:', stdout);
// });


var event = {srcData:fs.readFileSync('max.jpg'), format: 'png'};

im.resize( event, function(err, stdout, stderr){
  if (err) throw err
  fs.writeFileSync('kittens.${event.format}', stdout, 'binary');
  console.log('convert done !')
});