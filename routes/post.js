const express           = require('express')
const router            = express.Router()

const PostController    = require('../controllers/PostController')

router.get('/', PostController.index)
router.get('/:id', PostController.show)
router.get('/user/:id', PostController.userPostlist)
router.post('/:id', PostController.store)
router.put('/:id', PostController.update)
router.delete('/:id', PostController.destroy)

module.exports = router