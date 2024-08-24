const config = require("config");


module.exports = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET environment variable");
    }

    console.log("Application Name:" + config.get('name'));

    if (process.env.NODE_ENV === "development") {
        console.log("Start in development");
    }
}