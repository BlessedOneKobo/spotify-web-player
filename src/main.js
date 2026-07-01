console.log(import.meta.env.VITE_ACCESS_TOKEN);
window.onSpotifyWebPlaybackSDKReady = () => {
	const token = import.meta.env.VITE_ACCESS_TOKEN;

	const player = new Spotify.Player({
		name: "Web Playback SDK Quick Start Player",
		getOAuthToken: (cb) => {
			console.log("log:getOAuthToken", token);
			cb(token);
		},
		volume: 0.5,
	});

	player.addListener("ready", ({ device_id }) => {
		console.log("Ready with Device ID", device_id);
	});

	player.addListener("not_ready", ({ device_id }) => {
		console.log("Device ID has gone offline", device_id);
	});

	player.addListener("initialization_error", ({ message }) => {
		console.error("initialization_error", message);
	});

	player.addListener("authentication_error", ({ message }) => {
		console.error("authentication_error", message);
	});

	player.addListener("account_error", ({ message }) => {
		console.error("account_error", message);
	});

	player.connect();

	document.getElementById("togglePlay").onclick = function () {
		player.togglePlay();
	};
};
