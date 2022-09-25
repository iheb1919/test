const prompt = require('prompt');
const start = require('./pages')
const properties = [
    {
        name: 'book',
        validator: /^[a-zA-Z\s-]+$/,
        warning: 'book must be only letters'
    }
];
prompt.start();
prompt.get(properties, function (err, result) {
  if (err) {
    return console.log(err);
  }
  start.startScrap(result.book.split(" ").map(x=> x.charAt(0).toUpperCase() + x.substring(1)).join(" "));
});


