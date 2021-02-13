export default {
	showSnackbar(state, payload) {
		state.snackbar.visible = true;
		state.snackbar.text = payload.text;
		state.snackbar.color = payload.color;
	},
};