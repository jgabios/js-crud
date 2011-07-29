/**
 * @fileOverview model.js contains our value objects, that we use to model our application.
 * we have a mix of ringojs model and appenginejs way of doing things.
 * I will keep the appenginejs way, as I intend to make ringopress google appengine only.
 */
var config = require('./config');
var db = require("google/appengine/ext/db");

// maybe i will go full appenginejs low-level GDS with the entities and persistence
// for now, only the plugins stored in the db will be GDS [google datastore]

var Podcast = exports.Podcast = db.Model("podcast", {
   name: new db.StringProperty(),
   description: new db.TextProperty(),
   homePageURL: new db.StringProperty(),
   feedURL: new db.StringProperty()
});

var Category = exports.Category = db.Model("category", {
   name: new db.StringProperty(),
   podcastsNumber: new db.IntegerProperty(),
   parentCategory : new db.ReferenceProperty({referenceClass: Category})
});

exports.PodcastCategory = db.Model("podcastcategory", {
   categ: new db.ReferenceProperty({referenceClass: Category}),
   podcast: new db.ReferenceProperty({referenceClass: Podcast})
});

exports.Counter = db.Model("counter", {
    entityName : new db.StringProperty(),
    counter : new db.IntegerProperty()
});

exports.Config = {
    "Category" : {
        "crudable" : true
    },
    "Podcast" : {
        "crudable" : true
    },
    "Counter" : {
        "crudable" : false
    },
    "PodcastCategory" : {
        "crudable" : false,
        "relation" : {
            "child" : "Podcast",
            "parent" : "Category"
        }
    }
}