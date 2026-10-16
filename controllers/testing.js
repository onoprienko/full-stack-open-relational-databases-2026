const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Blog.destroy({ truncate: true })
  await User.destroy({ truncate: true })

  response.status(204).end()
})

module.exports = router
