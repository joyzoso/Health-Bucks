var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var mineCraftRoute = express.Router();
var parser = require('body-parser');

app.use(parser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Global data
var bucksData;


// Asynchronously read file contents, then call callbackFn
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

function initServer() {
  // When we start the server, we must load the stored data
  var defaultList = "[]";
  readFile("data.txt", defaultList, function(err, data) {
    bucksData = JSON.parse(data);
  });
}

// Function for MineCraft Time
function getTimeFn(request, response) {
  readFile('data.txt', request, function(err, data) {
    if (err) {
      console.log("Recheck Request Please")
      response()
    }
    else {
      bucksData = JSON.parse(data);
      response(data);
    }
  })
}



mineCraftRoute.get("/time", function(req, res) {
  readFile('data.txt', req, function(err, data) {
    if (err) {
      console.log("Recheck Request Please")
      res.json({"message": "Recheck Request Please"})
    }
    else {
      bucksData = JSON.parse(data);
      res.json({"user": data})
    }
  })
})

mineCraftRoute.put("/time", function(req, res) {
  var id = req.params._id;
  var user = req.body;
  if (user._id == id) {
    console.log("Wrong ID");
    return res.status(401).json({err: "Wrong ID"})
  }

  //OLD
  // User.findByIdAndUpdate(id, user, {new: true}, function(err, user) {
  //   if (err) {
  //       return res.status(500).json({"err": err.message, 'message':'Profile Failed Updated'});
  //   }
  //   res.send({'user': user, 'message':'Profile Updated'});
  // })
})

// Mine Craft Route to Call
app.use('/api/mc', mineCraftRoute);

// Finally, initialize the server on any port, and go to that url
// in your browser
initServer();
app.listen(8889);
