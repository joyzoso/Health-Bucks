var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var mineCraftRoute = express.Router();
var parser = require('body-parser');

app.use('/', express.static('public'));

// Daniel Uses This Body Parser
app.use(parser.json());
// Kim Uses This Body Parser
app.use(bodyParser());

// Global store of our app's data
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

// get credit
app.get("/credit", function(request, response){
  response.status(200).send({
    credit: bucksData.credit,
    "user": bucksData
  });
});

// update credit
app.put("/credit", function(request, response) {
  console.log(request.body);

  if(request.body.add) {
    bucksData.credit = bucksData.credit + 20;
  } else if(request.body.checkoutCredit) {
    var tempCredit = bucksData.credit;
    if(tempCredit - request.body.checkoutCredit < 0) {
      return response.status(200).send({error: "Sorry, you don't have enought credit to get this."});
    }
    bucksData.credit = bucksData.credit - request.body.checkoutCredit;
  }

  writeFile("health-bucks.json", JSON.stringify(bucksData));

  return response.status(200).send({credit: bucksData.credit});
});

function initServer() {
  // When we start the server, we must load the stored data
  var defaultList = {};
  readFile("health-bucks.json", defaultList, function(err, data) {
    bucksData = JSON.parse(data);
  });
}

// Route for MineCraft Time
mineCraftRoute.get("/time", function(req, res) {
  readFile('health-bucks.json', req, function(err, data) {
    if (err) {
      console.log("Recheck Request Please")
      res.status(401).json({"message": "Recheck Request Please"})
    }
    else {
      bucksData = JSON.parse(data);
      res.status(200).send(JSON.stringify(bucksData.minecraftTime.available))
    }
  })
})
//Route For Availabe Time (SUBTRACT and ADDITION)
mineCraftRoute.put("/time", function(req, res) {
  var id = req.params._id;
  var user = req.body;
  if (req.body.remove == true) {
    bucksData.minecraftTime.available -= 1;
  }
  else if (req.body.add == true) {
    bucksData.minecraftTime.available += 1;
  }
  writeFile("health-bucks.json", JSON.stringify(bucksData));
  res.status(200).json({"time": bucksData.minecraftTime.available})
})

// Mine Craft Route to Call
app.use('/api/mc', mineCraftRoute);

// Finally, initialize the server on any port, and go to that url
// in your browser
initServer();
app.listen(8889);
