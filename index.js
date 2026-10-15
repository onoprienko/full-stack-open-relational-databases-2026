require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false
    // }
  },
})

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  },
)
Blog.sync()

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs))
    res.json(blogs)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body })
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    await blog.destroy()
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error })
  }
})

// app.get('/api/notes/:id', async (req, res) => {
//   const note = await Note.findByPk(req.params.id)
//   if (note) {
//     res.json(note)
//   } else {
//     res.status(404).end()
//   }
// })

// app.put('/api/notes/:id', async (req, res) => {
//   const note = await Note.findByPk(req.params.id)
//   if (note) {
//     note.important = req.body.important
//     await note.save()
//     res.json(note)
//   } else {
//     res.status(404).end()
//   }
// })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
