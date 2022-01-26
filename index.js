//primary file to API

//Dependencies
const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./lib/config");
const _data = require("./lib/data");
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
  unifiedServer(res, req);
});

//start  the http server
httpServer.listen(config.httpPort, function () {
  console.log(`The server is listening on ${config.httpPort} in mode`);
});

// This instiantate the https server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};
const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  // Get the url and parse it
  unifiedServer(res, req);
});

// This instiantate the https server
httpsServer.listen(config.httpsPort, function () {
  console.log(`The server is listening on ${config.httpsPort} in mode`);
});
// All the server logics for both http and https servers

const unifiedServer = function (req, res) {
  const parsedUrl = url.parse(req.url, true);

  //Get path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //get Http method
  const method = req.method.toLocaleLowerCase();

  //get the query string as an object
  const queryStringObject = parsedUrl.query;

  // gets the headers as an object
  const headers = req.headers;

  //get the payload if any
  var decoder = new StringDecoder("utf-8");
  var buffer = "";

  req.on("data", function (data) {
    buffer += decoder.write(data);
    //console.log(data.stringify());
  });

  req.on("end", function () {
    buffer += decoder.end();

    //choose the handler where this request goes to
    const choosenHandler =
      typeof router[trimmedPath] !== "undefineded"
        ? router[trimmedPath]
        : handlers.notFound;

    //construct data object to send the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      mehtod: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // route the request to the handler specified in the router
    choosenHandler(data, function (statusCode, payload) {
      // use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // use the payload called back by the handler, or default to  an empty object
      payload = typeof payload == "object" ? payload : {};

      //convert th paylaod to a string.
      var payloadString = JSON.stringify(payload);

      //return the response
      res.setHeader("Content-Type", "Application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log(" Returning this response: ", statusCode, payloadString);
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
