const { response } = require('express')
const User         = require('../models/user')

//Login & Register

// Add a new User 
const register = (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []
    //Check required fields
    if(!name || !email || !password || !password2) errors.push({ msg: 'Please fill all the fields'})
    //Check password match
    if(password != password2) errors.push({ msg: 'Passwords do not match' })

    if(errors.length > 0) {
        res.render('register', {
            errors, 
            name, 
            email,
            password,
            password2
        }) 
    } else {
        // Validation passed
        User.findOne({ email : email})
        .then(user => {
            if(user) {
                //User exists
                errors.push({ msg: 'Email is already registered'})
                res.render('register', {
                    errors, 
                    name, 
                    email,
                    password,
                    password2
                }) 
            } else {
                const newUser = new User({
                    name, 
                    email,
                    password
                })
                console.log(newUser)
                newUser.save()
                .then( () => { 
                    res.redirect('/login')
                })
                .catch(error => {
                    res.json({
                        message: 'An Error Ocurred!'
                    })
                })
            }
        })
    }
}

const login = (req, res) => {
    const { email, password } = req.body
    let errors = []
    //Check required fields
    if(!email || !password) errors.push({ msg: 'Please fill all the fields'})

    console.log(email, password)
    if (errors.length > 0){
        res.render('login', {
            errors, 
            email,
            password
        })
    } else {
        User.findOne({ email : email, password : password})
        .then(user => {
            if(user){
                let red = `/blog/${email}`
                res.redirect(red)
            }else{
                errors.push({ msg: 'Wrong Email or Password'})
                res.render('login', {
                    errors, 
                    email,
                    password
                }) 
            }
        })
        .catch(error => {
            res.json({
                message: 'An Error Ocurred!'
            })
        })
    }

}


const logout = (req, res) => {
    res.redirect('/login')
}

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

// Show single User
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

//delete a User
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
    register, login, logout, index, show, showinfo, update, destroy
}