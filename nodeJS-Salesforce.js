//
// # nodeJS-Salesforce
//
// A simple Node JS+Salesforce example using JSForce
//
var http = require('http');
var path = require('path');


var jsforce = require('jsforce');
var conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  //loginUrl : 'https://test.salesforce.com' //sandbox
  loginUrl : 'https://login.salesforce.com' //dev and production
});

var username = ''; //username;
var password = ''; //password + security token;

conn.login('username', 'password', function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);

  //After creating the connection, do some CRUD operations
  
  //create an Account, update it and then query for it to verify the updated name
  //NOTE: Consider using Javascript Promises if nested callbacks get out of hand
  conn.sobject("Account").create({ Name : 'Created Account #1' }, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }
    else{
      console.log("Created record id : " + ret.id); 
      var accountId = ret.id;
      //Update call
      conn.sobject("Account").update({ 
        Id : accountId,
        Name : 'Updated Account #1'
        }, function(err, ret) {
        if (err || !ret.success) { return console.error(err, ret); }
        console.log('Updated Successfully : ' + ret.id);
        //Requery to confirm account name change
        conn.query("SELECT Id, Name FROM Account WHERE Id='" + accountId + "'", function(err, result) {
          if (err) { return console.error(err); }
          console.log("account Name : " + result.records[0].Name);
          });         
        }); 
    }
  });        

  
});
