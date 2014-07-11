var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('url', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'url' database");
        db.collection('url', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'urls' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving url: ' + id);
    db.collection('url', function(err, collection) {
        collection.findOne({'urlshort':id}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('url', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addUrl = function(req, res) {
    var url = req.body;

    var now = new Date();
    console.log('Adding url: ' + JSON.stringify(url));
    var urlshort = Math.floor(Math.random() * 10) + parseInt(now.getTime()).toString(36).toUpperCase();
    //url shortGenerating the random String
    url.urlshort = urlshort;
    db.collection('url', function(err, collection) {
        collection.insert(url, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

 
exports.deleteUrl = function(req, res) {
    var id = req.params.urlshort;
    console.log('Deleting url: ' + id);
    db.collection('url', function(err, collection) {
        collection.remove({'urlshort':id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var urls = [
    {
        urlshort: "0001",
        url: "http://www.google.com"        
    },
    {
        urlshort: "002",
        url: "http://www.yahoo.com"  
    }];
 
    db.collection('url', function(err, collection) {
        collection.insert(urls, {safe:true}, function(err, result) {});
    });
 
};