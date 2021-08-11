var config = {};

config.port = process.env.PORT || 3000;

// Database configration
config.databaseUrl='http://localhost:3000/tasks';
// smtp configration
config.emailTo="dhanjivkumar@gmail.com";

module.exports = config;