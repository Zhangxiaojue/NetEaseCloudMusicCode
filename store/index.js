import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
.
export default new Vuex.Store({
	state: {
		topListIds: [],
		nexId: ''
	},
	mutations: {
		INIT_TOPLISTIDS(state, payload) {
			state.topListIds = payload;
		}
	}
})