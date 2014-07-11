var express = require('express'),
wine = require('./routes/url');
 
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

 
app.get('/url', wine.findAll);
app.get('/url/:id', wine.findById);
app.post('/url', wine.addUrl);
app.delete('/url/:id', wine.deleteUrl);




app.listen(3000);
console.log('Listening on port 3000...');