import MailerController from './controllers/mailer.controller'
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
// ---------------------------------- /test -------------------------------------
app.get('/test', (_req, res) => {
  res.status(200).send('OK')
})

// eslint-disable-next-line require-await
app.get('/test/sendEmail', async (_req, res) => {
  MailerController.sendEmail(
    '149895ja@gmail.com',
    'Registration confirmation',
    'You has been registered correctly',
    '<p>You has been registered correctly</p>'
  )
    .then(() => {
      res.status(200).send({ message: 'An email has been sent.' })
    })
    .catch((e) => {
      res.status(500).send({ message: "Couldn't send an email.", error: e })
    })
})

// ---------------------------------- /auth -------------------------------------
app.post('/auth/register', async (req, res) => {
  const password = req.body.password
  const email = req.body.email
  const hashedPassword = await AuthenticationController.generatePasswordHash(
    password
  ).catch((e) => {
    res.status(500).send({ message: "Couldn't encrypt password.", error: e })
  })

  await AuthenticationController.createUser(email, hashedPassword)
    .then(async (user) => {
      const signedVerificationToken =
        AuthenticationController.signVerificationToken(
          user.email,
          user.verificationToken
        )
      await MailerController.sendRegistrationToken(
        email,
        'Registration confirmation',
        signedVerificationToken
      )
      res.status(200).send({
        message: 'We sent an email with a verification link. Check your inbox!',
      })
    })
    .catch((e) => {
      res.status(500).send({ message: 'Something went wrong', error: e })
    })
})

app.post('/auth/confirmation', async (req, res) => {
  const token = req.body.token
  const { email, verificationToken } =
    AuthenticationController.verifySignedVerificationToken(token)
  const user = await AuthenticationController.getUser(email)

  if (
    user &&
    user.verificationToken === verificationToken &&
    user.verificationTokenExpire >= new Date()
  ) {
    user.isVerified = true
    user.save()
    return res.status(200).send({
      confirmationStatus: 'verified',
      message: 'Your email has been verified.',
    })
  } else {
    return res.status(400).send({
      confirmationStatus: 'unverified',
      message:
        "Email can't be verified!\n. A possible reason is an expired token.",
    })
  }
})

app.post('/auth/confirmation/resend', async (req, res) => {
  const email = req.body.email
  const user = await AuthenticationController.getUser(email)

  if (user && user.isVerified === true) {
    return res.status(400).send('Already verified.')
  } else if (user) {
    const verificationToken =
      AuthenticationController.generateVerificationToken()
    const verificationTokenExpire =
      AuthenticationController.generateVerificationTokenExpire()

    user.verificationToken = verificationToken
    user.verificationTokenExpire = verificationTokenExpire
    user.save()

    const signedVerificationToken =
      AuthenticationController.signVerificationToken(
        user.email,
        user.verificationToken
      )

    await MailerController.sendRegistrationToken(
      user.email,
      'Registration Confirmation - resend',
      signedVerificationToken
    )

    return res.status(200).send('Token has been resent.')
  } else {
    return res.status(404).send("User can't be found!")
  }
})

app.post('/auth/password/reset', async (req, res) => {
  const email = req.body.email
  const user = await AuthenticationController.getUser(email)

  if (user) {
    try {
      const verificationToken =
        AuthenticationController.generateVerificationToken()
      const verificationTokenExpire =
        AuthenticationController.generateVerificationTokenExpire()

      user.verificationToken = verificationToken
      user.verificationTokenExpire = verificationTokenExpire
      user.resetPassword = true
      user.save()

      const signedVerificationToken =
        AuthenticationController.signVerificationToken(
          user.email,
          user.verificationToken
        )

      await MailerController.sendPasswordChangeToken(
        user.email,
        'Password Reset',
        signedVerificationToken
      )
      return res
        .status(200)
        .send({ message: 'A link has been sent. Check your email.' })
    } catch (err) {
      console.error(err)
      return res.status(500).send({
        message: 'Something went wrong. Please try again...',
        error: err,
      })
    }
  } else {
    return res.status(404).send({ message: "User can't be found!" })
  }
})

app.post('/auth/password/change', async (req, res) => {
  const token = req.body.token
  const password = req.body.password

  const { email, verificationToken } =
    AuthenticationController.verifySignedVerificationToken(token)
  const user = await AuthenticationController.getUser(email)
  if (user && user.verificationTokenExpire < new Date()) {
    return res
      .status(400)
      .send({ message: 'Token has expired. Request a new reset link.' })
  } else if (
    user &&
    user.verificationToken === verificationToken &&
    user.verificationTokenExpire >= new Date() &&
    user.resetPassword === true
  ) {
    try {
      user.password = await AuthenticationController.generatePasswordHash(
        password
      )
      user.resetPassword = false
      user.save()
      return res.status(200).send({ message: 'Password has been changed.' })
    } catch (err) {
      console.error(err)
      return res.status(500).send({
        message: 'An error occurred. Please try again later...',
        error: err,
      })
    }
  } else {
    return res.status(400).send({
      message: 'Token is invalid!. Try resending your request.',
      payload: {
        user,
        verificationToken,
        date: user.verificationTokenExpire >= new Date(),
      },
    })
  }
})

app.post('/auth/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, options) => {
    if (err) {
      // you should log it
      return res
        .status(500)
        .send({ message: 'Something went wrong while logging in.', error: err })
    } else if (!user) {
      // you should log it
      return res.status(403).send({ message: options.message })
    } else {
      const token = AuthenticationController.signUserToken(user)
      return res.status(200).send({ token, message: 'Logged in.' })
    }
  })(req, res)
})

// Protect api endpoint:
// app.use('/admin', [passport.authenticate('jwt', { session: false }), AuthenticationController.adminScope], [adminRoutes])

app.get('/auth/user', async (req, res) => {
  await passport.authenticate(
    'jwt',
    { session: false },
    (err, user, options) => {
      if (err) {
        // you should log it
        return res.status(400).send({
          message: 'Something went wrong while getting the user.',
          error: err,
        })
      } else if (!user) {
        // you should log it
        return res.status(403).send({ message: options.message })
      } else {
        return res.status(200).send({ user })
      }
    }
  )(req, res)
})

export default {
  path: '/api',
  handler: app,
}
