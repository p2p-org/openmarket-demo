import Vue from 'vue'

// Vue.directive('scroll', {
  // inserted: function (el, binding) {
  //   let f = function (evt) {
  //     if (binding.value(evt, el, binding.arg)) {
  //       window.removeEventListener('scroll', f)
  //     }
  //   }
  // }
// }

Vue.directive('scroll', function (el, binding) {
  // el.style.backgroundColor = binding.value
  const f = function (evt) {
    binding.value(evt, el, binding.arg)
  }
  window.addEventListener('scroll', f)
})
