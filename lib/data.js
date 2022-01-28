/* Library for storing and editing data */

// Dependencies

var fs = require("fs");
var path = require("path");

// Container for module to be exported
var lib = {};

// Base directory created for data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// Writing data into file

lib.create = function (dir, file, data, callback) {
  // Openning the file for writing into it
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //Converting the data to string
        var stringData = JSON.stringify(data);

        // Writing File and closing it

        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("error closing new file");
              }
            });
          } else {
            callback("error writing to new file");
          }
        });
      } else {
        callback("could not created file it may already exist");
      }
    }
  );
};
//read data from file

lib.read = function (dir, file, callback) {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf-8",
    function (err, data) {
      callback(err, data);
    }
  );
};

//Update the data inside a file
lib.update = function (dir, file, data, callback) {
  //open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        // Convert data to string
        var stringData = JSON.stringify(data);

        // truncate file
        fs.ftruncate(fileDescriptor, function (err) {
          if (!err) {
            // Write to the file and close it
            fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("error closing the file");
              }
            });
          } else {
            callback("error truncating the file");
          }
        });
      } else {
        callback("couldnot open the file for updating, it may not exist yet");
      }
    }
  );
};

// Deleting the file

lib.delete = function (dir, file, callback) {
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", function (err) {
    if (!err) {
      callback(false);
    } else {
      callback("error deleting file");
    }
  });
};
// Exported Module
module.exports = lib;
