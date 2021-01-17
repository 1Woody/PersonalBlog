const { response } = require('express')
const Post         = require('../models/post')


// Show the list of Post
const index = (req, res, next) => {
    Post.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An Error Ocurred!'
        })
    })
}

// Show the list of Post of a user
const userPostlist = (req, res, next) => {
    let user_email = req.params.id;
    Post.find({ author_id : user_email})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An Error Ocurred!'
        })
    })
}

// Show single Post
const show = (req, res, next) => {
    //let postID = req.body.postID
    let postID = req.params.id;
    Post.findById(postID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Ocurred!'
        })
    })
}

// Add a new Post 
const store = (req, res, next) => {
    let author_email = req.params.id
    let post = new Post({
        title: req.body.title,
        content: req.body.content,
        author_id: author_email,
        public: req.body.public
    })
    post.save()
    .then(response => { 
        let jsonData = JSON.stringify(response)
        jsonData = JSON.parse(jsonData)
        res.json({
            response,
            message : 'Post Added Successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: ' An error Ocurred!'
        })
    })
}

//Update a Post 
const update = (req, res, next) => {
    //let postID = req.body.postID
    let postID = req.params.id;
    let updatedData = {
        title: req.body.title,
        content: req.body.content,
        author_id: req.body.author_id,
        public: req.body.public 
    }

    Post.findByIdandUpdate(postID, {$set: updatedData})
    .then(() => {
        res.json({
            message : 'Post updated successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Ocurred!'
        })
    })
}

//delete a Post 
const destroy = (req, res, next) => {
    //let postID = req.body.postID
    let postID = req.params.id;
    Post.findByIdAndRemove(postID)
    .then(() => {
        res.json({
            message : 'Post deleted successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Ocurred!'
        })
    })
}

module.exports = {
    index, userPostlist, show, store, update, destroy
}