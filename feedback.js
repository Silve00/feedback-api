const mongoose = require('mongoose');
const { stringify } = require('node:querystring');

//This is a schema : A blueprint for our data
const feedbackSchema = new mongoose.Schema ({
    username: String,
    comment: String,
    rating: Number,
    date: { type: Date, default: Date.now}
});

module.exports = mongoose.model('feedback', feedbackSchema);

