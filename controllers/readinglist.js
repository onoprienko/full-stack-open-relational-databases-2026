const router = require('express').Router()

const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/tokenExtractor')

router.post('/', async (req, res, next) => {
  try {
    const readingList = await ReadingList.create(req.body)
    res.status(200).json(readingList)
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
