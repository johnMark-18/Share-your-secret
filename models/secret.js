const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Secret = mongoose.model('Secret', secretSchema);
module.exports = Secret;
