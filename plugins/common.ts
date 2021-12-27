export default (_ctx: any, inject: (arg0: string, arg1: any) => void) => {
  inject('formatDate', (date: Date, format: any) => {
    try {
      return format(date, format, { locale: 'nl' })
    } catch (e) {
      console.error(e)
    }
  })
}
