import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
const PORT = process.env.PORT || 3000
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Rest of your server code
// ...

// Create a mongoose schema for the contact form data
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

// Create a mongoose model for the contact form data
const Contact = mongoose.model('Contact', contactSchema);

// Create an Express app
const app = express();
app.use(cors());

// Configure multer for handling multipart/form-data
const upload = multer();

// Parse JSON data in the request body
app.use(express.json());

// Route to handle form submissions
app.post('/submit', upload.none(), (req, res) => {
  const { name, email, message } = req.body;

  // Create a new contact instance
  const newContact = new Contact({
    name,
    email,
    message
  });


  
  // Save the contact data to the database
  newContact.save()
    .then(() => {
      res.status(200).json({ message: 'Form submission successful' });
    })
    .catch((error) => {
      console.log('Error saving contact:', error);
      res.status(500).json({ message: 'Form submission failed' });
    });
});
  // Update the Express route to handle GET requests for retrieving all submissions
  app.get('/submissions', (req, res) => {
    Contact.find()
      .then((submissions) => {
        res.status(200).json(submissions);
      })
      .catch((error) => {
        console.log('Error retrieving submissions:', error);
        res.status(500).json({ message: 'Failed to retrieve submissions' });
      });
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

