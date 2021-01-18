const { response } = require('express')
const User         = require('../models/user')


// Show the list of users
const index = (req, res, next) => {
    User.find()
    .then(response => {
        let usersArray = []
        response.forEach((user) => {
            let json = {}
            json["name"] = user.name
            json["email"] = user.email
            usersArray.push(json)
        })
        res.json({
            usersArray
        })
    })
    .catch(error => {
        res.json({
            message: 'An Error Ocurred!'
        })
    })
}

// Show single User
const show = (req, res, next) => {
    let email = req.params.id;
    User.findOne({email : email})
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

// Show only important info from a single user 
// Return { name, email }
const showinfo = (req, res, next) => {
    let email = req.params.id;
    User.findOne({email : email})
    .then(response => {
        let jsonData = JSON.stringify(response)
        jsonData = JSON.parse(jsonData)
        response = {}
        response["name"] = jsonData.name
        response["email"] = jsonData.email
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

//Update a User 
const update = (req, res, next) => {
    let userID = req.params.id;
    let updatedData = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,

    }
    User.findByIdAndUpdate(userID, {$set: updatedData})
    .then(() => {
        res.json({
            message : 'User updated successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Ocurred!'
        })
    })
}

//Delete a User
const destroy = (req, res, next) => {
    let userID = req.params.id;
    User.findByIdAndRemove(userID)
    .then(() => {
        res.json({
            message : 'User deleted successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Ocurred!'
        })
    })
}

module.exports = {
    index, show, showinfo, update, destroy
}