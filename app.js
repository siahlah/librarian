const path = require("path");
const args = process.argv;

const app = require("express")();

const FileIndexer = require("./services/FileIndexer");

if (args[2] == "index") {
	console.log("index mode");
}

if (args[2] == "library") {
	console.log("library mode");
}

// init with path
let index = FileIndexer.buildIndex();

app.get("/", (req, res) => {
	res.send(index);
});

app.listen(3000);
