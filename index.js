require("module-alias/register");
const { run } = require("./api.js");
const { runServer } = require("./server.js");
require("dotenv").config();

//run();
runServer();
