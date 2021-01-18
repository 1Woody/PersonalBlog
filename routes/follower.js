const express           = require('express')
const router            = express.Router()

const FollowerController    = require('../controllers/FollowerController')

router.get('/', FollowerController.index)
router.get('/following/:id', FollowerController.following)
router.get('/followers/:id', FollowerController.followers)
router.post('/:id', FollowerController.store)
router.delete('/unfollow/:id', FollowerController.unfollow)

module.exports = router

