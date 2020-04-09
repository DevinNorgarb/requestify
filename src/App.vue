<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {


    setTimeout(() => {
      console.log(this.$spotifyApi);

      this.$spotifyApi.getMySavedTracks({
      limit : 2,
      offset: 1
    })
    .then(function(data) {
      console.log('Done!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    }, 4000);


  }
}
</script>
