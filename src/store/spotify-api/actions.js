/*
export function someAction (context) {
}
*/
export const authenticate = ({ commit, dispatch }, data) => {
  if (!data) {
    return;
  }

  spotifyApi.setAccessToken(data.token);
  spotifyApi.setRefreshToken(data.refresh_token);

  spotifyApi.getMe().then(
    function(data) {
      console.log(data);

      // dispatch("getUserTracks");
      // dispatch("getUserPlaylists", { offset: 0 });
      // dispatch("getMyCurrentPlaybackState");

      // commit("authenticatedUserMutation", data.body);
    },
    function(err) {}
  );

  // export
};
