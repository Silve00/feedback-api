//Import the tooks we installed in our terminal
//Express for handling requests
//Mongoose for node.js to talk to mongoDB
//Dotenv for keeping your private keys like database password secret


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors()); // Put this above your routes
app.use(express.json());


// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`server is running on port ${PORT}`);
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add this below the middleware in server.js
// mongoose.connect('mongodb://localhost:27017/feedbackDB')
const dbURI ="mongodb+srv://silveelvis15_db_user:qOn1I86qABnJMP7d@feedbackcluster.0jnw4rs.mongodb.net/?appName=Feedbackcluster"

mongoose.connect(dbURI)
.then(() => console.log("Cloud Database Connected!"))
.catch(err => console.error("Database connection error:", err));

const Feedback = require('./feedback'); // Import our blueprint

// The POST method means "Send/Create"
app.post('/api/feedback', async (req, res) => {
    try {
        // Create a new piece of feedback using the data the user sent (req.body)
        const newFeedback = new Feedback({
            username: req.body.username,
            comment: req.body.comment,
            rating: req.body.rating
        });

        // Save it to the database
        const savedFeedback = await newFeedback.save();

        // Send a "Success" message back to the user
        res.status(201).json(savedFeedback);
    } catch (error) {
        // If something goes wrong, tell the user
        res.status(400).json({ message: error.message });
    }
});

// This tells the server: "When someone visits this URL with a GET request..."
app.get('/api/feedback', async (req, res) => {
    try {
        // .find() is a Mongoose command that asks the database for EVERY document
        const allFeedbacks = await Feedback.find();

        // Send back a 200 (Success) status and the list of data
        res.status(200).json(allFeedbacks);
    } catch (error) {
        // If the database has an issue, send an error message
        res.status(500).json({ message: "Could not retrieve feedback" });
    }
});

// The colon ":" followed by "id" means this is a "Variable" in the URL
app.get('/api/feedback/:id', async (req, res) => {
    try {
        // We get the ID from the URL using req.params.id
        const singleFeedback = await Feedback.findById(req.params.id);

        if (!singleFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json(singleFeedback);
    } catch (error) {
        res.status(500).json({ message: "Invalid ID format" });
    }
});

app.delete('/api/feedback/:id', async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Feedback deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Could not delete" });
    }
});

// We use :id so the server knows WHICH feedback to update
app.patch('/api/feedback/:id', async (req, res) => {
    try {
        // findByIdAndUpdate takes the ID, the NEW data, and {new: true} 
        // which tells it to send back the edited version, not the old one.
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id, 
            { comment: req.body.comment }, 
            { new: true } 
        );

        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});