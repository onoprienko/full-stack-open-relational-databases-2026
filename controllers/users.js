const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      as: 'blogs',
    },
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const read = req.query.read
  const where = read
    ? {
        readed: {
          [Op.eq]: read,
        },
      }
    : null

  const user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: ['id', 'createdAt', 'updatedAt'],
    },
    include: [
      // {
      //   model: Blog,
      //   as: 'blogs',
      // },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },

        through: {
          as: 'readingList',
          attributes: ['id', ['readed', 'read']],
          where,
        },
      },
    ],
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    })
    if (!user) return res.status(404).end()
    user.name = req.body.name
    await user.save()
    res.json(req.user)
  } catch (error) {
    next(error)
  }
})

module.exports = router
