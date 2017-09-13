
/* Dependencies */
var mongoose = require('mongoose'), Listing = require('../models/listings.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message.
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function(req, res) {

    /* Instantiate a Listing */
    var listing = new Listing(req.body);

    /* save the coordinates (located in req.results if there is an address property) */
    if (req.results)
    {
        listing.coordinates = {latitude: req.results.lat, longitude: req.results.lng};
    }

    /* Then save the listing */
    listing.save(function(err) {
        if (err)
        {
            console.log(err);
            res.status(400).send(err);
        }
        else
        {
            res.json(listing);
        }
    });
};

/* Show the current listing */
exports.read = function(req, res) {

    /* send back the listing as json from the request */
    res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res) {
    var listing = req.listing;

    /* Replace the article's properties with the new properties found in req.body */
    var code = req.body.code;
    var name = req.body.name;
    var address = req.body.address;

    /* save the coordinates (located in req.results if there is an address property) */
    var coordinates = null;
    if(address !== null)
    {
        coordinates = req.results;
    }

    /* Save the article */
    Listing.findOneAndUpdate({"name": name }, 
    { $set: { "address": address, "name": name, "code": code, "coordinates": coordinates}},
    {new: true},
    function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
        else{
            console.log(doc);
            res.json(doc);
        }
    });
};

/* Delete a listing */
exports.delete = function(req, res) {
    var listing = req.listing;
    query = {code: listing.code};

    Listing.find(query, function(err, docs) {
        if (err){ 
            console.log(err);
            res.status(400).send(err);
        }
    }).remove(function(err, docs){
        if(err)
        {
            console.log(err);
            res.status(400).send(err);
        }
        else
        {
            res.json(listing);
        }
    });
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
    Listing.find().sort({code: 1}).exec(function(err, docs) {
        if (err)
        {
            res.status(400).send(err);
        }
        else
        {
            res.json(docs);
        }
    });
};

/*
  Middleware: find a listing by its ID, then pass it to the next request handler.

  HINT: Find the listing using a mongoose query,
        bind it to the request object as the property 'listing',
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
    Listing.findById(id).exec(function(err, listing) {
        if (err)
        {
            res.status(400).send(err);
        }
        else
        {
            req.listing = listing;
            next();
        }
    });
};