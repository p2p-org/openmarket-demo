import dayjs from 'dayjs'
// import 'dayjs/locale/ru'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('en')

export default (ctx, inject) => {
  inject('dayjs', dayjs)
}
