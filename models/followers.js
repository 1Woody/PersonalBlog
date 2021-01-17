const mongoose      = require('mongoose')
const Schema        = mongoose.Schema

const FollowerSchema    = new Schema({
    //follower
    user_email_origin : {
        type: String
    },
    //followed
    user_email_dest : {
        type: String
    }
}, {timestamps: true})

//FollowerSchema.index({ user_email_origin: 1, user_email_dest: 1 }, { unique: true });
const Follower      = mongoose.model('Follower', FollowerSchema)
module.exports  = Follower

