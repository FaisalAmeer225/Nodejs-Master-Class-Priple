//primary file to API

//Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require('./config');

//server should respond to all request with a string
const server = http.createServer(function (req, res) {
  // Get the url and parse it
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
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    //construct data object to send the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      mehtod: method,
      headers: headers,
      payload: buffer,
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
});

//start server
server.listen(config.port, function () {
  console.log(`The server is listening on ${config.port} in ${config.envName} mode`);
});
const handlers = {};

//sample handlers

handlers.sample = function (data, callback) {
  //callback a http status code, and payload object
  callback(406, { name: "sample handler" });
};

//not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};
const router = {
  sample: handlers.sample,
};
