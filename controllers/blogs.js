const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const router = require('express').Router()

const { Blog } = require('../models')
const { User } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) return res.status(404).end()
  next()
}

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs))
    res.json(blogs)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', [blogFinder, tokenExtractor], async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id, {
      include: {
        model: Blog,
      },
    })

    console.log('🔵', req.blog.id, user)
    if (user?.blogs?.find((blog) => blog.id === req.blog.id)) {
      await req.blog.destroy()
      res.status(204).end()
    } else {
      return res
        .status(403)
        .json({ error: 'This user has no permissioin to delete this blog' })
    }
  } catch (error) {
    next(error)
  }
})

// router.get('/:id', noteFinder, async (req, res) => {
//   res.json(req.note)
// })

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router
