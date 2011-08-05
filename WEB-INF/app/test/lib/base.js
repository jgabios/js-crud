/**
 * @fileOverview runs some tests on google datastore
 * the appenginejs package must be installed in your ringojs setup
 * additionally, in RINGOJS_HOME/lib folder we must add:
 * - appengine-api-1.0-sdk-1.4.2.jar from APPENGINE_SDK_HOME/lib/user/appengine-api-1.0-sdk-1.4.2.jar
 * - appengine-api-stubs.jar from APPENGINE_SDK_HOME/lib/impl/appengine-api-stubs.jar
 * - appengine-testing.jar from APPENGINE_SDK_HOME/lib/testing/appengine-testing.jar
 *
 * It should be run from WEB-INF/app folder as i have relative paths in the code.
 * --package folder should be specified for the appengine package
 * 
 */

var APPENGINE_FOLDER = '/home/gmunteanu/progs/appengine-java-sdk-1.4.3/lib/';
addToClasspath(APPENGINE_FOLDER + "testing/appengine-testing.jar");
addToClasspath(APPENGINE_FOLDER + "impl/appengine-api.jar");
addToClasspath(APPENGINE_FOLDER + "impl/appengine-api-stubs.jar");
addToClasspath(APPENGINE_FOLDER + "impl/appengine-api-labs.jar");

var DATASTORE_FILE = '../appengine-generated/local_db.bin';

var localServiceTestHelper = com.google.appengine.tools.development.testing.LocalServiceTestHelper;
var localDBTestConfig = com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
var nsManager = com.google.appengine.api.NamespaceManager;
var dbConfig = new localDBTestConfig();
dbConfig.setNoStorage(false);
dbConfig.setNoIndexAutoGen(false).setStoreDelayMs(1);
dbConfig.setBackingStoreLocation(DATASTORE_FILE);
var helper = new localServiceTestHelper(dbConfig);

exports.test = function(testFunction){
  helper.setUp();
  nsManager.set(nsManager.getGoogleAppsNamespace());
  helper.setEnvAppId("jajabash");
  helper.setEnvAuthDomain("gmail.com");
  testFunction();
  helper.tearDown();
}

