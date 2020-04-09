// var SPOTIFY_CLIENT_ID = "4fcf1eee54994be6a3f87183e80d4943";
// import hello from "hellojs";
var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi();
var code = null;
var authorizeURL;

var scopes = ["user-read-private", "user-read-email"],
  redirectUri = "http://192.168.43.175:8001/auth/get-access-token",
  clientId = "4fcf1eee54994be6a3f87183e80d4943",
  state = "some-state-of-my-choice";

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId
});

// Create the authorization URL
authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  window.open = cordova.InAppBrowser.open;
  openInBrowser();
}

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

  // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
  // console.log(authorizeURL);
  Vue.prototype.$spotifyApi = spotifyApi;

  // window.location.href = authorizeURL;
};

function openInBrowser() {
  useInAppBrowser(authorizeURL);
}

function useInAppBrowser(authorizeURL) {
  var endUrl = "https://commandify.devswebdev.com"; // this.getUser.redirectUri;

  var browser = cordova.InAppBrowser.open(
    authorizeURL,
    "_blank",
    "location=no",
    "hidden=no"
  );
  // window.plugins.spinnerDialog.show(null, "Loading");

  browser.addEventListener("loadstop", evt => {
    // window.plugins.spinnerDialog.hide();
  });

  browser.addEventListener("loadstart", evt => {
    var url_string = evt.url;
    var url = new URL(url_string);

    var params = parse_query_string(url.search);

    code = params["?code"];
    var refreshToken = params["refreshToken"];
    var token = params["token"];

    spotifyApi.setAccessToken(token);
    spotifyApi.setRefreshToken(refreshToken);

    if (evt.url.includes(endUrl)) {
      browser.close();
      setTimeout(() => {
        browser.close();
      }, 1000);

      return code;
    }
  });
}

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}
