function log(req, res, next) {
  console.log("Logging...");
  next();
}

function Logger() {
  console.log("Hello it's me");
}

module.exports = log;
