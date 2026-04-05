import mongoose from "mongoose";

import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String, required: function () {
            return this.provider === 'local';
        }
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type: String,

    },

    role: {
        type: String,
        enum: ["candidate", "interviewer", "admin"],
        default: "candidate"

    },
    hasLoginAccess: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isNewUser: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// now we will hash the password here only when the password is modified or created for the first time
userSchema.pre('save', async function () {


    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);