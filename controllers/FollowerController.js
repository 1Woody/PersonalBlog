const { response }    = require('express')
const { findById }    = require('../models/followers')
const Follower        = require('../models/followers')
const User            = require('../models/user')


// Show the list of Followers
const index = (req, res, next) => {
    Follower.find()
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


// Show Following user list
const following = (req, res, next) => {
    let user_email = req.params.id;
    Follower.find({ user_email_origin: user_email })
    .then(response => {
        let jsonData = JSON.stringify(response)
        let id_followers = []
        jsonData = JSON.parse(jsonData)
        jsonData.forEach(res => {
            id_followers.push(res.user_email_dest)
        })
        res.json({
            id_followers
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Ocurred!'
        })
    })
}


// Show the followers of the user
const followers = (req, res, next) => {
    let user_email = req.params.id;
    Follower.find({ user_email_dest: user_email })
    .then(response => {
        let jsonData = JSON.stringify(response)
        jsonData = JSON.parse(jsonData)
        let id_followers = []
        jsonData.forEach(res => {
            id_followers.push(res.user_email_origin)
        })
        res.json({
            id_followers
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Ocurred!'
        })
    })
}


// Add a new User 
const store = (req, res, next) => {
    let user_email = req.params.id;
    let follower = new Follower({
        user_email_origin : user_email,
        user_email_dest: req.body.email_dest
    })
    follower.save()
    .then(response => {
        res.json({
            message : 'Follower Added Successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: ' An error Ocurred!'
        })
    })
}


// Stop following a user 
const unfollow = (req, res, next) => {
    let user_email = req.params.id;
    Follower.find(
        {
            user_email_origin: user_email, 
            user_email_dest : req.body.email_dest
        })
    .then(function(e){
        let jsonData = JSON.stringify(e);
        jsonData = JSON.parse(jsonData)
        follow_id = jsonData[0]._id
        Follower.findByIdAndRemove(follow_id)
        .then(() => {
            res.json({
                message : 'Follower deleted successfully!'
            })
        })
        .catch(error => {
            res.json({
                message: 'An IN error Ocurred!'
            })
        })
    })
    .catch(error => {
        res.json({
            message: 'An OUT error Ocurred!'
        })
    })
}

module.exports = {
    index, following, followers, store, unfollow
}

