const router = require('express').Router()

const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/tokenExtractor')
const { sessionControl } = require('../util/sessionControl')

router.post('/', async (req, res, next) => {
  if (!req.body.blogId || !req.body.userId) return res.status(400).end()
  const exist = await ReadingList.findOne({
    where: { userId: req.body.userId, blogId: req.body.blogId },
  })
  if (exist) return res.status(400).json({ error: 'already in list' })
  try {
    const readingList = await ReadingList.create(req.body)
    res.status(200).json(readingList)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', [tokenExtractor, sessionControl], async (req, res, next) => {
  try {
    const readingList = await ReadingList.findOne({
      where: { id: req.params.id },
    })
    if (!readingList) return res.status(404).end()

    if (readingList.userId !== req.decodedToken.id) {
      return res
        .status(401)
        .json({ error: 'blog does not in user reading list' })
    }

    readingList.read = req.body.read
    responseList = await readingList.save()
    res.json(responseList)
  } catch (error) {
    next(error)
  }
})

module.exports = router
