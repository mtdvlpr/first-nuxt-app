const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const from = process.env.SENDGRID_SENDER

async function sendEmail(to, subject, text, html) {
  const msg = {
    to,
    from,
    subject,
    text,
    html,
  }

  await sgMail.send(msg).catch((error) => {
    throw error
  })
}

async function sendRegistrationToken(to, subject, verificationToken) {
  const html = `<p>Dear user,<br><br> Thank you for registering! Please click the link below to confirm your email address and finish your registration.</p><a href="http://localhost:3000/register/confirmation?token=${verificationToken}">Activate your account</a>`
  const text = stripHtmlTags(html)
  await sendEmail(to, subject, text, html)
}

async function sendPasswordChangeToken(to, subject, verificationToken) {
  const html = `<p>Please click into the link below to change your password</p><a href="http://localhost:3000/login/reset/confirmation?token=${verificationToken}">Change your password</a>`
  const text = stripHtmlTags(html)
  await sendEmail(to, subject, text, html)
}

function stripHtmlTags(html) {
  return html.replace(/(<([^>]+)>)/gi, '')
}

export default {
  sendEmail,
  sendRegistrationToken,
  sendPasswordChangeToken,
}
