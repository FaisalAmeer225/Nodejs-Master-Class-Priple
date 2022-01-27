//primary file to API

//Dependencies
const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./lib/config");
//const _data = require("./lib/data");
const handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");

//Testing
// @TODO delete this

//to read file
// _data.read("test", "newFile", function (err, data) {
//   console.log("this was the err", err, "this was the data", data);
// });
// to write file
// _data.create("test", "newFile", { foo: "baar" }, function (err) {
//   console.log("this was the err", err);
// });

//Update file
// _data.update("test", "newFile", { fisszzz: "buzz" }, function (err) {
//   console.log("this was the err", err);
// });

//DeleteFile
//_data.delete("test", "newFile", function (err) {
// console.log("this was the err", err);
//});

// This instiantate the http server
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

//start  the http server
httpServer.listen(config.httpPort, function () {
  console.log("The HTTP server is running on port " + config.httpPort);
});

// This instiantate the https server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};
const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});

// This instiantate the https server
httpsServer.listen(config.httpsPort, function () {
  console.log("The HTTPS server is running on port " + config.httpsPort);
});
// All the server logics for both http and https servers

const unifiedServer = function (req, res) {
  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  // Get the payload,if any
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof payload == "object" ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log(trimmedPath, statusCode);
    });
  });
};

// Define a request router
const router = {
  // sample: handlers.sample,
  ping: handlers.ping,
  users: handlers.users,
};

// const handler = {};

// //sample handlers

// handler.sample = function (data, callback) {
//   //callback a http status code, and payload object
//   callback(406, { name: "sample handler" });
// };

// //not found handler
// handler.notFound = function (data, callback) {
//   callback(404);
// };
// const router = {
//   sample: handler.sample,
// };
