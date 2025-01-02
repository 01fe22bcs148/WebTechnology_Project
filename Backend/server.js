require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const bcrypt = require('bcrypt');
const Joi = require('joi');
const { MongoClient, ObjectId } = require('mongodb'); 

// Environment variables
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'ngo';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
let db;
(async function connectToDB() {
  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
})();

// Joi validation schema
const restaurantSchema = Joi.object({
  restaurantName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  district: Joi.string().required(),
});
// Joi schema for validation
const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    address: Joi.string().required(),
    district: Joi.string().required(),
    userType: Joi.string().valid('Admin', 'NGO').required(),
  });

 // Joi schema for delivery registration
const deliveryRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    district: Joi.string().required(),
    address: Joi.string().required(),
  }); 
// Define Joi schema for validating donation data
const donationSchema = Joi.object({
  foodType: Joi.string().valid("Raw Food", "Cooked Food", "Packed Food").required(),
  mealType: Joi.string().valid("Veg", "Non-Veg").required(),
  foodName: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  name: Joi.string().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  district: Joi.string().valid("Madurai", "Chennai", "Coimbatore").required(),
  address: Joi.string().required(),
  daysGood: Joi.number().positive().required(),
  restaurantName: Joi.string().required(),
  date: Joi.date().optional(), // Make date optional as it will be set on the backend
});
// Register route
app.post('/api/register', async (req, res) => {
  const { restaurantName, email, password, district } = req.body;

  // Validate the input data
  const { error } = restaurantSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  // Check if restaurant already exists
  const existingRestaurant = await db.collection('restaurants').findOne({ email });
  if (existingRestaurant) {
    return res.status(400).send({ message: 'Restaurant already exists!' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the new restaurant details in the database
  const newRestaurant = {
    restaurantName,
    email,
    password: hashedPassword,
    district,
  };

  try {
    await db.collection('restaurants').insertOne(newRestaurant);
    res.status(200).send({ message: 'Restaurant registered successfully!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send({ message: 'An error occurred while registering. Please try again.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    const { email, password } = req.body;

    // Input validation
    const { error } = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }).validate(req.body);

    if (error) {
      console.error("Validation error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if restaurant exists
    const restaurant = await db.collection('restaurants').findOne({ email });
    if (!restaurant) {
      console.error("Restaurant not found:", email);
      return res.status(400).send({ message: "Restaurant not found!" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, restaurant.password);
    if (!isPasswordValid) {
      console.error("Invalid password for email:", email);
      return res.status(400).send({ message: "Incorrect password!" });
    }

    console.log("User logged in successfully:", email);

    // Send back restaurant name along with the success message
    res.status(200).send({
      message: "Logged in successfully!",
      restaurantName: restaurant.restaurantName, // Return restaurant name
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "An error occurred during login." });
  }
});

// POST route for donation
app.post("/api/donate", async (req, res) => {
  // Validate the incoming donation data
  const { error } = donationSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const { foodType, mealType, foodName, quantity, name, phone, district, address, daysGood, restaurantName } = req.body;

  try {
    // Create donation object with current date
    const donation = {
      foodType,
      mealType,
      foodName,
      quantity,
      name,
      phone,
      district,
      address,
      daysGood,
      restaurantName,
      date: new Date(), // Current date
    };

    // Insert donation into the MongoDB database
    const result = await db.collection("donations").insertOne(donation);

    if (!result.acknowledged) {
      throw new Error("Donation insert failed");
    }

    // Respond with success message
    res.status(200).send({ message: "Donation received successfully!" });
  } catch (err) {
    console.error("Error inserting donation:", err);
    res.status(500).send({ message: "An error occurred while processing your donation. Please try again." });
  }
});

  
  // Register route for admins and NGOs
app.post('/api/register/admin', async (req, res) => {
    const { name, email, password, address, district, userType } = req.body;
  
    // Validate the input data using Joi schema
    const { error } = registerSchema.validate(req.body);
    if (error) {
      console.error("Validation error:", error);
      return res.status(400).send({ message: error.details[0].message });
    }
  
    try {
      // Check if the user already exists in the respective collection
      const existingUser = await db.collection(userType.toLowerCase() + 's').findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: `${userType} with this email already exists!` });
      }
  
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user object to insert into the database
      const newUser = {
        name,
        email,
        password: hashedPassword,
        address,
        district,
      };
  
      // Store the new user in the corresponding collection (either 'admins' or 'ngos')
      await db.collection(userType.toLowerCase() + 's').insertOne(newUser);
      res.status(200).send({ message: `${userType} registered successfully!` });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send({ message: 'An error occurred while registering. Please try again.' });
    }
  });
  
  
// Login route admin
app.post('/api/login/admin', async (req, res) => {
  const { email, password, adminType, district } = req.body;
  console.log("District received in login request:", district);  // Log the received district

  if (!email || !password || !adminType) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  const collectionName = adminType === "admin" ? "admins" : "ngos";

  try {
    const user = await db.collection(collectionName).findOne({ email });
    if (!user) {
      return res.status(400).send({ message: `${adminType} not found.` });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send({ message: "Invalid credentials." });
    }

    const response = {
      message: `${adminType} logged in successfully!`,
    };

    // If the user is an NGO, send the district in the response
    if (adminType === "ngo") {
      response.district = user.district; // Send the district for NGO users
    }

    res.status(200).send(response); // Send the message and district (for NGO)
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: 'An error occurred while logging in. Please try again.', error: error.message });
  }
});


// Delivery registration endpoint
app.post("/api/delivery/register", async (req, res) => {
    const { name, email, password, district, address } = req.body;
  
    // Validate the input data
    const { error } = deliveryRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
  
    try {
      // Check if the email is already registered
      const existingUser = await db.collection("deliveries").findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: "Delivery personnel with this email already exists!" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newDelivery = {
        name,
        email,
        password: hashedPassword,
        district,
        address,
        createdAt: new Date(),
      };
  
      // Insert into the database
      await db.collection("deliveries").insertOne(newDelivery);
  
      res.status(201).send({ message: "Delivery personnel registered successfully!" });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).send({ message: "An error occurred while registering. Please try again." });
    }
  });

  // Delivery Login Endpoint
app.post("/api/delivery/login", async (req, res) => {
    const { email, password } = req.body;
  
    // Validate input
    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required." });
    }
  
    try {
      // Check if the user exists in the "deliveries" collection
      const user = await db.collection("deliveries").findOne({ email });
      if (!user) {
        return res.status(400).send({ message: "Delivery personnel not found." });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).send({ message: "Invalid credentials." });
      }
  
      // Successful login
      res.status(200).send({ message: "Logged in successfully as Delivery!",
        district: user.district, });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send({ message: "An error occurred during login. Please try again." });
    }
  });
  // Endpoint to get donations
  app.get("/api/donations", async (req, res) => {
    const { district } = req.query; // Retrieve the district parameter
  
    try {
      const donations = await db.collection("donations").find({ district}).toArray();
      if (!donations || donations.length === 0) {
        return res.status(404).send({ message: "No donations available for your district." });
      }
      res.status(200).send(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).send({ message: "An error occurred while fetching donations." });
    }
  });
 // Correcting /api/donations11 endpoint
app.get("/api/donations11", async (req, res) => {
  const { status, district } = req.query;

  console.log("Received request with status:", status, "district:", district);

  // Build query object dynamically based on provided filters
  const query = {};
  if (status) query.status = status;
  if (district) query.district = district;

  try {
    // Fetch donations from the "donations" collection
    const donations = await db.collection("donations").find(query).toArray();

    // If no donations are found, return an empty array
    if (!donations || donations.length === 0) {
      console.log("No donations found for the given filters");
      return res.status(200).json([]); // Send an empty array instead of an error
    }

    // Send the donations as the response
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error.message);
    res.status(500).json({
      message: "An error occurred while fetching donations.",
      error: error.message, // Include error details for debugging
    });
  }
});

 // Endpoint to get dashboard counts
app.get("/api/dashboard-counts", async (req, res) => {
  try {
    const totalUsers = await db.collection("ngos").countDocuments();
    const feedbacks = await db.collection("restaurants").countDocuments();
    const totalDonations = await db.collection("donations").countDocuments();

    res.status(200).json({
      totalUsers,
      feedbacks,
      totalDonations,
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).send({ message: "An error occurred while fetching dashboard data." });
  }
});
 
  // Endpoint to get recent donations
app.get("/api/recent-donations", async (req, res) => {
  try {
    const donations = await db.collection("donations").find().sort({ date: -1 }).limit(5).toArray();
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching recent donations:", error);
    res.status(500).send({ message: "An error occurred while fetching recent donations." });
  }
});

  
// Example endpoint for accepting a donation


app.patch("/api/donations/accept/:donationId", async (req, res) => {
  const { donationId } = req.params;
  const objectId = new ObjectId(donationId); // Ensure we are using 'new' for ObjectId
  
  console.log("Received donationId:", objectId);
  
  if (!ObjectId.isValid(donationId)) {
    return res.status(400).json({ message: "Invalid donationId format." });
  }
  
  try {
    // Check if the donation exists in the database
    const result = await db.collection("donations").findOne({ _id: objectId });
    if (!result) {
      console.log("Donation not found for ObjectId:", objectId);
      return res.status(404).json({ message: "Donation not found" });
    }
  
    // Log the current donation before updating
    console.log("Donation before update:", result);
  
    // If the donation's status is already 'Accepted', skip the update
    if (result.status === 'Accepted') {
      console.log("Donation is already accepted, no update required.");
      return res.status(200).json(result); // Return the existing document if no update is needed
    }
  
    // Proceed with the update if donation exists and status is not already 'Accepted'
    const updateResult = await db.collection("donations").updateOne(
      { _id: objectId },
      { $set: { status: "Accepted" } }
    );
  
    console.log("Update result:", updateResult);
  
    if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 1) {
      // Document was successfully updated
      const updatedDonation = await db.collection("donations").findOne({ _id: objectId });
      console.log("Updated Donation:", updatedDonation);
      return res.status(200).json(updatedDonation); // Return the updated document
    } else if (updateResult.matchedCount === 1) {
      // Donation was matched but no modification was necessary
      return res.status(200).json(result); // Return the original document
    } else {
      // No documents matched or updated
      return res.status(404).json({ message: "Donation not found or no updates made" });
    }
  } catch (error) {
    console.error("Error updating donation status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/accepted-orders', async (req, res) => {
  try {
    const acceptedOrders = await mongoose.connection.db
      .collection('donations') // Adjust to your collection name
      .find({ status: 'Accepted' })
      .toArray(); // Get the result as an array

    res.json(acceptedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accepted orders', error });
  }
});

app.get('/api/donations22', async (req, res) => {
  try {
    const { status } = req.query;

    // Build the query object based on the status filter
    const query = status ? { status } : {};

    console.log('Query parameter received:', query);

    // Fetch donations from the database
    const donations = await db.collection('donations').find(query).toArray();

    if (!donations || donations.length === 0) {
      console.log('No donations found for the given filter.');
      return res.status(404).json({ message: 'No donations found.' });
    }

    console.log('Fetched donations:', donations);
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Error fetching donations.', error: error.message });
  }
});


// API endpoint to get accepted donations
app.get('/api/accepted22', async (req, res) => {
  try {
    const status = req.query.status; // Retrieve status from query parameter
    if (!status) {
      return res.status(400).json({ message: 'Status query parameter is required.' });
    }

    // Define the query for 'accepted' donations
    const query = { status: status };

    // Fetch donations from the 'donations' collection
    const donations = await db.collection('donations').find(query).toArray();

    if (!donations || donations.length === 0) {
      console.log('No accepted donations found.');
      return res.status(404).json({ message: 'No accepted donations found.' });
    }

    console.log('Fetched accepted donations:', donations);
    res.status(200).json(donations); // Return the donations as a response
  } catch (error) {
    console.error('Error fetching accepted donations:', error);
    res.status(500).json({ message: 'Error fetching accepted donations.', error: error.message });
  }
});




app.patch("/api/donations/:id", async (req, res) => {
  const donationId = req.params.id;
  const { status } = req.body;

  // Define allowed statuses
  const allowedStatuses = ["Accepted", "Delivered"];

  // Validate the status
  if (!allowedStatuses.includes(status)) {
    return res.status(400).send({ message: `Invalid status update. Status must be one of: ${allowedStatuses.join(", ")}.` });
  }

  try {
    const donation = await db.collection("donations").findOne({ _id: new ObjectId(donationId) });

    if (!donation) {
      return res.status(404).send({ message: "Donation not found." });
    }

    if (donation.status === "Delivered" && status === "Accepted") {
      return res.status(400).send({ message: "Cannot change status to 'Accepted' after it has been delivered." });
    }

    if (donation.status === status) {
      return res.status(400).send({ message: `Donation is already marked as '${status}'.` });
    }

    // Update the donation status in the database
    const result = await db.collection("donations").updateOne(
      { _id: new ObjectId(donationId) },
      { $set: { status } }  // Update the correct field 'status'
    );

    res.status(200).send({ message: `Donation status updated to '${status}'.` });
  } catch (error) {
    console.error("Error updating donation status:", error);
    res.status(500).send({ message: "Error updating donation status." });
  }
});

// Update donation status endpoint
app.put("/api/donations/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send({ message: "Status is required." });
  }

  try {
    const updateFields = { status };

    if (status === "Accepted") {
      updateFields.date = new Date(); // Add acceptedDate for accepted donations
    }

    const result = await db.collection("donations").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Donation not found." });
    }

    res.status(200).send({ message: "Donation status updated successfully." });
  } catch (error) {
    console.error("Error updating donation status:", error);
    res.status(500).send({ message: "An error occurred while updating the status." });
  }
});


// API Endpoint to fetch delivered donations
app.get('/api/delivered-donations', async (req, res) => {
  try {
    const database = client.db('ngo'); // Use your database name here
    const donationsCollection = database.collection('donations'); // Use your collection name here
    
    // Fetch delivered donations
    const deliveredDonations = await donationsCollection.find({ status: 'Delivered' }).toArray();
    
    // Respond with the delivered donations
    res.status(200).json(deliveredDonations);
  } catch (error) {
    console.error('Error fetching delivered donations:', error);
    res.status(500).send('Server error');
  }
});
// API Endpoint to accept a donation (example of update)
app.put('/api/donations/:id/accept', async (req, res) => {
  try {
    const donationId = req.params.id; // Get donation ID from URL parameter
    const database = client.db('ngo'); // Your database name
    const donationsCollection = database.collection('donations'); // Your collection name
    
    // Update the donation status to 'Accepted'
    const result = await donationsCollection.updateOne(
      { _id: new ObjectId(donationId) }, // ObjectId for MongoDB queries
      { $set: { status: 'Accepted' } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Donation not found');
    }

    res.status(200).send('Donation accepted');
  } catch (error) {
    console.error('Error accepting donation:', error);
    res.status(500).send('Server error');
  }
});

app.get('/api/pending-orders', async (req, res) => {
  try {
    const query = { status: 'pending' }; // Fetch orders with the 'pending' status

    const orders = await db.collection('orders').find(query).toArray(); // Assuming 'orders' is the collection

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No pending orders found.' });
    }

    res.status(200).json(orders); // Responding with the list of pending orders
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
  }
});

 
// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  await db.client.close();
  process.exit(0);
});
// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
