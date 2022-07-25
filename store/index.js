// 页面路径：store/index.js
import { createStore } from 'vuex'
const store = createStore({
	state:{
		list: [],
		nexId: '',
		nexsId: ''
	},
	mutations: {
		add (state, value) {
			state.list.push(value)
		},
		delete (state) {
			state.list = []
		},
		// 下一首
		MEXT_ID (state, value) {
			if (state.list.length === 0) {
				return
			} else {
				for (let i = 0; i < state.list.length; i++) {
					if (state.list[i].id === parseInt(value)) {
						if (i === state.list.length - 1) {
							state.nexId = state.list[0].id
							return
						} else {
							state.nexId = state.list[i+1].id
							return
						}
					}
				}
			}
		},
		// 上一首
		MEXTS_ID (state, value) {
			if (state.list.length === 0) {
				return
			} else {
				for (let i = 0; i < state.list.length; i++) {
					if (state.list[i].id === parseInt(value)) {
						if (i === 0) {
							state.nexsId = state.list[state.list.length - 1].id
							return
						} else {
							state.nexsId = state.list[i-1].id
							return
						}
					}
				}
			}
		},
		// 根据ID删除对应的内容
		delend (state, value) {
			state.list = state.list.filter((item) => {
				return item.id !== value
			});
		}
	}
})

export default store