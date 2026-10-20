const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const ReadingList = require('../models/readingList')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  try {
    await Blog.destroy({ truncate: true, cascade: true })
    await User.destroy({ truncate: true, cascade: true })
    await ReadingList.destroy({ truncate: true, cascade: true })
    await Session.destroy({ truncate: true, cascade: true })
    response.status(204).end()
  } catch (error) {
    console.error('Reset database failed:', error)
    response.status(500).json({ error: error.message })
  }
})

module.exports = router
