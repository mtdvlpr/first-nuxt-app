import User from '../models/user'
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy

const expireSpan = 3600 * 1000 * 24
const authUserSecret = process.env.AUTH_USER_SECRET
const authEmailVerificationSecret = process.env.AUTH_EMAIL_VERIFICATION_SECRET

const adminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({
      status: 'fail',
      message: 'Invalid authorization level!'
    })
  }
  next();
}

const tokenExtractor = function (req) {
  let token = null
  if (req.req && req.req.cookies && req.req.cookies['auth._token.local']) {
    const rawToken = req.req.cookies['auth._token.local'].toString()
    token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
  } else if (req && req.cookies && req.cookies['auth._token.local']) {
    const rawToken = req.cookies['auth._token.local'].toString()
    token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
  } else if (req && req.headers && req.headers.authorization) {
    const rawToken = req.headers.authorization.toString()
    token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
  }
  return token
}

passport.use(new JwtStrategy({
  jwtFromRequest: tokenExtractor,
  secretOrKey: authUserSecret
},
  async function (jwtPayload, done) {
    try {
      const user = await getUser(jwtPayload.email)
      if (user) {
        return done(null, {
          id: user._id,
          email: user.email,
          scope: user.scope
        })
      } else {
        return done(null, false, { message: 'The user could not be found!' })
      }
    } catch (err) {
      return done(err)
    }
  }
))

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async function (email, password, done) {
      await getUser(email)
        .then((user) => {
          return user
        }).then(async (user) => {
          if (!user) {
            return done(null, false, { message: 'Either your email or password was incorrect!' })
          }

          const validation = await comparePasswords(password, user.password)
          if (validation && user.isVerified) {
            return done(null, user)
          } else if (validation) {
            return done(null, false, {
              message: 'You have to verify your email address first!',
              resendToken: true
            })
          } else {
            return done(null, false, { message: 'Either your email or password was incorrect!' })
          }
        }).catch((err) => {
          return done(err)
        })
    }
  )
)

async function createUser(email, password) {
  const verificationToken = generateVerificationToken()
  const verificationTokenExpire = generateVerificationTokenExpire()
  return await User.create({ email, password, verificationToken, verificationTokenExpire })
    .then((data) => {
      return data
    }).catch((error) => {
      throw error
    })
}

async function getUser(email) {
  return await User.findOne({ email })
    .then((data) => {
      return data
    }).catch((error) => {
      throw error
    })
}

async function generatePasswordHash(plainPassword) {
  return await bcrypt.hash(plainPassword, 12)
}

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

function generateVerificationToken() {
  return crypto.randomBytes(30).toString('hex')
}

function generateVerificationTokenExpire() {
  return new Date(Date.now() + expireSpan)
}

function signVerificationToken(email, verificationToken) {
  return jwt.sign({
    email,
    verificationToken
  }, authEmailVerificationSecret)
}

function verifySignedVerificationToken(token) {
  return jwt.verify(token, authEmailVerificationSecret)
}

function signUserToken(user) {
  return jwt.sign({
    id: user.id,
    email: user.email
  }, authUserSecret)
}

export default {
  createUser,
  getUser,
  generatePasswordHash,
  generateVerificationToken,
  generateVerificationTokenExpire,
  signVerificationToken,
  verifySignedVerificationToken,
  signUserToken,
  adminRole
}