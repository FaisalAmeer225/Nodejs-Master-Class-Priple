// Create and export configration environment


//container for all the environment
const environments = {};

// Staging {default} environment

environments.staging = {
'port': 3000,
'envName': 'staging'
};

//Production environment

environments.production = {
'port': 5000,
'envName': 'staging'
}

// Determine which environment was passed as a command-line argument

const currentEnvironment =  typeof(process.env.NODE_ENV) =='string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one the environment above, if not default to staging.

const environmentToExport = typeof(environments[currentEnvironment]) =='object' ? environments[currentEnvironment] : environments.staging;

//Export the Module

module.exports = environmentToExport