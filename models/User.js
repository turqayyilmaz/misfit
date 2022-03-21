const uniqueValidator =require('mongoose-unique-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique:true,
        index:true,
        required: true  
    },
    password: {
        type:String,
        required: true
    },

    phone: {
        type: String,
    },
 
    role: {
        type: String,
        enum: ['member', 'trainer', 'admin'],
        default: 'member'
    },

    enrolledPrograms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program'
    }],
    image: {
        type: String
    }
});

UserSchema.pre('save', function(next) {
    const user = this;

    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, (error, hash) => {
        
        if(error) return next(error);

        user.password = hash;
        next();
    });
});
UserSchema.plugin(uniqueValidator)

const User = mongoose.model('User', UserSchema);
module.exports = User;