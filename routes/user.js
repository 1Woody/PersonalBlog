const express           = require('express')
const router            = express.Router()

const UserController    = require('../controllers/UserController')

//Register & Login Handle
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)

//User CRUD
router.get('/', UserController.index)
router.get('/:id', UserController.show)
router.get('/info/:id', UserController.showinfo)
router.put('/:id', UserController.update)
router.delete('/:id', UserController.destroy)

module.exports = router