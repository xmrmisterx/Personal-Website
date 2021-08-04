const { urlencoded } = require('body-parser');
const { query } = require('express');
var express = require('express');
// var request = require('request');
const https = require('https');
// var mysql = require('./dbcon.js');
var CORS = require('cors');

var app = express();
// var router = express.Router();
app.set('port', 5125);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CORS());

app.get('/:str', (req, res) => {

  query_str = req.params.str;
  console.log("req.params.str: " + query_str);

  https.get("https://en.wikipedia.org/w/api.php?action=query&titles=" + query_str + "&prop=pageimages&format=json&formatversion=2&pithumbsize=300", (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      // console.log("data: " + data);
      parsed_JSON = JSON.parse(data);
      // console.log("parsed_JSON: " + parsed_JSON);
      var img_url = parsed_JSON.query.pages[0].thumbnail.source;
      res.send(img_url);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

// router.get('/', (req, res) => {

//   query_str = req.query.value;

//   https.get("https://en.wikipedia.org/w/api.php?action=query&titles=" + query_str + "&prop=pageimages&format=json&formatversion=2&pithumbsize=300", (resp) => {
//     let data = '';

//     // A chunk of data has been received.
//     resp.on('data', (chunk) => {
//       data += chunk;
//     });

//     // The whole response has been received. Print out the result.
//     resp.on('end', () => {
//       // console.log("data: " + data);
//       parsed_JSON = JSON.parse(data);
//       // console.log("parsed_JSON: " + parsed_JSON);
//       var img_url = parsed_JSON.query.pages[0].thumbnail.source;
//       res.send(img_url);
//     });

//   }).on("error", (err) => {
//     console.log("Error: " + err.message);
//   });
// });

// app.use("/", router);

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

// lol, so we tried HTTP request and it didn't work, but we changed it to not parse the data, and now it works, so I guess that's good.
// Ok, we finally get the image url to send back in res. but is that where we want to send it?

// Yeah, that looks to be ok. Now what, we have our microservice up, apparently. Now we need to get our code to call it. We're gonna have
// to go to sleep but yeah, tomorrow, we need to finish this up.

// We need to call... Ok, so we realized we don't need that router thing anyway. Anyways, this seems to be working. Now, we need to call
// our microservice from the mountain pages, then we need to set up our forever on our node (maybe not though, just locally for now since
// the TAs won't visit). We definitely need to 
// a) move our website stuff into the public html folder (get the permissions, chd 4555 or something?) (move the csv table image via github
// as well?)
// b) do status update #4
// c) make video
// d) commit code to github and get screenshot
// e) create a release and get screenshot

// Ok, so we got the CORS error again, and tinkered for an hr 15 mins before fixing it. First, we required cors, then we had to app.use
// cors. It still wasn't working, so on a whim, we looked at the file in the public html, and it didn't use the proxy, so we removed it,
// and it finally worked that way jesus. Our image url was in the responsetext of req. 

// Ok, now we need to make sure all the pages work, then move it to the public html folder and test there. Alright, so, to turn on 
// forever, we needed to download the node module, which we forgot how to do, so we just put our index file into the database folder
// that had the workout log assignment. Then, to start forever, we typed "./node_modules/forever/bin/forever start index.js 5125",
// where "index.js" is the file name and "5125" is the port number. We can also access the forever list with:
// ""./node_modules/forever/bin/forever list".

// Ok, so it seems everything is working now. We need to move our pic to the download page, so let's do that. Ok, so we've moved 
// everything into the public html folder, gave it access, turned on our forever server. Now, we just need to:

// c) make video
// d) commit code to github and get screenshot
// e) create a release and get screenshot

// Interesting, so we update this index.js code in this database file, then try to open up our website, and the mountains aren't loading.
// We check our forever list, and it looks like it's still running. I guess we'll stop it and rerun it since it probably can't save when
// in the forever process? Ok, so that did work. We were able to stop our only forever process with "./node_modules/forever/bin/forever
// stopall" then restart it with "./node_modules/forever/bin/forever start index.js 5125", and our code works now. We want to remove the
// console.log actually, since that was only for testing purposes, and it's actually not even coming up since we ran the forever on it.