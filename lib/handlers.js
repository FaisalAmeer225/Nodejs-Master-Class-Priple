/**
 * Request handlers
 */

// Dependencies
var _data = require("./data");
var { hash } = require("./helpers");

// Define the handler
var handlers = {};

// Users
handlers.users = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for the users submethod
handlers._users = {};

// Users - post
// Require data = firstName, lastName, Phone, password, tosAgreement
// Optional data = none
handlers._users.post = function (data, callback) {
  // post will check that are required fields are filled out
  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  var Phone =
    typeof data.payload.Phone == "string" &&
    data.payload.Phone.trim().length == 10
      ? data.payload.Phone.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  var tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;

  if (firstName && lastName && Phone && password && tosAgreement) {
    // Make sure user doesn't exist
    _data.read("users", Phone, function (err, data) {
      if (!err) {
        // hash the password
        var hashedPassword = hash(password);

        // Create user object
        if (hashedPassword) {
          var userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: Phone,
            hashedPassword: hashedPassword,
            tosAgreement: tosAgreement,
          };

          // Store the user
          _data.create("users", Phone, userObject, function (err, callback) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "Sorry Could not create the user" });
            }
          });
        } else {
          callback(500, { Error: "could not hash the user's password" });
        }
      } else {
        callback(400, { error: "a user with the phone number already exist" });
      }
    });
  } else {
    callback(400, { error: "missing required fields" });
  }
};
// Users - get
// Required data: phone
// Required data: none
// @TODO only let authenticated user to get access their object. No other user  can access the object.

handlers._users.get = function (data, callback) {
  // Check that phone number is valid
  var Phone =
    typeof data.queryStringObject.Phone == "string" &&
    data.queryStringObject.Phone.trim().length == 10
      ? data.queryStringObject.Phone.trim()
      : false;
  if (Phone) {
    // Lookup the user
    _data.read("users", Phone, function (err, data) {
      if (!err && data) {
        // Remove the hash password before returning it to the requester
        delete data.password;
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required phone number" });
  }
};

handlers._users.put = function (data, callback) {};

handlers._users.delete = function (data, callback) {};

//sample handlers

// handlers.sample = function (data, callback) {
//   //callback a http status code, and payload object
//   callback(406, { name: "sample handler" });
// };

handlers.ping = function (data, callback) {
  callback(200);
};

//not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

module.exports = handlers;
