const mongoose      = require('mongoose')
const Schema        = mongoose.Schema

const PostSchema    = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    author_id: {
        type: String
    },  
    date: {
        type: Date,
        default: Date.now
    },
    public: {
        type: Boolean
    }
}, {timestamps: true})

const Post      = mongoose.model('Post', PostSchema)
module.exports  = Post


