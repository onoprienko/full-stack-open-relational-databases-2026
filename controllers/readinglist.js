const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const router = require('express').Router()

const { ReadingList } = require('../models')

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

router.post('/', async (req, res, next) => {
  try {
    const readingList = await ReadingList.create(req.body)
    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findOne({
      where: { id: req.params.id },
    })
    if (!readingList) return res.status(404).end()

    if (readingList.userId !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: 'blog does not in user reading list' })
    }

    readingList.readed = req.body.read
    await readingList.save()
    res.json(req.readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router
