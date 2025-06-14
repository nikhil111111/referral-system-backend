import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    referrals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    level: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

const User = mongoose.model('User', userSchema);
export default User;
