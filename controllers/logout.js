const router = require('express').Router()

const { tokenExtractor } = require('../util/tokenExtractor')
const { sessionControl } = require('../util/sessionControl')
const Session = require('../models/session')

router.delete('/', [tokenExtractor, sessionControl], async (req, res, next) => {
  try {
    await Session.destroy({
      where: {
        token: req.token,
        user_id: req.decodedToken.id,
      },
    })
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
