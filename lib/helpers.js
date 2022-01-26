/**
 *
 * Helpers for various tasks. e.g hash password
 */
// Dependencies

const {config} = require("./config");
const crypto = require("crypto");

//Container for all helpers
const helpers = {};

helpers.hash = function (str) {
  if (typeof str == "string" && str.length > 0) {
    const hash = crypto
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
    const obj = JSON.parse(str);
  } catch (e) {
    return {};
  }
};

// Export moduel
module.exports = helpers;
