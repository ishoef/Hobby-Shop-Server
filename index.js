const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const userRoutes = require('./users');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb codes

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DBB_PASS}@hobbyshop.bhkkg8e.mongodb.net/?retryWrites=true&w=majority&appName=HobbyShop`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB and set up the API
async function run() {
  try {
    
    const groupsCollection = client.db("hobbyshop").collection("groups");

    // Groups Api

    // Get all groups
    app.get("/groups", async (req, res) => {
      const { userEmail } = req.query;
      let query = {};
      if (userEmail) {
        query.userEmail = userEmail;
      }
      const groups = await groupsCollection.find(query).toArray();
      res.send(groups);
    });    

    // Get a single group details by id
    app.get("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const group = await groupsCollection.findOne(query);
      res.send(group);
    });

    // Post a new group
    app.post("/groups", async (req, res) => {
      console.log("Yes! I got it");
      console.log(req.body);
      const newGroup = req.body;
      const result = await groupsCollection.insertOne(newGroup);
      res.send(result); // successfully catch data and send after catch
    });

    // Update a group by id
    app.put("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const group = req.body;
      const updateDoc = {
        $set: {
          groupName: group.groupName,
          category: group.category,
          description: group.description,
          location: group.location,
          imageUrl: group.imageUrl,
          startDate: group.startDate,
          maxMembers: group.maxMembers,
        },
      };
      const options = { upsert: true }; // Create a new document if no document matches the filter
      const result = await groupsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // delete a group by id
    app.delete("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await groupsCollection.deleteOne(query);
      res.send(result);
    });
   
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// api
app.get("/", (req, res) => {
  res.send("Hobby Shop Server is running");
});

app.use('/users', userRoutes)

// connection with port
app.listen(port, () => {
  console.log(`Hobby Shop Server is running on, ${port}`);
});
