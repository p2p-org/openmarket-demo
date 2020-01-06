<template>
  <div class="d-flex flex-column justify-content-middle el-datetime">
    <span class="date">{{ value | toDate($i18n.locale) }}</span>
    <span class="time">{{ value | toTime($i18n.locale) }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
}
</script>
