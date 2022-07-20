import { baseUrl } from '@/common/config.js'

export const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			success: (res) => {
				// 判断请求失败或者成功
				// if (res.data.code !== 200) {
				// 	return uni.showLoading ({
				// 		title: '阿哦 网络出现异常咯'
				// 	})
				// }
				// 请求成功
				resolve(res)
			},
			fail: (err) => {
				// uni.showLoading ({
				// 	title: '获取歌曲失败'
				// })
				// reject (error)
			}
		})
	})
}