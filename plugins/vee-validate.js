// eslint-disable-next-line camelcase
import { required, numeric, regex, min_value, max_value } from 'vee-validate/dist/rules'
import { extend, configure } from 'vee-validate'

extend('required', required)
extend('numeric', numeric)
extend('regex', regex)
// extend('email', email)
// extend('length', length)
// extend('confirmed', confirmed)
extend('min_value', min_value)
extend('max_value', max_value)

export default function({ app }) {
  configure({
    // this will be used to generate messages.
    defaultMessage: (_, values) => app.i18n.t(`validations.${values._rule_}`, values),
  })
}
