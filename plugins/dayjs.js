import dayjs from 'dayjs'
// import 'dayjs/locale/ru'
dayjs.locale('en')

export default (ctx, inject) => {
  inject('dayjs', dayjs)
}
