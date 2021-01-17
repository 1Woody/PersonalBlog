const express           = require('express')
const expressLayouts    = require('express-ejs-layouts')
const mongoose          = require('mongoose')
const morgan            = require('morgan')
const bodyParser        = require('body-parser')



const PostRoute = require('./routes/post')
const UserRoute = require('./routes/user')
const FollowerRoute = require('./routes/follower')
const IndexRoute = require('./routes/index')

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

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})

// Bodyparser 

//static files
app.use(express.static(__dirname + '/public'))

app.use('/api/post', PostRoute)
app.use('/api/user', UserRoute)
app.use('/api/follower', FollowerRoute)
app.use('/', IndexRoute)