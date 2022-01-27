// Create and export configration environment

//container for all the environment
var environments = {};

// Staging {default} environment

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "thisIsASecret",
};

//Production environment

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "staging",
  hashingSecret: "thisIsASecret",
};

// Determine which environment was passed as a command-line argument

var currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Check that the current environment is one the environment above, if not default to staging.

var environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

//Export the Module

module.exports = environmentToExport;
