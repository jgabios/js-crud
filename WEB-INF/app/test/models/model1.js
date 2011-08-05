
var db = require("google/appengine/ext/db");

var Podcast = exports.Podcast = db.Model("podcast", {
   name: new db.StringProperty(),
   description: new db.TextProperty(),
   homePageURL: new db.StringProperty(),
   feedURL: new db.StringProperty()
});

var Category = exports.Category = db.Model("category", {
   name: new db.StringProperty(),
   podcastsNumber: new db.IntegerProperty()
});

Category.updateProperties({parentCategory : new db.ReferenceProperty({referenceClass: Category})});

exports.PodcastCategory = db.Model("podcastcategory", {
   category: new db.ReferenceProperty({referenceClass: Category}),
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