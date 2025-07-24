//rewardcollection
const mongoose = require('mongoose');
const db = require('../config/db');

const { Schema } = mongoose;

const rewardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    reward_points: {
        type: Number,
        required: true
    },
    reward_desc: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// ลองใช้ชื่อ collection ที่ตรงกับใน MongoDB
// MongoDB อาจจะตั้งชื่อ collection เป็น "rewardlists" (เติม s)
const RewardModel = db.model('reward', rewardSchema, 'rewardlist');

module.exports = RewardModel;