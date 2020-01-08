<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card body-class="text-center">
          <strong>under construction...</strong>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'TabMySettings',
  components: {},
  data: () => ({
    form: {},
    busy: false,
  }),
  computed: {
    ...mapState({}),
    ...mapGetters('user', ['currentUser']),
  },
  methods: {},
}
</script>
