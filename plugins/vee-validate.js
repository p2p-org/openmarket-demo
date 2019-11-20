import { required, numeric, regex, min_value } from 'vee-validate/dist/rules'
import { extend } from 'vee-validate'
import en from 'vee-validate/dist/locale/en.json'

extend('required', {
  ...required,
  message: en.messages.required,
})
extend('numeric', {
  ...numeric,
  message: en.messages.numeric,
})
extend('regex', {
  ...regex,
  message: en.messages.regex,
})
extend('min_value', {
  ...min_value,
  message: en.messages.min_value,
})
