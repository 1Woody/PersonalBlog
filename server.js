const express           = require('express')
const session           = require('express-session')
const expressLayouts    = require('express-ejs-layouts')
const mongoose          = require('mongoose')
const morgan            = require('morgan')
const bodyParser        = require('body-parser')
const User              = require('./models/user')


const PostRoute         = require('./routes/post')
const UserRoute         = require('./routes/user')
const FollowerRoute     = require('./routes/follower')

mongoose.connect('mongodb://localhost:27017/mydb', 
{
    useUnifiedTopology: true,
    useCreateIndex: true, 
    useNewUrlParser: true,
    useFindAndModify: false
})
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log ('DB Connection Established!')
})

const app = express()

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const TIME = 1000 * 60 * 60 * 3
//const PORT = process.env.PORT || 3000
const {
    PORT = 3000,
    NODE_ENV = 'dev',
    SESS_NAME = 'sid',
    SESS_SECRET = 'session_secret', //importante para prod
    SESS_LIFE = TIME
} = process.env

const IN_PROD = NODE_ENV === 'prod'

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})

// Bodyparser 
app.use(bodyParser.urlencoded({
    extended : true
}))

//static files
app.use(express.static(__dirname + '/public'))

app.use('/api/post', PostRoute)
app.use('/api/user', UserRoute)
app.use('/api/follower', FollowerRoute)


//-------------------- INDEX & LOGIN & REGISTER --------------------

app.use( session({
    name : SESS_NAME,
    resave : false,
    saveUninitialized: false, 
    secret : SESS_SECRET,
    cookie : {
        maxAge : SESS_LIFE,
        sameSite : true,
        secure : IN_PROD 
    }
}))


//MIDDLEWARE FUNCTIONS
const redirectLogin = (req, res, next) => {
    if(!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}

const redirectHome = (req, res, next) => {
    if(req.session.userId) {
        res.redirect('/home')
    } else {
        next()
    }
}

//Share Page

/*
app.get('/:id', (req, res) => {
    let email = req.params.id
    let user_url = '/visitblog/' + email
    res.redirect(user_url)
}) */


//Init Page
app.get('/', (req, res) => {
    const { userId } = req.session
    res.render('welcome', {
        userId
    })
})

//Home user page
app.get('/home', redirectLogin, (req,res) => {
    let email = req.session.userId
    User.findOne({email : email})
    .then((user) => {
        if(user){
            res.render('blogpage', {
                email: user.email
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

//Login
app.get('/login', redirectHome, (req, res) => {
    res.render('login')
})

//Register
app.get('/register', redirectHome, (req, res) => {
    res.render('register')
})


app.post('/login', redirectHome, (req, res) => {
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
                req.session.userId = email
                res.redirect('/home')
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

})


app.post('/register', redirectHome, (req, res) => {
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
                    req.session.userId = email
                    res.redirect('/home')
                })
                .catch(error => {
                    res.json({
                        message: 'An Error Ocurred!'
                    })
                })
            }
        })
    }
})


//Should be a post (used get to access from a link)
app.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if(err) {
            res.redirect('/home')
        }

        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })
})


app.get('/visit/:id', (req, res) => {
    let email = req.params.id
    res.render('visitblog', {
        email : email,
        session_email : req.session.userId
    })
})