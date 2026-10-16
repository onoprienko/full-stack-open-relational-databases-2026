const router = require('express').Router()
const { sequelize } = require('../util/db')

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
      ],
      group: ['author'],
      order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
    })
    console.log(JSON.stringify(authors))
    res.json(authors)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

module.exports = router
