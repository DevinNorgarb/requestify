// var SPOTIFY_CLIENT_ID = "4fcf1eee54994be6a3f87183e80d4943";
// import hello from "hellojs";
var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi();

export default ({ Vue }) => {
  //   // hello.init({
  //   //   spotify: SPOTIFY_CLIENT_ID
  //   // });
  //   hello.init(
  //     {
  //       spotify: SPOTIFY_CLIENT_ID
  //     },
  //     {
  //       redirect_uri: "http://192.168.43.175:8001/auth/login/spotify/callback"
  //       // oauth_proxy: "https://auth-server.herokuapp.com/proxy"
  //     }
  //   );
  //   Vue.prototype.$hello = hello;

  const SpotifyStrategy = require("passport-spotify").Strategy;
  var passport = require("passport");
  // console.log(passport);

  passport.use(
    new SpotifyStrategy(
      {
        clientID: "4fcf1eee54994be6a3f87183e80d4943",
        clientSecret: "203f38db980246d78aee9b1eb1b16aea",
        callbackURL: "http://192.168.43.175:8001/auth/login/spotify/callback"
      },
      function(accessToken, refreshToken, expires_in, profile, done) {
        console.log(accessToken, refreshToken, expires_in, profile, done);

        User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
          return done(err, user);
        });
      }
    )
  );

  var scopes = ["user-read-private", "user-read-email"],
    redirectUri = "http://192.168.43.175:8001/auth/get-access-token",
    clientId = "4fcf1eee54994be6a3f87183e80d4943",
    state = "some-state-of-my-choice";

  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
  var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId
  });

  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

  // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
  console.log(authorizeURL);

  // window.location.href = authorizeURL;

  useInAppBrowser(authorizeURL);

  var code = "MQCbtKe23z7YzzS44KzZzZgjQa621hgSzHN";

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      console.log("The token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);
      console.log("The refresh token is " + data.body["refresh_token"]);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
};

function useInAppBrowser(authorizeURL) {
  var endUrl = "https://commandify.devswebdev.com"; // this.getUser.redirectUri;
  // var authorizeURL2 = `https://commandify-api-v2.devswebdev.com/auth/redirect-to-provider`;

  var browser = cordova.InAppBrowser.open(
    authorizeURL,
    "_blank",
    "location=no",
    "hidden=no"
  );
  window.plugins.spinnerDialog.show(null, "Loading");

  browser.addEventListener("loadstop", evt => {
    window.plugins.spinnerDialog.hide();
  });

  browser.addEventListener("loadstart", evt => {
    var url_string = evt.url;
    var url = new URL(url_string);

    console.log(url_string);

    // var params = this.parse_query_string(url.search);

    // this.code = params["?token"];
    // this.auth_code = params["?code"];

    // if (params.user) {
    //   var user = JSON.parse(params["?user"]);
    //   // this.setDatabaseUser(user);
    // }

    // this.setAccessToken(this.code);
    // this.exchangeCodeForToken();

    if (evt.url.includes(endUrl)) {
      browser.close();
      window.plugins.spinnerDialog.hide();

      // this.$router.push("voice-control");
      setTimeout(() => {
        // window.location.reload();
      }, 1000);
    }
  });
}
