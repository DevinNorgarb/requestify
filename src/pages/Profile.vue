<template>
  <q-page class="flex flex-center">
    <div>
    <div v-if="profile.id">
      <div class="q-title"></div>
      <p><img :src="profile.picture" ></p>
    </div>
  </div>
  </q-page>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      profile: {}
    }
  },
  mounted () {
    this.getProfile('facebook')
  },
  methods: {
    getProfile (network) {
      // if (this.$hello.getAuthResponse(network) == null) {
      //   return
      // }
      // this.$hello(network).api('me')
      //   .then((res) => {
      //     console.log(res)
      //     this.profile = res
      //   })
    }
  }
}
</script>