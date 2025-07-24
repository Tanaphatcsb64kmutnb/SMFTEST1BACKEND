const mongoose = require('mongoose');
const db = require('../config/db');

const { Schema } = mongoose;

const saveSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reward_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Reward'
    }
}, {
    timestamps: true
});

// ใช้ชื่อ collection ตรงกับที่อยู่ใน MongoDB
const SaveModel = db.model('save', saveSchema, 'save');

module.exports = SaveModel;