const express           = require('express')
const router            = express.Router()
const User         = require('../models/user')

router.get('/', (req, res) => res.render('welcome'))


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