const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog } = require('../models')
const { User } = require('../models')
const { tokenExtractor } = require('../util/tokenExtractor')
const { sessionControl } = require('../util/sessionControl')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) return res.status(404).end()
  next()
}

router.get('/', async (req, res) => {
  const search = req.query.search
  const where = search
    ? {
        [Op.or]: [
          {
            title: {
              [Op.substring]: search,
            },
          },
          {
            author: {
              [Op.substring]: search,
            },
          },
        ],
      }
    : null

  try {
    const blogs = await Blog.findAll({
      include: {
        model: User,
        as: 'user',
      },
      where,
      order: [['likes', 'DESC']],
    })
    console.log(JSON.stringify(blogs))
    res.json(blogs)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.post('/', [tokenExtractor, sessionControl], async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.toJSON().id })
    return res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete(
  '/:id',
  [blogFinder, tokenExtractor, sessionControl],
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.decodedToken.id, {
        include: {
          model: Blog,
          as: 'blogs',
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
  },
)

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
