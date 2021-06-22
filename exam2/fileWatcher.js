// make sure to install yargs and node-notifier
// to run the application:
//                        node .\fileWatcher.js --name=avi --path=D:\_MASTERS_NODE_JS\folderName
// this will not work if your folder name or path has white spaces

'use strict';

const { argv, strict } = require('yargs');
const notifier = require('node-notifier');
const { EventEmitter } = require("events");
const fs = require("fs");

class FileWatcher extends EventEmitter {
    constructor() {
        super();
    }

    readFiles(fileName, path, text) {
        let that = this;
        fs.readFile(path + '\\' + fileName, 'utf-8', function (err, data) {
            // if (data) // content of the file
            //     console.log(data);
            // if (err) {
            //     console.error(err);
            //     return;
            // }
            if (data && data.toString().toLowerCase().indexOf(text) > -1) {
                that.emit("nameFoundOnFile",path + '\\' + fileName);
            }
        });
    };

    readDirectory(text, path) {
        let that = this;
        fs.readdir(path, function (err, fileNames) {
            // console.log(fileNames);
            // if (err) {
            //     console.error(err);
            //     return;
            // }

            fileNames.forEach(function (fileName) {
                if (fs.lstatSync(path + '\\' + fileName).isDirectory()) {
                    // read directory if a folder
                    that.readDirectory(text, path + '\\' + fileName);
                }
                else {
                    // read data if file
                    that.readFiles(fileName, path, text);
                }
            });

            fs.watch(path, { persistent: true }, function (event, fileName) {
                that.readFiles(fileName, path, text);
            });
        });
    };
    
    watchfolder(text, path) {
        this.readDirectory(text, path);
    };
}

const nameParam = argv.name;
const pathParam = argv.path;

if (typeof (nameParam) !== 'string' || typeof (pathParam) !== 'string')
    console.log('ERROR: Invalid parameters entered.');
else {
    console.log(`Watching path: ${pathParam}`);

    const fileWatcher = new FileWatcher();

    fileWatcher.on("nameFoundOnFile", fileName => {
        fileWatcher.emit("openToastNotification", fileName);
        fileWatcher.emit("printToConsole", fileName);
    });

    fileWatcher.on("openToastNotification", fileName => {
        notifier.notify({
            title: 'File Watcher',
            message: `Your name was mentioned on file: ${fileName}!`
        });
    });

    fileWatcher.on("printToConsole", fileName => {
        console.log(`Your name was mentioned on file: ${fileName}!`);
    });

    fileWatcher.on("error", () => {
        console.log('One or more errors occured.');
    });

    fileWatcher.watchfolder(nameParam, pathParam);
}