<template>
  <div>
    <b-card v-if="busy" class="mb-3" body-class="text-center">
      <b-spinner class="align-middle" />
      <span>Loading...</span>
    </b-card>
    <slot v-else />
  </div>
</template>

<script>
export default {
  name: 'LoadingBox',
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
