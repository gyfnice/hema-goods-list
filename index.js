require("module-alias/register");
const { run, getHotGoodsList } = require("./api.js");
const { runServer } = require("./server.js");
require("dotenv").config();

//run();
runServer();
//getHotGoodsList({ storeId: 369687486, pn: 1 });

