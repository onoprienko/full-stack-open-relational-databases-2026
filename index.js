const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const authorsRouter = require('./controllers/authors')
const loginRouter = require('./controllers/login')
const ReadingList = require('./controllers/readinglist')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/login', loginRouter)
app.use('/api/readinglist', ReadingList)

if (process.env.TESTING) {
  const testingRouter = require('./controllers/testing')
  app.use('/api/reset', testingRouter)

  app.get('/', async (request, response) => {
    return response.status(200).send('Testing mode is active')
  })
}

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'SequelizeValidationError') {
    const errorsMessages = error.errors.map((e) => e.message)
    return response.status(400).send({ error: errorsMessages })
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return response
      .status(400)
      .send({ error: 'malformatted id or id does not exist' })
  }

  next(error)
}

app.use(errorHandler)
start()
