import AuthenticationController from './controllers/authentication.controller'
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

// app setup
const app = express()
app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: false }))

// DB setup
const mongoDB = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@movies4you.zrh5k.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Routes

// ---------------------------------- /auth -------------------------------------
app.post('/auth/register', async (req, res) => {
  const password = req.body.password
  const email = req.body.email
  const hashedPassword = await AuthenticationController.generatePasswordHash(password)

  await AuthenticationController.createUser(email, hashedPassword)

    .then(() => {
      res.send({ message: 'An account has been created!' })
    }).catch((err) => {
      throw err
    })
})

app.post('/auth/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, message) => {
    if (err) {
      // you should log it
      return res.status(500).send(err)
    } else if (!user) {
      // you should log it
      return res.status(403).send(message)
    } else {
      const token = AuthenticationController.signUserToken(user)
      return res.send({ token })
    }
  })(req, res)
})

// Protect api endpoint:
// app.use('/admin', [passport.authenticate('jwt', { session: false }), AuthenticationController.adminScope], [adminRoutes])

app.get('/auth/user', async (req, res) => {
  await passport.authenticate('jwt', { session: false }, (err, user, message) => {
    if (err) {
      // you should log it
      return res.status(400).send(err)
    } else if (!user) {
      // you should log it
      return res.status(403).send({ message })
    } else {
      return res.send({ user })
    }
  })(req, res)
})

export default {
  path: '/api',
  handler: app
}