var config = {};

config.port = process.env.PORT || 3000;

// Database configration
config.databaseUrl='mongodb://localhost/ciscotest';
// smtp configration
config.emailTo="dhanjivkumar@gmail.com";

module.exports = config;