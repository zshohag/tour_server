const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

//middlewire
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdjev.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(uri);
const fun = async () => {
  try {
    const toursCollection = client.db("TourD").collection("tours");
    const hotelsCollection = client.db("TourD").collection("hotels");
    const bookingsCollection = client.db("TourD").collection("bookings");
    const usersCollection = client.db("TourD").collection("users");

    //GET ALL TOURS
    app.get("/tours", async (req, res) => {
      const result = await toursCollection.find().toArray();
      //console.log(result);
      res.send(result);
    });

    // Route to get a single tour by ID

    app.get("/tours/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await toursCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Tour not found" });
      }
    });
    // GET ALL HOTELS
    app.get("/hotels", async (req, res) => {
      try {
        const result = await hotelsCollection.find().toArray();
        console.log("Hotels fetched:", result);
        res.send(result);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).send({ message: "Failed to fetch hotels" });
      }
    });

    //GET ALL BOOKINGS
    // app.get("/bookings", async (req, res) => {
    //   try {
    //     const result = await bookingsCollection.find().toArray();
    //     console.log("Hotels fetched:", result);
    //     res.send(result);
    //   } catch (error) {
    //     console.error("Error fetching hotels:", error);
    //     res.status(500).send({ message: "Failed to fetch hotels" });
    //   }
    // });

    // GET ALL BOOKINGS  BY USER'S  EMAIL
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      try {
        const query = { email: email };
        const result = await bookingsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send({ message: "Failed to retrieve bookings" });
      }
    });

    app.post("/bookings", async (req, res) => {
      try {
        const bookingData = req.body;
        const result = await bookingsCollection.insertOne(bookingData);
        res.status(201).send(result);
        console.log(result);
      } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).send({ message: "Failed to save booking" });
      }
    });

    app.delete("/bookings/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await bookingsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Booking successfully deleted" });
        } else {
          res.status(404).json({ message: "Booking not found" });
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Failed to delete booking" });
      }
    });



    // GET ALL USERS
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      //console.log(result)
      res.send(result);
    });

    // USERS POST IN DATABASE
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      console.log("existingUser", existingUser);
      if (existingUser) {
        return res.send({ message: " USER ALREADY EXISTS " });
      }
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    //
  } finally {
  }
};

fun().catch(console.log);

app.get("/", (req, res) => {
  res.send(" Z, SERVER IS RUNNING");
});

app.listen(port, () => {
  console.log("Z, SERVER IS RUNNING");
});
