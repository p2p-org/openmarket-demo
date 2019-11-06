<template>
  <transition name="page">
    <div v-if="loading" id="loader-wrapper">
      <div id="loader">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PreLoader',
  // settings: () => ({
  //   loading: false
  // }),
  computed: {
    ...mapState({
      loading: state => state.loading,
    }),
  },
  methods: {
    ...mapActions(['startLoader', 'stopLoader']),
    start() {
      this.startLoader()
    },
    finish() {
      this.stopLoader()
    },
  },
}
</script>

<style scoped lang="scss">
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-transition: all 0.1s 0.1s ease-in-out;
  transition: all 0.1s 0.1s ease-in-out;
}

#loader {
  position: relative;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-gap: 2px;
  width: 100px;
  height: 100px;
  z-index: 9999;
  -webkit-transition: all 0.1s 0.1s ease-in-out;
  transition: all 0.1s 0.1s ease-in-out;

  > div {
    position: relative;
    width: 100%;
    height: 100%;
    background: #ffffff;
    transform: scale(0);
    transform-origin: center center;
    animation: loader 2s infinite linear;

    &:nth-of-type(7) {
    }

    &:nth-of-type(1),
    &:nth-of-type(5),
    &:nth-of-type(9) {
      animation-delay: 0.4s;
    }

    &:nth-of-type(4),
    &:nth-of-type(8) {
      animation-delay: 0.2s;
    }

    &:nth-of-type(2),
    &:nth-of-type(6) {
      animation-delay: 0.6s;
    }

    &:nth-of-type(3) {
      animation-delay: 0.8s;
    }
  }
}

/* Loaded */
.loaded {
  #loader-wrapper {
    visibility: hidden;
    -webkit-transition: all 0.3s 0.3s ease-in-out;
    transition: all 0.3s 0.3s ease-in-out;
  }

  #loader {
    opacity: 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
}

@keyframes loader {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
  80% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
