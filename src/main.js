window.onSpotifyWebPlaybackSDKReady = async () => {
	const token = import.meta.env.VITE_ACCESS_TOKEN;
	console.log({ token });

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

	player.addListener(
		"player_state_changed",
		({ position, duration, track_window: { current_track } }) => {
			console.log("Currently Playing", current_track);
			console.log("Position in Song", position);
			console.log("Duration of Song", duration);
		},
	);

	player.addListener("initialization_error", ({ message }) => {
		console.error("initialization_error", message);
	});

	player.addListener("authentication_error", ({ message }) => {
		console.error("authentication_error", message);
	});

	player.addListener("account_error", ({ message }) => {
		console.error("account_error", message);
	});

	// #region client
	player.connect();

	const playToggleButtonElement = document.getElementById("togglePlay");
	playToggleButtonElement.addEventListener("click", () => {
		player.togglePlay();
	});

	const trackProgressElement = document.getElementById("trackProgress");

	const volumeProgressElement = document.getElementById("volumeProgress");

	const volumeUpButtonElement = document.getElementById("volumeUp");
	volumeUpButtonElement.addEventListener("click", async () => {
		const volume = await player.getVolume();
		console.log("volume:current", volume);
		if (typeof volume !== "number") {
			console.error("failed to get volume");
			return;
		}

		const newVolume = volume + 0.1;
		player.setVolume(newVolume);
		volumeProgressElement.setAttribute("value", newVolume);
		console.log("volume:up", newVolume);
	});

	const volumeDownButtonElement = document.getElementById("volumeDown");
	volumeDownButtonElement.addEventListener("click", async () => {
		const volume = await player.getVolume();
		console.log("volume:current", volume);
		if (typeof volume !== "number") {
			console.error("failed to get volume");
			return;
		}

		const newVolume = volume - 0.1;
		player.setVolume(newVolume);
		volumeProgressElement.setAttribute("value", newVolume);
		console.log("volume:down", newVolume);
	});

	const trackNameElement = document.getElementById("trackName");

	const trackAlbumArtElement = document.getElementById("trackAlbumArt");
	const albumArtImageElement = trackAlbumArtElement.querySelector("img");

	setInterval(async () => {
		const state = await player.getCurrentState();
		if (!state) {
			console.error("User is not playing music through the Web Playback SDK");
			return;
		}

		const { position, duration } = state;
		trackProgressElement.setAttribute("max", duration);
		trackProgressElement.setAttribute("value", position);

		const current_track = state.track_window.current_track;
		const next_track = state.track_window.next_tracks[0];

		const art = current_track.album.images[0];
		const album = current_track.album.name;
		const name = current_track.name;
		const artist = current_track.artists[0].name;

		albumArtImageElement.setAttribute("src", art.url);
		trackNameElement.textContent = `${name} - ${artist} | ${album}`;

		console.log("State", state);
		console.log("Currently Playing", current_track);
		console.log("Playing Next", next_track);
	}, 1000);
	// #endregion client
};
