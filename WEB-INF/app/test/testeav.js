/**
 * @fileOverview runs some tests on google datastore
 * the appenginejs package must be installed in your ringojs setup
 * additionally, in RINGOJS_HOME/lib folder we must add:
 * - appengine-api-1.0-sdk-1.4.2.jar from APPENGINE_SDK_HOME/lib/user/appengine-api-1.0-sdk-1.4.2.jar
 * - appengine-api-stubs.jar from APPENGINE_SDK_HOME/lib/impl/appengine-api-stubs.jar
 * - appengine-testing.jar from APPENGINE_SDK_HOME/lib/testing/appengine-testing.jar
 *
 * It should be run from WEB-INF/app folder as i have relative paths in the code.
 * 
 */
addToClasspath("/sdb1/apps/appengine/lib/testing/appengine-testing.jar");
addToClasspath("/sdb1/apps/appengine/lib/impl/appengine-api.jar");
addToClasspath("/sdb1/apps/appengine/lib/impl/appengine-api-stubs.jar");
addToClasspath("/sdb1/apps/appengine/lib/impl/appengine-api-labs.jar");

require('ringo/engine').addRepository("./");
var localServiceTestHelper = com.google.appengine.tools.development.testing.LocalServiceTestHelper;
var localDBTestConfig = com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
var nsManager = com.google.appengine.api.NamespaceManager;
var dbConfig = new localDBTestConfig();
dbConfig.setNoStorage(false);
dbConfig.setNoIndexAutoGen(true);
dbConfig.setBackingStoreLocation('../appengine-generated/local_db.bin');
var helper = new localServiceTestHelper(dbConfig);
helper.setUp();
nsManager.set(nsManager.getGoogleAppsNamespace());
helper.setEnvAppId("jajabash");
helper.setEnvAuthDomain("gmail.com");
var m = require('model');
print("loaded model");
var qy = require('google/appengine/ext/db/query');

var pkeys = [];
var ckeys = [];

for(var i=0;i<10;i++){
 var podcast = new m.Podcast({name: "music_"+i, description: "desc_"+1, homePageURL: "http://my"+i+"site.com", feedURL: "http://my"+i+"site.com/feed"+i+".xml"});
 podcast.put();
 pkeys.push(podcast.key());
}
print("after podcast put");

for(var i=0;i<3;i++){
 var categ = new m.Category({name: "categ_"+i});
 categ.put();
 ckeys.push(categ.key());
}
print("after categ put");

for(var i=0;i<pkeys.length;i++) {
 var cidx = i%3;
 if(cidx == 3) {cidx = 0;}
 var pc = new m.PodcastCategory({categ: ckeys[cidx], podcast: pkeys[i]});
 pc.put();
}
print('after podcastcategory put');

var allPodcasts = m.Podcast.all().fetch();
for(var i=0;i<allPodcasts.length;i++) {
 print(allPodcasts[i].key()+' - '+allPodcasts[i]['name']+' - '+allPodcasts[i]['description']+' - '+allPodcasts[i]['feedURL']);
}

var exCateg = null;

var allCategs = m.Category.all().fetch();
for(var i=0;i<allCategs.length;i++) {
 if(i===0) {
 /*for(var k in allCategs[i]) {
  print('attribute '+k + ' = '+allCategs[i][k]);
 }*/
  exCateg = allCategs[i];
 }
 print(allCategs[i].key()+' - '+allCategs[i]['name']+' - '+allCategs[i]['podcastsNumber']);
}

print(' -------------------------- ');

var query = new qy.Query(m.PodcastCategory, false, true, false, false);
query.filter('categ = ', exCateg);
var podcastsInFirstCateg = query.fetch();
for(var i=0; i<podcastsInFirstCateg.length; i++) {
 print(podcastsInFirstCateg[i].key() + ' - ' + podcastsInFirstCateg[i]['categ']['name'] + ' - ' + podcastsInFirstCateg[i]['podcast'].key());
}

print(' ----------|||||---------------- ');

var allPodcastCategory = m.PodcastCategory.all().fetch();
for(var i=0;i<allPodcastCategory.length;i++) {
 print(allPodcastCategory[i].key()+' - '+allPodcastCategory[i]['categ']['name']+' - '+allPodcastCategory[i]['podcast']['name']);
}

// remove all podcasts
for(var i=0;i<allPodcasts.length;i++) {
 allPodcasts[i].remove();
}
print('removed all podcasts');

// remove all categs
for(var i=0;i<allCategs.length;i++) {
 allCategs[i].remove();
}

// remove all podcastcategs
for(var i=0;i<allPodcastCategory.length;i++) {
 allPodcastCategory[i].remove();
}

print('removed all categs');

helper.tearDown();

print("calling quit() ");
quit();

