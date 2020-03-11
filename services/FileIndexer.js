const path = require("path");
const fs = require("fs");

require("dotenv").config();
const { LIBRARY_DIR } = process.env;

const FileIndexer = {
	buildIndexRoot: path.join(process.cwd(), LIBRARY_DIR),
	accumulator: [],

	buildIndex(dir) {
		dir = dir || this.buildIndexRoot;
		let files = fs.readdirSync(dir);
		files.forEach(file => {
			if (file.indexOf(".DS_Store") > -1) {
				return;
			}
			let thisFile = path.join(dir, file);
			if (fs.statSync(thisFile).isDirectory()) {
				this.accumulator = this.buildIndex(thisFile);
			} else {
				let stat = fs.statSync(thisFile);
				this.accumulator.push({
					inode: stat.ino,
					fullPath: thisFile,
					relativePath: thisFile.replace(this.buildIndexRoot, ""),
					fileSize: stat.size, // bytes
					createdTime: stat.birthtimeMs,
					tier: thisFile.replace(this.buildIndexRoot, "").split("/").length - 1,
				});
			}
		});

		// we want to sync up with db here
		// check existing files
		// update file size if relevant
		// remove file if entry exists

		return this.accumulator;
	},
};

module.exports = FileIndexer;
