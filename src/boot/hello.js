// var SPOTIFY_CLIENT_ID = "4fcf1eee54994be6a3f87183e80d4943";
// import hello from "hellojs";
import Vue from "vue";
var SpotifyWebApi = require("spotify-web-api-node");

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  var code = null;
  var authorizeURL;
  var refreshToken;
  var token;
  var scopes = [
      "user-read-private",
      "user-read-email",
      "playlist-read-collaborative",
      "playlist-modify-private",
      "playlist-modify-public",
      "playlist-read-private",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-library-modify",
      "user-library-read",
      "user-follow-modify",
      "user-follow-read",
      "user-read-recently-played",
      "user-top-read",
      "streaming",
      "app-remote-control"
    ],
    redirectUri = "http://192.168.43.175:8001/auth/get-access-token",
    clientId = "4fcf1eee54994be6a3f87183e80d4943",
    state = "some-state-of-my-choice";

  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId
  });

  // Create the authorization URL
  authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  window.open = cordova.InAppBrowser.open;
  openInBrowser(authorizeURL, spotifyApi);
  Vue.prototype.$spotifyApi = spotifyApi;
}

function openInBrowser(authorizeURL, spotifyApi) {
  useInAppBrowser(authorizeURL, spotifyApi);
}

function useInAppBrowser(authorizeURL, spotifyApi) {
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

    var code = params["?code"];
    var refreshToken = params["refreshToken"];
    var token = params["token"];

    spotifyApi.setAccessToken(token);
    spotifyApi.setRefreshToken(refreshToken);
    Vue.prototype.$spotifyApi = spotifyApi;

    if (evt.url.includes(endUrl)) {
      browser.close();
      setTimeout(() => {
        browser.close();
      }, 1000);

      return code;
    }
  });
}
// export { spotifyApi };

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
