<template>
  <section v-if="currentUser" class="user">
    <b-container>
      <b-row>
        <b-col lg="10" xl="8" class="mx-auto">
          <b-card class="mb-3 p-2">
            <h6 class="text-muted">
              Settings
            </h6>
            <div class="text-center  my-2">
              <strong>under construction...</strong>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'PageMySettings',
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
