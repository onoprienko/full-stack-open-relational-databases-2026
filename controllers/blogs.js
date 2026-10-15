const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) return res.status(404).end()
  next()
}

router.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs))
    res.json(blogs)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body })
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.delete('/api/blogs/:id', blogFinder, async (req, res) => {
  try {
    await req.blog.destroy()
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error })
  }
})

// router.get('/:id', noteFinder, async (req, res) => {
//   res.json(req.note)
// })

// router.put('/:id', noteFinder, async (req, res) => {
//   req.note.important = req.body.important
//   await req.note.save()
//   res.json(req.note)
// })

module.exports = router
