/********************************************************************************
*  WEB422 – Assignment 2
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Jonathan Diaz Ospina Student ID: 122798226 Date: 2024-02-09
*
*  Published URL: https://wide-eyed-jersey-bat.cyclic.app
*
********************************************************************************/


const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv")
const ListingsDB = require("./modules/listingsDB.js");

dotenv.config();

const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const db = new ListingsDB();

app.use(cors());

app.use(express.static(path.join(__dirname)));


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});



app.get("/", (req,res) => {
  // res.json({ message: "API Listening" });
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST /api/listings
app.post('/api/listings', async (req, res) => {
  
  try {

    const newListing = await db.addNewListing(req.body);
    res.status(201).json(newListing);
    
  } catch (error) {
    res.status(500).json({ error: "Failed to add a new listing."})
    
  }

});

// GET /api/listings
app.get('/api/listings', async (req, res) => {

  try {
    page = parseInt(req.query.page);
    perPage = parseInt(req.query.perPage);
    names = (req.query.name || "");

    db.getAllListings(page, perPage, names).then((pageListing) =>{
      res.status(200).json(pageListing);
    });


  } catch (error) {
    res.status(500).json({error: "Failed fetch Listing"})
  }
});

// GET /api/listings/:id
app.get('/api/listings/:id', async (req, res) => {

  const listingID = req.params.id;

  try {
    db.getListingById(listingID).then((listID) =>{
      if (listID) {
        res.status(200).json(listID);
      } else {
        res.status(404).json({ error: "Listing not found." });
      }
    });
  } catch (error) {
    res.status(500).json({error: "Failed listing by ID"})
  }

});

// PUT /api/listings/:id
app.put('/api/listings/:id', async (req, res) => {
  const listingId = req.params.id;
  const newData = req.body;

  try {
    
    db.updateListingById(newData, listingId).then((upList) => {
      if (upList) {
        res.status(200).json(upList);
      } else {
        res.status(404).json({ error: "Listing not found." });
      }
    });
    

  } catch (error) {
    res.status(500).json({error: "Failed updating List"})
  }
});

// DELETE /api/listings/:id
app.delete('/api/listings/:id', async (req, res) => {
  
  const listingId = req.params.id;

  try {
    
    db.deleteListingById(listingId).then((delList) => {
      if (delList) {
        res.status(204).json(delList);
      } else {
        res.status(404).json({ error: "Listing not found." });
      }
    });
    

  } catch (error) {
    res.status(500).json({error: "Failed deleting List"})
  }

});