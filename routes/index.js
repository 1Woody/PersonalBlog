/* 


--------------- NO REVISAR --------------


const express           = require('express')
const router            = express.Router()
const User         = require('../models/user')

router.get('/', (req, res) => res.render('welcome'))


//Register & Login Handle
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)

//Login & Register
router.get('/login', (req, res) => res.render('login'))
router.get('/register', (req, res) => res.render('register'))


//User Blog
router.get('/blog/:id', (req, res) => {
    let email = req.params.id
    User.findOne({email : email})
    .then((user) => {
        if(user){
            res.render('blogpage', {
                email: email
            }) 
        }
        else{
            res.redirect('/login')
        }
    })
    .catch(error => {
        res.json({
            message: 'An Error Ocurred!'
        })
    })

})

router.get('/visitblog/:id', (req, res) => {
    let email = req.params.id
    res.render('visitblog', {
        email : email
    })
})




module.exports = router;

*/
/*

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
*/