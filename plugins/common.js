// eslint-disable-next-line no-empty-pattern
export default ({}, inject) => {
  inject('formatDate', (date, format) => {
    try {
      return format(date, format, { locale: 'nl' })
    } catch (e) {
      console.error(e)
    }
  })
}
