import axios from 'axios';

const request = (state, commit, method, url, data) => axios({
	baseURL: process.env.VUE_APP_ENDPOINT,
	url,
	method,
	data,
	headers: {
		"Content-type": "application/json"
	},
})
	.then((res) => {
		const response = res.data;
		return response;
	})
	.catch((error) => {
		const message = error.response ? error.response.data.error : error.message;
    commit('showSnackbar', { text: message, color: 'error' });
		return error.response || { data: { success: false, error } };
	});

const apiRequest = (state, commit, method, url, data) => axios({
	baseURL: "http://localhost:8080/api",
	url,
	method,
	data,
	headers: {
		"Content-type": "application/json"
	},
})
	.then((res) => {
		const response = res.data;		
		return response;
	})
	.catch((error) => {
		const message = error.response ? error.response.data.error : error.message;
    commit('showSnackbar', { text: message, color: 'error' });
		return error.response || { data: { success: false, error } };
	});

export default {
	getUser({ state, commit }, username) {
		return request(state, commit, 'get', `/users/${username}`);
	},
	getUserRepos({ state, commit }, username) {
		return request(state, commit, 'get', `/users/${username}/repos`);
	},
	getNotes({ state, commit }, username) {
		return apiRequest(state, commit, 'get', `/notes?username=${username}`);
	},
	saveNote({ state, commit }, note) {
		return apiRequest(state, commit, 'post', `/notes`, note);
	},
	deleteNote({ state, commit }, id) {
		return apiRequest(state, commit, 'delete', `/notes/${id}`);
	},
	deleteAllNotes({ state, commit }, username) {
		return apiRequest(state, commit, 'delete', `/notes/all/${username}`);
	}
}