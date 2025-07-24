// user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const db = require('../config/db');

const{Schema} = mongoose;

const userSchema = new Schema({
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        points: {
            type: Number,
            default: 10000,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        }, {
        timestamps: true,
});

userSchema.pre('save',async function(){
    try{
        var user = this;
        
        // Hash password only if it's modified
        if (!user.isModified('password')) return;
        
        const salt = await(bcrypt.genSalt(10));
        const hashpass = await bcrypt.hash(user.password,salt);
        user.password = hashpass;
        
        // Set username if not already set
        if (!user.username && user.email) {
            user.username = user.email.split('@')[0];
        }
    }catch(error){
        throw error;
    }
})

userSchema.methods.comparePassword = async function(userPassword){
    try{
        const isMatch = await bcrypt.compare(userPassword,this.password);
        return isMatch;
    }catch (error){
        throw error;
    }
}

// Method to update user points
userSchema.methods.updatePoints = function(newPoints) {
    this.points = newPoints;
    return this.save();
}

// Method to add points
userSchema.methods.addPoints = function(pointsToAdd) {
    this.points += pointsToAdd;
    return this.save();
}

const UserModel = db.model('user',userSchema);

module.exports = UserModel;