/**
 *
 * Helpers for various tasks. e.g hash password
 */
// Dependencies

var { config } = require("./config");
var crypto = require("crypto");

//Container for all helpers
var helpers = {};

helpers.hash = function (str) {
  if (typeof str == "string" && str.length > 0) {
    var hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Parse a json string to all cases without throwing

helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
  } catch (e) {
    return {};
  }
};

// Export moduel
module.exports = helpers;
