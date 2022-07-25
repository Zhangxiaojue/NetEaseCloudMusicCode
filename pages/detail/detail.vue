<template>
	<view class="detail">
		<view class="fixbg" :style="{ 'background-image' : `url(${songDetail.al.picUrl})`}"></view>
		<musichead :title="songDetail.name" icon="true" color="white"></musichead>
		<view class="container" v-show="!isLoading">
			<!-- <scroll-view scroll-y="true"> -->
				<!-- 播放器 -->
				<view v-if="showHide === 1" class="detail-play">
					<image @tap="cheshi" v-if="songDetail.al.picUrl !== ' ' " :src="songDetail.al.picUrl" :class="{ 'detail-play-run' :  isPlayRotate}" mode=""></image>
					<view></view>
					<!-- 图标 -->
					<view class="detail-play-icon">
						<text @tap="love" class="iconfont" :class="iconPlays" :style="{ 'color' :  `${color}` }"></text>
						<text class="iconfont icon-xiazai-wenjianxiazai-07"></text>
						<text @tap="pinlun" class="iconfont icon-pinglun"></text>
						<text class="iconfont icon-fenxiang"></text>
						<!-- <button class="list-share" open-type="share">
							<text class="iconfont icon-fenxiang"></text>
						</button> -->
						<text class="iconfont icon-gengduo-shuxiang"></text>
					</view>
				</view>
				<!-- 歌词 -->
				<view v-else-if="showHide === 2" class="detail-lyric" @tap="cheshi2">
					<view class="detail-lyric-wrap" :style="{ transform : 'translateY(' + - (lryicIndex - 1) * 82 + 'rpx)' }">
						<view class="detail-lyric-item" :class="{ active : lryicIndex === index }" v-for="(item,index) in songLyric" :key="index">{{ item.lyric }}</view>
					</view>
				</view>
				<!-- 猜你喜欢的歌 -->
				<view v-else-if="showHide === 3" class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view>{{ item.name }}</view>
							<view>
								<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70" src="/static/vip.png" mode=""></image>
								<image v-if="item.privilege.maxbr === 999000" src="/static/sq.png" mode=""></image>
								{{ item.album.artists[0].name }} - {{ item.album.name }}
							</view>
						</view>
						<text class="iconfont icon-24gl-playCircle"></text>
					</view>
				</view>
				<!-- 评论区 -->
				<view v-else-if="showHide === 4" class="detail-comment">
					<view class="detail-comment-head">精彩评论</view>
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{ item.user.nickname }}</view>
									<view>{{ item.timeStr }}</view>
								</view>
								<view class="detail-comment-like">{{ item.likedCount }}<text class="iconfont icon-dianzan"></text></view>
							</view>
							<view class="detail-comment-text">{{ item.content }}</view>
						</view>
					</view>
				</view>
			<!-- </scroll-view> -->
			<!-- 控制台 -->
			<view class="detail-kong">
				<!-- 进度条 -->
				<view class="detail-top">
					<view class="detail-top-top">
						00:00 
						<view class="detail-top-title">
							<view></view>
							<view></view>
							<view></view>
						</view>
						03:00
					</view>
				</view>
				<view class="detail-bottom">
					<text class="iconfont icon-24gl-repeat2"></text>
					<text @tap="shangyishou" class="iconfont icon-shangyishoushangyige"></text>
					<text @tap="handleToplay" class="iconfont" :class="iconPlay"></text>
					<text @tap="xiayishou" class="iconfont icon-xiayigexiayishou"></text>
					<text @tap="handleTopNono" class="iconfont icon-liebiao"></text>
				</view>
			</view>
		</view>
		<!-- 弹出层 -->
		<view class="bf-sx" :class="abc">
			<view class="bf-sx-icon">
				<text @tap="block" class="iconfont icon-guanbi"></text>
			</view>
			<view class="bf-sx-title">
				<view>当前播放</view>({{ dataList.length }})
				<text @tap="handleToDelete" class="iconfont icon-lajitong"></text>
			</view>
			<view class="bf-sx-list">
				<view class="bf-sx-listdata" v-for="(item,index) in dataList" :key="index" @tap="handleToSimi(item.id)">
					<view :style="{'color': songDetail.id === item.id ? 'red' : ''}">{{ item.name }}</view>
					<view :style="{'color': songDetail.id === item.id ? 'red' : ''}"> - {{ item.ar[0].name }}</view>
					<text class="iconfont icon-24gl-playCircle"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import musichead from '@/components/musichead/musichead.vue'
	import '@/common/iconfont.css'
	import { myRequest } from '@/common/http.js'
	
	export default {
		data() {
			return {
				songDetail: {
					al: {
						picUrl: ' '
					}
				},
				songSimi: [],
				songComment: [],
				songLyric: [],
				lryicIndex: 0,
				iconPlay: 'icon-zanting',
				isPlayRotate: true,
				timer: null,
				isLoading: true,
				showHide: 1,
				iconPlays: 'icon-aixin1',
				color: '',
				dataList: [],
				abc: 'none',
				id: ''
			}
		},
		components: {
			musichead
		},
		onLoad (e) {
			// 获取下一首的ID
			this.$store.commit('MEXT_ID', e.id)
			// 获取上一首的ID
			this.$store.commit('MEXTS_ID', e.id)
			// console.log(e.id)
			uni.showLoading ({
				title: '玩命加载中...',
				icon: 'loading'
			})
			this.isLoading = true;

			this.getDetail(e.id)
			this.getSime(e.id)
			this.getComment(e.id)
			this.getLyric(e.id)
			this.getUrl(e.id)
			
			// 判断是否是喜欢歌曲
			let num = this.$store.state.list
			this.dataList = num
			num = Object.values(num)
			if (num.length === 0) {
				return
			} else {
				for (let i = 0 ; i < num.length; i++) {
					if (num[i].id === parseInt(e.id)) {
						this.iconPlays = 'icon-aixin-copy'
						this.color = 'red'
						return
					}
				}
			}
		},
		// 离开当前页面
		onUnload () {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		onHide () {
			this.cancelLyricIndex()
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		methods: {
			// 歌曲详细信息接口
			async getDetail (ids) {
				const res = await myRequest({ url: `/song/detail?ids=${ids}` })
				this.songDetail = res.data.songs[0]
			},
			// 相似歌曲接口
			async getSime (id) {
				const res = await myRequest({ url: `/simi/song?id=${id}` })
				this.songSimi = res.data.songs
			},
			// 评论接口
			async getComment (id) {
				const res = await myRequest({ url: `/comment/music?id=${id}` })
				this.songComment = res.data.hotComments;
			},
			// 歌词接口
			async getLyric (id) {
				const res = await myRequest({ url: `/lyric?id=${id}` })
				let lyric = res.data.lrc.lyric
				// console.log(lyric)
				let re = /\[([^\]]+)\]([^\[]+)/g;
				var result = []
				lyric.replace(re, ($0, $1, $2) => {
					result.push({ "time" : this.formatTimeToSec($1), "lyric" : $2 })
				})
				// console.log(result)
				this.songLyric = result
			},
			// 播放接口
			async getUrl (id) {
				const res = await myRequest({ url: `/song/url?id=${id}` })
				
				// #ifdef MP-WEIXIN
				this.bgAudioManager = uni.getBackgroundAudioManager();
				this.bgAudioManager.title = this.songDetail.name;
				// #endif
				
				// #ifdef H5
				if (!this.bgAudioManager) {
					this.bgAudioManager = uni.createInnerAudioContext();
				}
				this.iconPlay = 'icon-24gl-playCircle';
				this.isPlayRotate = false
				// #endif
				this.bgAudioManager.src = res.data.data[0].url || '';
				// 启动定时器
				// this.listenLyricIndex();
				this.bgAudioManager.onPlay( () => {
					this.iconPlay = 'icon-zanting';
					this.isPlayRotate = true;
					// 启动定时器
					this.listenLyricIndex()
				})
				this.bgAudioManager.onPause( () => {
					this.iconPlay = 'icon-bofang';
					this.isPlayRotate = false
					// 关闭定时器
					this.cancelLyricIndex()
				})
				// 监听歌曲结束播放下一首
				this.bgAudioManager.onEnded(() => {
					this.getDetail( this.$store.state.nexId )
					this.getSime( this.$store.state.nexId )
					this.getComment( this.$store.state.nexId )
					this.getLyric( this.$store.state.nexId )
					this.getUrl( this.$store.state.nexId )
					console.log(this.$store.state.nexId)
				})
				// 数据加载出阿来之后隐藏
				this.isLoading = false
				uni.hideLoading()
			},
			formatTimeToSec(value) {
				let arr = value.split(':')
				return (Number(arr[0] * 60 ) + Number(arr[1])).toFixed(1)
			},
			// 点击播放暂停
			handleToplay () {
				if ( this.bgAudioManager.paused ) {
					this.bgAudioManager.play()
				} else {
					this.bgAudioManager.pause()
					// 关闭定时器
					this.cancelLyricIndex()
				}
			},
			// 让歌词随着音乐滚动
			listenLyricIndex () {
				clearInterval(this.timer);
				this.timer = setInterval( () => {
					for (let i = 0; i < this.songLyric.length; i++) {
						if ( this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i + 1].time) {
							this.lryicIndex = i; 
						} 
						if ( this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1].time ) {
							this.lryicIndex = this.songLyric.length - 1;
							break;
						}
					}
				},500)
				
			},
			// 停止定时器
			cancelLyricIndex () {
				clearInterval(this.timer)
				this.timer = null
			},
			// 点击猜你喜欢更改数据
			handleToSimi (id) {
				// 获取下一首的ID
				this.$store.commit('MEXT_ID', id)
				// 获取上一首的ID
				this.$store.commit('MEXTS_ID', id)
				// 判断是否是喜欢歌曲
				// let num = this.$store.state.list
				// // this.dataList = num
				// num = Object.values(num)
				// if (num.length === 0) {
				// 	return
				// } else {
				// 	for (let i = 0 ; i < num.length; i++) {
				// 		if (num[i].id === parseInt(e.id)) {
				// 			this.iconPlays = 'icon-aixin-copy'
				// 			this.color = 'red'
				// 			return
				// 		}
				// 	}
				// }
				this.getDetail(id)
				this.getSime(id)
				this.getComment(id)
				this.getLyric(id)
				this.getUrl(id)
			},
			// 点击显示歌词
			cheshi () {
				this.showHide = 2
			},
			// 点击显示图片
			cheshi2 () {
				this.showHide = 1
			},
			// 点击爱心变红
			love () {
				if (this.iconPlays !== 'icon-aixin-copy') {
					this.iconPlays = 'icon-aixin-copy'
					this.color = 'red'
					this.getList(this.songDetail.id)
				} else {
					this.$store.commit('delend', this.songDetail.id)
					// 获取喜欢歌曲的数据
					let num = this.$store.state.list
					this.dataList = num
					this.iconPlays = 'icon-aixin1'
					this.color = ''
				}
			},
			async getList (id) {
				const res = await myRequest({url:`/song/detail?ids=${id}`})
				this.$store.commit('add', res.data.songs[0]);
				// 获取喜欢歌曲的数据
				let num = this.$store.state.list
				this.dataList = num
			},
			// 点击显示弹出层
			handleTopNono () {
				this.abc = ''
			},
			// 点击隐藏弹出层
			block () {
				this.abc = 'none'
			},
			// 删除全部弹出层的内容
			handleToDelete () {
				this.$store.commit('delete')
				this.dataList = []
				this.iconPlays = 'icon-aixin1'
				this.color = ''
			},
			// 点击切换下一首
			xiayishou () {
				if (this.$store.state.nexId !== '') {
					this.handleToSimi(this.$store.state.nexId)
				} else {
					return
				}
			},
			// 点击切换上一首
			shangyishou () {
				if (this.$store.state.nexsId !== '') {
					this.handleToSimi(this.$store.state.nexsId)
				} else {
					return
				}
			},
			// 点击跳转到评论区
			pinlun () {
				uni.navigateTo({
					url: `/pages/pinlun/pinlun?id=${this.songDetail.id}`
				})
			}
		}
	}
</script>

<style scoped>
	.none {
		display: none;
	}
	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background-image: url(/static/disc.png);
		background-size: cover;
		margin: 214rpx auto 0;
		position: relative;
	}
	.detail-play image {
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		animation: 10s linear move infinite;
		animation-play-state: paused;
	}
	.detail-play .detail-play-run {
		animation-play-state: running
	}
	@keyframes move {
		from { 
			transform: rotate(0deg); 
		}
		to {
			transform: rotate(360deg);
		}
	}
	.detail-play view:nth-child(2) {
		width: 230rpx;
		height: 360rpx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAAEECAYAAAC4F6+oAAAgAElEQVR4nO19CZgcVbX/ubX0MjNZyAIkJPJlgpJAEoJAFoRAEJBF1CAgyiLIJg8QBEWWgH+fvseiIgo+BEXZAgIhYZGwJCwRhCSQFTF7hrBlmZmsk5nuruX+v1NVt/p2dVV3dc9Mr/f3ffV1JtOdvrfql3PPfkBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQKAbIDKQffN9fMfu3fMVRflSMV+za9dO2LOns6gVNjY2QN++/Yr6rK7ra/r36XNMmPd2JhM7o9FoV1FfJFASSGG+RNO0j4tdTENDQ9H76M5nw675sAlH0KK/RKBkCEXUrq6uVcUuSFFUSzIWCvwMfrZYFLJmiRCj6C8SKAlCEfXTTz5e3J3F9OnTF6LRSOj343vxM91B2DWPHz9ekLQKEIqojz/xxFuEEK3Y7RBCYK+9BoSSrPgefC9+phvfp+Gaw7x3ypQphiRJZtFfJlAShDKmEK3btj0aj8eP7+6iNC2FxzKkUkkwDJsfsixBJBK1dNLuHPcMXV1d8wYPGHBemPcuWb5sz7hx4/YQQgRZKxgKGshhJOumTZuebm5u7jZRVTViXb0JXCsAhCGeOWrUKF2QtPIhXXTpJaEW+eNrrnnRNM1Nlb4jXCOuNcx7ce/CkKoOSKijhVnpa3Pnam1tbX+s9F3hGnGtYd4r9NPqAUkmk/GGWKwBKMj5Vv3VE05QZ82e9Y4sK1+oxB0ahv7x6dNOPzIUUQkYnYlEp3D0VwckPPouuuQS4uh0Oa/X5s5Nrl277vpK3RmuDdcYZi+4Z3HsVw8IpVRasWJF45cPGR8Nu+pNW7f+uk+fPhdU0i5379790JC99/5p2PcvWb4sKaz96oGED+qg0aOTYY0qxLnnnDNd1/XllbJLXAuuKez7ca+4Z0HS6oHlllJUVb/iiiuSQICGuV6bNzfx+IwZ56FOWO6d4hpwLbimsOvHveKeq+cxCVhEZVL1ppunh5Yw/3X5Dz+f8diMr5eTrPjduAZcS9jP4B6FNK0+uHFK1FVTqVS0IRqNASGhQquI/7vvT0O/d845jyqKckgpd4/HPUrSQkgKlJqdyWQiEokIolYZXELig1NkWXv4sccK2gES5dunn34qGjOl2jp+16UXX3xyQSQFANwb7lGQtPqQlfmhpVKRK668su+DDzwQ3nWDEpiC/P7SpVO/+MUD7uwtPytGndasWfPjww8d/2qhn73o0kvlP9577y41Ekn1xtoEehdZRGUqwOjRo2MbN2wI9+U2UfHfUo4+6qiG/3vg/vOHDRt2hapGBvXE6ik1k62tbb+84frr//rUk39PFPr5/ZubYeXKleLIr2L45tIZuq78+8MP49OmTVNCkZUjqgwgE0KiI5pHNv327t99Y9wh404bMHDgBEnKG/jKQmfnHkgmkyhJ4afX/WRosSSdPXu2Pubgg7tkRRGWfpUiMOmTkfXLh4wPwTBK2PGPeq9CSIxSigGEGABpGDly5JCrrrl63JhxYw/Zd98hB/Tt13efvn37DWafNk0DDMOARCJhpQB2dnZCMpmwUv5isRjEYlFoafno1KlTjnmn0Nu8ZPkyQ5C0+pEzOzlTsrbkri0iILtEBaJSoJglHQUgcSx/IgAxChAhhFgJpx+uWXWHJMvNSM5UKmVdSFjTpFZ+qizLVo5qNBqFeDwGHR17fjH2oIPvDnvH928eQYQkrR3kdEPhA8YHjQ8cH3zOXVNqenJATQIEyW1wMXYXW7du/VRRZIuQkiRh0oH1K29mP/6zSN6mpqZxYe+6IGntIa+/lCfrgQeNziFViR35ATApUJMQYlCgFkmIQ1QCoFNKrcymtavXfIikRJKyV9RjeZ5Smv66WDQ6NszdxzUKktYeQjn2GVmXLl2aumn69LzFTEaGFLUlLfVI1Pnz57fIsmIRFKWqTVZivXrjDShVKcABV179o4G5vhfXhmsUJK09hI5A4YNH986tt96y5+HHHiW+0pU//ikwP6xBM1PsLMx45NEWQkinffQTS5ra0tVeEv7Z+09fcMGFh/utDdeCa8K14RoFSWsPoYkKTvQKHebfPfvs3Uy6SoSY7OKPf+f9mlOT5RKVP/5379q9wTacFEB9lUlVpq8yMA1g0MAB4/nvw4tJUVwTrk34SWsTBRGVgZeu7y9bSm+4+eYsFxa1j3wGg/gYVJs3b1qHktQ++m3C8pIUiYuGFFguLAqNTX1ciYrfid8tpGh9QCl2l47kSlFK9YNGj1bOOPOM6MynZ5IZj88wN25okVFPVTL0VGLpqbys/GDFivUHjhqF7XcssqIvlTewwC5BsF7RsJIIjEWCnnHmGfidezBVT0jQ+kDxXR48wNCraRgS+l1nPj1TWbhwYcP8ufMkx59qOf4df2qE+VO//o3T9r3/wb/ck0h0QSKRtHypuq5bkSiw6v1lUFXFKq9Gx39DQxwaGhoPiEQiLYKg9YWiJaoXDnHMKEid6Py//uabYeCAAbFNn32mbd60OappGk10dZltra2Wnool/v94/oXNmqZ1SpLcgLpq2uoP/v+TSCQOj0aj6+v9wdUbeoyoGaBg3Pmr/0maBAyTUkMhxBzRPNJ6x6DBgwHJOmDAAOu70aDq17/fGJSeqKMyndQ66rkgAP6Mv+vXr894AHiy3h9cvaHniUoAnZ6WRSQht8D62diwfl3S/j5LXMa2tbdj09TI1i2blw8cNHCMrqMhpVvkpJSA6XOwI1kNwzii3h9aPaIoqz8UCNhWOPIOXP+qN5xqrli+Yh2Sk8X3UaqiB8BWA2y/KotQ4aumaRNRH673B1dv6O0HbqKnHj0AGFIlYBtAhItUzX7mmXWYJWU7/AkXocp0U6E+YburzKZUKnVwvT+4ekOPEzVJTU/EirgBAEeyZlQO/PPN+dsNXd+C0hQJywIA2U5/6l6SJPlGqARqF70nUZ0QqsTcSBQ0PvbPqwDt7e2rmdXPsqnY8c8HABhRZVmeKDhZX+gdohJHByWgo0HF66RgcdZy/LuStmVDy1pbisoZ2VRIVvSpMoIymKY5vt4fXL2hFEYJSlHDa1BRm6jW7xe///5alkXFkxWc5BT2Z0ystt1U5uHY3K3eH149oWTWMzOonCSVDIPqoQf/utaO+UtuUoqdnyq5USoGu2zFlFVVFVK1jtArRPUaVBKRDI9eygwq6+cN69cnu7o6N9rSVHYTqJkKwI59dPjj5fw8od4fXj2hN/2oJpeTCgDuz7xBBey1devWdUyKsuRpPpTKCGof/VhbZQqDqo7Q+0d/2qACXk/lDCqEiQaVLUnTvlQGm6CmUz9lMnXg0Hp/ePWEUumolkHF/Uw9BhXMe/XVld7EaV6i4mnPS1TDMEYZhlHc/EmBqkOvEdXP8c8ZVAZLpmYG1YxHH9uIFQG2VGXHfzohBTIkK2XJK0JPrROUzOp3HP9ZtVPs523t7fqunTs2pvVUKSOMysiZviw9VRC1TtC7RM1jUFHHVcWI+9lnn69M66j20tjxnylV3QiVyKSqE5RGojKDyieTijeo1q5Zs4b5U8EpQ8nUUzMNKkrpl+v0udUdSpkuZzrl1ODoqYygrJwaXp83b52f1Z+WqpkGla7rww3DGFK3T6+O0KtEDTKonB8MbybV3/7y4CeUmh12QgoLpdq/CzKoCCGT6vC51R1KI1EzM6m4KzuTasf27esynf55DSoRSq0DlMLh71r4biaVa1DZmVTOrx2D6rM1fIQKAgwqTk/9Sv09tvpD6XTUkKUpq1euamHZ/uzyM6gYWSVJEtn+dYBS1x7lLU158YUX1vDkzJaqvIvKRINq31QqtX9dPbU6RK8TNaA0xYJfacqsmc9s0XV9BzOoWIQKchhUiqIIN1WNo3QStQCDaueOHR8VYlCJUGrto1QO/7wGFV+aUqhBJWr9ax+l1VGZQZWnNGXFsuWrCzGoKKWH1c0Tq1OUo5GDJTVzGVTPP/vsOr77dJBBZddQWUTtn0wmR9b3o6xtlISohdb6vzznpXY0qPhEaj+DCjidVZRQ1zZKK1ELqPXf1t6+phCDSpIkcfzXMErp8C+o1n/jRx+t9Tb1zWVQidzU2ka5mo3lrfW3m6flNqi4On98HSeap9Uuyvpg8zVPK8Sg0nWjbzKZ/FLNPqk6R8mImqvWP6h5WjKZbMtlUIGnjFqW5cml2o9AaVFqP2pQaYru2zytrW1tvhoqhGHYflVZlkXKX42iPEd//lp/63cfb9y4Ji1N/Q0q1kTNMaiEi6pGUU4d1VvrD16Davmy5evDRKi4UOo4nIhd0l0IlARlt5JzNU975G8PrQ4yqGy9NJ1J5YxQj+uGMbrMWxLoBZSUqHmap4GneRoOTNvT1dm5xc+g4sE3TxPdqGsTpZeo4Qwq4LtRhzGomKtKhFJrE+U7+kMaVNg8jTeoeD01fexndKUWodQaRLl11HzN05xu1HJg8zRwo1T2lUpph2ipVKSEexAoAUpO1OxMqgyDKqt5GnajBqtrin/zNK9BRSlVDVFCXXMou9Xv042awe1Gnejq/Dh9/Gcu2a8btSRJIkGlxlAuh39BzdO2bt26tpBu1AAgSlNqDOWVqMHN06DwbtTplD8hUWsPlZAW5zZPc5DVjXrBO++sy9WNGtwoFZOq5hdFN+raQlmIWmg36vvv+9O6XN2ovQYVjvehlAqDqoZQEYnGxXSj5hFQmiKO/xpCOR3+BRlUra2tawnXjZo3qPy6UYumFLWF8kvUkN2oV61ctbqQbtSGYYgIVQ2hUmqM/Awq4LtRz33lldWFdKM2TXOE6EZdOygbUcMYVPxvnW7USdGNuj5RfolaWDfqlQU2TzuqfBsT6EmU2+Hf492ouTp/vEQ36hpBZeioIbtRv7dw0cpCSlN03fiymOtfG6ikhg15u1E/MePx1eBIUa/jHzIMqnQmlSzLwk1VAygrUQvtRr1owYJdONdflpUsx3/a4s/UUymlQk+tAVSGRC3AoNr0+ef/CeP4Z8e/GENZG6gEh39287Qc3ajDOv4ZWXVdP6ZMOxPoQVRaU7G8zdOenz3730hSJKcsy749qWxparAEFWzyO7aMexLoAVRk9ztPrX9GJtXfH39ic64mv34Z/6qqHlfWDQl0G2Unap5af189deuWLSu9JdR5Mv6FQVXlqBQ/ao5MqmzH//p16//jzfj3llAzf6phWFOojxe9U6sblfXwcmRS8Y7/l+fMWWHrqFJgggrTU5GwqKcCwCFl2pVAD6ASpUxex/89d/9+fb5x6eCoAHZLSksNmFKuDQl0HxVB1AKa/LqSdcvmzR+g1e+npzLHv0dPnVr6nQn0FCpHoubpSeXN+C9CTz1G6KnVi8p7cCEz/gvRU5k/Veip1YtKlTBuxj+vp/IZ//n0VK8/1Yn7H1+uDQl0DxVD1KCMfwhIUIEC9FSujuprpdqPQM+i8iRqZoKK7kz38w6jsPTV1atWLw/SU4GbRZUmqjlF5KdWJyrNj5qZoOLRU9Gg4vXUZ2fNWo46qn35x/29+amKoogoVRWikq3gvHoqFvxlzqLK1lO9+amEkJPKtyWBYlFRRC1GT930+efLWdw/KD/VU0d1Sml2I9CTqEyJmkNPdfyprp763sJF72PGP3NTpaeo2GS126YzHVVHg2qUaZrDyrxDgQJRiX7UnHqqN+5//31/Wg4+HanBk/GPTn/71bL+TyjT7gSKRKVHavLG/bGOaveunevSx7/sW+/PSOpMThHHf5Wh4oiaJ+6v+8X9N27cuCRXvb9f2p8YSFFdqFyJWkCnv9fnvbbEr94/VzhVkmVRS1VFqEyiFqin3v3bu1ZhONUmq3841cdN9fXybVCgUFRDNlGGnupXR4WNfjd9/vmSXOFU/uh3rtPKvTGB8KhIohZTR7Vs6bIlzE3FXFXe4z8dUkU91RghqlOrB5UrUbn8VJ96f+8oSjz+F0GAm4qBqQDM+pck6Rtl259AQaj8o58wB39GvT/lCQuOm2r79m2rvG6q9ECK7GwqQog4/qsEVZTxHtjo1z3+165evTDdlyrT+s+c6+9GqSaKKFV1oGKJ6uqp+cOpwIj6xIzHF/hlUzGwbCrbmLLS/vA33y7D9gQKRGVL1ALdVJhN1dXZuYXv9oev4HFTseMfpappmmeUcYcCIVFNxW553VSIlpaPFvHZVHYAQAo8/k3TnCyO/8pHRRO1GDfVc7NmzWfd/rwZ/+Bz/Ou6IYvjv/JBKn2FUSIRoCABARkoRHSgMRkgCgAN9kViBADLS1QAUJDPrbt2PAwAA5PJJOCl67p1OSPSLf1VVVWIRCIQi8UgHo+/rSjK0RWwXYEAVFudu+WmghxZ/2DX/L/DolRMR811/BuGcVQqldq/THsSCIGqa8iAx78BluXvZFNRzXv8v/ryy//ij3/W9Jch+/jXkcg/KOO2BPKg4o9+RBQk2f0jgITHvwIkToHi8R8DIA3E/h1//D9ECBmUSCTc4x+J6czzt45/RVEgGo1aVzweb1FVtbnMWxUIQHVIVM5N5Y1SOce/6XP8v+u1/nnnPytRsY9+3Yr9izbqlYsq7cVkRak0nOHPJVNnHP8zHnlkHkpM3vnPOwDSGf+sPMVyVYnjv0JRFUc/eI5/k4BiUhrhjv9GABL1Hv+btrX9UVXV/fH4T6VSoGmaWzuFQBLb1r99/Dc0NOySJOkLsizvLOtmBbJQPRI1M0qle45/ze/4/2D58jcxSqUo/n5VlvnP3FeapvclhFxang0K5EIVt2H0Hv/Z1v9dv/7N64oiG36Z/5Ax6JfVUlkS93JD15UybkzAB1VDVG+SigJEz5ej+vKcl9q3bN68OO1TlX0aqfG1VJZUHUEBzirvbgW8qC6JGmD9o1QNsv5fffmVV9jxz3yqfD9VPpla122pCgA/Ksv+BAJR1R2Y8zj/rRTA6TfetFjTUm12mYriK1V5NxVeqZQ2Udf175V7fwJpVBVRs3JUnRIVSqnGsqm4lj8IEwv/Vixb9oqiqIFGFatORamqaXj8p/D3t4sWlZWD6pOoPsd/jtQ/6703Xn/Di6geMKnKVwEAp6vajn/7SiQSw1VV/V15NyvAUPXDF9zUP/9GataF9VTr162dl0uqpj0AhuOqSkEymbrMNM1pZd2ggIWqI6p1/LMK1XTmP1/4pzuDKXTeqLrzf297Bl1V+aSqbVDprgqg6/pfRWJ1+VEL42ws0jrHP0pVzc+owmG/H/77wzmqGnGlqley8oYVRrHwSqVS/U3TnCl6VZUX1U3UTJ+q7mdU8brqJRdc+JhpGjtsFUB1JKvskarMsLIlKl7oBaAAfy7zbusaVUlU9/iHvEYVr6vCBytW7Hlt7rwZTFfFpBVvF8C0YWWrAagCpFIJ/Pl80zSvLu/O6xdVk5TihadERfEkqsRYmYqdrwoKAYiw/5gtn3/6m379+o1KpexSFTziUS9lFargVATYKoJilazgFY3GNFVVTpVleW4F3Yq6QNUe/T5GlZWoogPVAqSq61+98Sc//Y2iKF1BKgAAXwGQ1lc1LaUahvGU6FlVetTUbFDHVcWaVKTQqHJG/mR4ANCw+sfzL9yPJMU0PztvVcmosUqHVg3Hv2oZVpZxJUnSc6ZpDi7nXusNVXv0M7h5qo4KoIMZxdxUhZAGSinmp8bxZ1QBiJ2nqrD/oP9Zt+b6IUP3m5JMdqHB5LijjIycVUZelruKeatO/upCwzCmRqPRrrLfhDpA9UtUkpaUwElVSmkSLGlqu6wcqZphXH3n9DP+mEx0fWy7rBRgFQG8y4qb+mfpsUho1G3RE6Cq6hMiJbA0qHqi+uuqoHO5qkwFSDnuKtavyvIC3Hj9z26TJCmJxhKvr/qRlQ8GoCcgmUx9k0jSveXcf72gtubXZ/hVqYZ+VScIwDKrUsSur3INK+xXNevpmXcjUfFox8vPuEpLVt0JBGiAKgOGWTVNu7mMu64LVL2OypDPXUWAxCi+DSBObXdVhr769qIF548ZO+6stL5qX4yg4ExasXNaZWCGmO26iqLKcFUkEhHStZdQe0QF3rCi6DuNcIZVzGkBFKEAEZImqvW5dR9/dOvAQYMneI2rfGRFAysWixmKopwpSdLs8t6J2kTNHP0Z0SqPCqBTmnBUAF5f1T25q3Di1K/e0bF71zqUkJGIyhlX/m4rdFk5+QCYFiinUtqTYipg76C2dFTIzlflvQCEEPQEJD36qusF2LB+ffKSC3/wS8Mw2tATYF+qRVZUV705AczHykqxMSCg6zr6WCeX9ybUHmqKqBltKjkvgERIykCCOoEA5rLCy5GqrmTFgsD/vvXnv2SeACSrnyeAkdVuFaQ7ySvWFdd1fY6IXvUsak6iZqkAnMtKB5okQBIUaAKAprioVQZZ77n79+ufeGzGnbzBZLuussmKcQG7hEXjydpfUZRXE4nEqPLejdpBzRhTXmQYV25zNVN1olYxH+MqyxPw6N+fmPrNad+6ju+04tT+ZyWw8NErlMJO47VPdF3H6NX6CrktVYvaJipYUtV1WVlkJTQqU4gRQqJciFUN8gS8+sZrZ06YNPn7djTKlphOT1VfsrL0QUHWnkXNEhUCXFbMv4pdqz1kxdcIpCWrS9Yl/15xRfPIA07mfaxOB0B3iAX4kBWJ6hC2xTTNEwRZi0dNExXCkzVuqwdZZHXj+CyBBUOn3oBAWLJSSqdGIpGN5bsb1Yvac095EGRcOZ4ALZ0SiG4r8HVbIY6aOPmu9rbWRZFIDFRVccOtfHUA+OQFsMBBMpkcQQh5QxQKFoeaJyrk9gSkmCfAISgjK7tcTwA2ssCAwI4d21dhQADJyjKu+IAAeMjq1FyBM/hihGmacwVZC0ddENWFJyVQAWJFqnzcVkk/HysGBL5x0ik/39PR4UavWOJ1LrKykhf0HnR2do5CshqGMaRMd6EqUfM6Ko9AT0CBbqsJkyb1fX7OP26PRKNfcHJTubqrdF4AOLkBeNk6q+qoDJbuujoSiU6VZXlT2W9MFaCuJKpf5AqFnwIS9gJIOjkBKE1RsiaorQ5kBQSw88oF5553i5ZKbcmUrHJWXgAjry1ZU44KYOUGHNjZ2fWmkKzhUFcSlcHPE8B8rEBBdbKt1HyS9aRTTh748IzH7lQjkX3SkjVdzoIkZWBGF5spwKJd0WhsTWNjw1clSfq03PelklGXRIVcbiugqicgEAlDVkVV92GGE5LWzgGwO1kj8NUOv6ZHB6EERomsKMrGpqamY4TrKhj1ZUxxCHRbAdEwgYXLtkrlUgMwieXySy69yTRNK+OKqQH85EBK7a/h0wNRBUBSJxIYREju39HRMV9MDwxG3RIV8vtYvWTVgsg6a+YzW6764eU3IFlZrwC82HGPUtT6CmpLWKy5ssuvGVmT0NXVZZE1mUyOLO9dqUzU7dHPo8BQqxqkBpz9ve/ue8+f7rsdAAbZEjPldmKxc1fTIVfmDUDJy4YI24GESGv//v2nxGKxVRVyeyoCdS1RGQqQrF25JCs2trjmyqtuBIA2FhBgryxFENwuLLprcNnJLrY3IJVKDt6xY8c/RT5rJgRRHfQUWWc88ugmJKskye1efZXNDkAVwHZdae5lR68S0NWVQNfV4O3bt78myJqGIKoXPUTW66+9brosK46BFXGPeGb5M6RdWZqru6K60NXVaZE1kUhMqJRbU04IHdWDjOgVdE9nvfDii4bf/us7/5+m6/ugtMSjnU26RkLaUax0DAJJjJLXrtVSLNdVPB7vVFX1tEGDBr1e/rtTPgiJ6oEbvSpOspre5hZXX3HlzYZhtDLysWJByR3tCu5ANpvA6UQWNMISia4GTdNeaG9vP638d6d8EET1QYFkTXJkTfkZWD++8qobKKWtrBsLq7/ia7AwndWuvzLcwWy2kWWTVdf1WTt37vxOJd2nUkIQNQAFkLXLQ1ZfP+tlP7joJxKR1tmdVWxXVHrghV2OzVxXtnQ1vIaWkkgkHtM07cJKu1elgNBR8yBIZ3W6sCg+VQKBOuuUY4/Z6+HHZ9xMKR2FKX/Mx4pHPV+D9d5778Hq1avhwAMPhClTjmbdriEatV/79+9fd+2DBFFDoACy5jWwMEXwb48+/KtYPN7sJFO7ZEWibtiwAe691+YgqgQTJ06Ac889zyFrlLUPgn79+k1XVfV/Kveu9SzE0R8CQWqAnXhttbgM7brCFMELz/v+9ERX1wZUAdJdBO2xQlu2bHEXhNJ14cJF8MADD1j6ajo4kIKOjt2/6uzsvAfHCmEbIVQJatmVJSRqAehJ19XYceMaH3/6qVsaGuNj0G3FLP0dO3bAXXfdBe3t7e7CUH8dM2YsXHbZZZY0taVqFBoaGqGpqamDENLE3kspfV/TtLNrreJVELVA9CRZm0eOjD4358VfNDY1jklPZ9Fg8+YtcM8992SRtbl5JFxzzTXQp08fi7D77rtvRvkLh1ZK6TclSXq3Qm9jwRBHf4Hopp81qwbrmCO/Mn1be/tCJJ7dQVCFIUOGwLXXXgsDBw50mrPZa2xpaYG7774b665g0KBBQSRF4CCM+bU0yl0QtQgUQdbAfFanuvW29ra2N+PxOMTjMUtv3XvvwXDDDT+zpKjtvrIf1caNGy01Ad+TC4QQVZblGaZp3lYltzUnxNHfDRSoBuSsFEAsWLL4sv2G7XdaunWQAbt374I//OEeS5oiLr/8cvjOdwrz+1NKn9M07bvVPMFFELWb6Gmyzp3/xsWjDzroW6xBMJIVj/r77rvP8qv+6Ec/KmrBaGQBwLRqrc0SRO0BFEDWvAWDiBdffWXaYUccdhFLYEHSYrh1yJChVm5rsTBNc7Omad+MxWKLqu0eC6L2EIokq8J1EGQMtD7/9LOzTz5m6rFXoFRFfyoaVjmMp0LQRSk9p9pmDQhjqodQgIGlcX0DksTue8XaBwEzss781rSXXnj2uTvQZ7rXXnv1FEkRcULILF3Xf1GmW1UUhFR/5aEAAAyPSURBVETtYeSUrEBVp28A35EF/axRj2R1WYmTWoYNH94rESfDMJ4wDOOiajCyhETtYaBkzVWKDQQ0T0cWzZGsWa4rxMBBgw7qjXVi0jYh5LuyLL9RDd1aBFF7CUFkVShJBpCVT752W17GMFbag/DpjTURABZWen2WIGovwo+sVq8rh6zcCEx3ZLtXora1tvZI9xRG0ABdd7iqqu+Ypjmt3PcsCIKovYwgsvIdWRxyJp0p2CY/qG3mU0/P6M4KeQmKJOWlKf97wzCaDMOYZZrmTyvxPgpjqkTIOQITSJQCbWBuK3wlTot25NfjTz91/LRvn34FhkULWS2ToF5yst8FgVL6CAG4RI1EUpVy/4RELRH8JKs7BRuomZ6CDYZXqn7vzLPm/fr2O27RdX1X2NUyIgZJ0KDPODMJzgdC5pimObhS7p+QqCVGwBTsGCdVG9FlZUtXK3KFktVtGfTHB+6/tbGx8Qu5Vh0kSQuVrLIsr9J1fVoltBcSRC0DPGSNYMdrGUhDuvaKxIN8q5hw/fxLL944ZOjQ8X4rD0vGXATlew1QanZEo9HTZVmeW857JohaBuSRqihJG3LlAwwYOFCZN/+Nyw46+OCT+dV3h6Q8Ob1AtUSSyLXlLCgURC0DfAyrCDdHIFS3a8Rzc178+oknfe0iNLLCELIQgrK5WZ6/vTcaifxYVhTd55e9CmFMlQEZhpUN77h2LV8DYcQ3Tzn1H/f+/g+/TKVSWSHQfCRFgnpJyvoK2Jfpc9Erd+7a/ZJhGP1KfdeERC0TCujJmpHDisLFOwKT9bjq07fvPhCSpDyY9GSdsYEjrT/ImkhEPaVvLL6hI5lQiSRNJoSg0bdIluWdvXFHBVHLhCLSAq3kFQBQKYDsJSv2C3hy1sxbBw8enDF6nSdpPoLy781NVEtvbY/H479TFOVqp0YL348nwW+pad7S0+qBIGoZEZKsqiNZsQsLSi2Vm9cqeY2sV9947ZpRo0cfCwWQlL2PJycjbxBZsQ9BY2Oj7++w9IVS+v2elK6CqGVGAWmBjKDWcGEn6TqwQuDoY6ZcxH7210VNj06a/jse/Kh3NvMVuxH26dM3Z46sYRirTNM8qacmvQhjqszIlXBtJa+wQW3OvFanIVsyl5F16olfm/3gA3/+hWEYSe/uvCS1o1F220tGSHvskOk2GebyAaz3NDY25U3klmV5lKqq75mmObkn7rCQqBWCIMnKjcBU0c8KBNQczS0kfnT7VddcPXL6z2+9KRqLW0YWT9L0+HYzg6C8hAWPgYUl2/37989bqu1Bl2EYFyuK8nh37rQgaoUhcKogUHxFvVX1eARyGlmsg2D//nuNCiKpl6A8OYFTHfr338vqO+AHrO1iw4v9QCm9XZKkG4u924KoFYgAskKARyC0kTWiufnYIJLaf58mKP49cFIY2wj169ff92Zhpey8efMsSTtx4sRcRtZMTdPOL6b0ReioFYisTCvUS/lCQQIJndJO1omFOHorBHS9xm4sh48b/5u35s9/Mh9JmW6KOiuOGMLXWCweSFJw8lyRnNh/4K233oK2tjbf9xFCzlBV9Z/FlL4IiVrByO2+MmUr5ApEdfIDIvkaCSPuuuf3U88466yrZVlWvCRlBGVA4wkHXuRoxuYCperSpUvdtpljx46F/ff3n5iJ/QUkSTqFELI07N0XRK1whDWyHLIq+ToIgmNkXX3dtT+PRCID/EhqW/e2pNxvv/1CN71A0mOn7PXr7Y6Xzc0jYNSo0UEkL6i/gCBqlSDYyLLJ6mNkxRySBhpZ9/35gV809Wlq9iMpStuhQ/eDYmoLP/30E1i2bLn158GDB8Fhhx0eSHZd10N1zhZErSL0tJGF/VkffOShq4cNHzYFHJIyvXWfffaxDKhisW3bNmsWAbYjampqggkTJkBDQ4Pvv4b9BahpXpCr9EUQtcqQRVaw1AI37IpEZJEsAiRGMbqVJ5L17IsvnDfqoNHfsTOqTKszC7YQ6i7QuFq0aBF0dHRY7d+POOIIGDBggO+/ahjGQkmSTpMkqdXv94KoVYhQYdcijKzjTzzxOpSi2Ei4p4BG1uLF70Nrq+0JGD/+EBg2bLjvv26a5ie6rk/1a+suiFqlKNDICkXWB/764Knnfv/8y3uwz5UFlNKrVq2EDRvsHq8jR460Wmj6fQ/mCFDTPMSrBgiiVjHCkNVjZAV6BDAosHZjyx/8CgfzRZ3CArtlf/DBB9a7UQc+9NBDfY0s0zRP9NZoCYd/FSOoz5XVjQUkKwAQYnar9dlf3fa/h/mRFI/u119/Hd58803Ys2dPt24W+lUnTZpkkRP9re+++65veYxhGAd6/04QtQbgS1ZnDlaO2a06ASvqZZF1v2HDfGv4w0adwgKHZBx99NGWBwCJ70dURVE+y1pHPT/gWoJLVryQrFy6oDO0TQMKTi2WG141mFRds3r15363A4k6efJk66hG6bpgwQLrCO8OkPjHHnssHHfccVlHPxpUhq6/6P3n5W59o0BFAdmpYHYzOrBs+wPJi3XZGN0nJgCRCVGc3+Fca1aDRRa///62H17xX0dGIpGswj0kK3oCUPpt374dtm7das3DGjhwkJtMXSjwc9ju3YOuVCqFtVifGJCZwC2IWmPIIitxolGEEAqAg4CkdN6q9WeMWsldXV20devWD447/vjDVFXN8vTjPzl48GBoaIhbA9u2b98BO3ZsD5UHEBaGYVzQJxKbi2sXRK0DGM7Zr1iz1W35SawznloVrISgu8BqGyQ5gQB8lZctWbr73Xf+9fZJp5w8rrGx0dcz37dvP0vP3Lx5M+ze3WG97r333pZDvzswDOO/G5XIg9byfYgq3FM1jMCOLHaTi7jjroo63QMzXFVvL3z32uaRI6cE3Z1Cok75gCHURiVyKRBIObq16ZboOBDGVA3Dfdh2TitI1DacnLJmq3OgnSrguqosYP7qQQd86c5/vfVWYG9WtNqPOuooK+kE4/nvvPOOlYxSKDB0et45517H13z5QRz9NQ7FNnaIc3YSPP4pEIk3qlBXdRJWCHfBI3976N8jmps/OXjMmCMkScryzKNuOnToUCvBGnVW1F0xbRAlaxgjC/NSH/zLg2fdeccd7RIQw3GxUaGj1iEUmzGBRhWxX63ZwM7dySDr888++/HuXbsWHzXl6MmqqmYVTNlG1t7WaHb0BmDW1K5duyx3Vh4jq+uZp2eedeGFF6xVwGphRAVR6xguUR1XFTOqHFeVRIE6vyfAyIrpqJw8JIsWLNy+fNmy+V875eQvx+Nx35oUrE5FSWobWbuhtbUVhg8fHihZFy1ceOnJJ530NgYkCDhBCkdF8SOq0FHrAZkN2UABSXP7BaSjVVhrhf0CrJkC3rqrl+e81P6VIyZe+1FLy7tBdyxM1Anx6Sef3H7kpMkvY4TMCkhkkjTLkAJh9dcHAhuyeTqxhM1ffXvRgvMPP+KIs4JuHhIUo1h+9f+apj0Sj0R/hlNh7AYbVjRNZ9Y+8EYgByFR6wA5Z15xnVgo0ESYTixHTZj0yNNPPvVbx3uQBdRN/Uja0bFn+YnHfRVHW9rD4XiSOvAjKQgdtX7gF1oF26hyOqEClcHxENhw9Vaa/kvXyJo985mPTMNYPnHypCNV7JiWB7qut/z85uln//3JJ9tQLw175DMIotYJMqJV/mRFkUkl9KtajgFwLsLiW1lG1tv/fKtt7erVb331hOMPjcXjgc19KaUds5+Zde51112HmfuabI/aDE1SEDpqfSKoSNCZe6X49Wb1FAlmVLRikeCrb7z2M7/hwqivvv/eexceOWnyHDSerDzZAkkKgqj1i3xFgnxvVgIEKwKs/lYeI4uR1Yp4vb1owcWHHX74NDa4DediLVm8+GrHwk/a3oZwxpMXgqh1jCJ7s6rO7CuZcqqjk4RtTDn2mOill19uVe+de/bZ87H1UHdJCoKoAkV0Yok4YzDZLAHn45ZnAP2zVnI2+mexqgD7ZKGFX6jx5IUwpuocQcnWAUYWpI0sy9AynD/jBBeHqIAlLymLpABJiXSfpCCIKgD5PQKGyVn8jkeAFQUa9uxWnOlqlbigJNU5khbshgqCIKqAC1+yEmtkOwVCqEkAKYb+VoqERVI6ZNVxNhYBktLtYIHWkyQFoaMK+CHDIwC+eqvsuLFcQWc4hAWgBg5360mSgiCqQBByGFmsKZuU6f9H68oiqJkVGi3QwveDIKpAIHzJav/MJ1EzyctNpehZkoIgqkAY+KoCQeASTHqKpCCIKhAWWdI1H3qQpCCIKlAoXMLmQE+R0wUA/H98VNLKA/FsyQAAAABJRU5ErkJggg==);
		position: absolute;
		left: 140rpx;
		right: 0;
		top: -185rpx;
		margin: auto;
		background-size: cover;
	}
	.detail-play-icon {
		width: 580rpx;
		height: 60rpx;
		position: absolute;
		left: 0;
		bottom: -90rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: white;
	}
	.detail-play-icon text {
		font-size: 50rpx;
	}
	.detail-lyric {
		font-size: 32rpx;
		line-height: 82rpx;
		height: 470rpx;
		text-align: center;
		overflow: hidden;
		color: #6F6E73;
		padding-top: 330rpx;
	}
	.detail-lyric-wrap {
		transition: 0.5s;
		
	}
	.detail-lyric-item {
		height: 82rpx;
	}
	.detail-lyric-item.active {
		color: white;
	}
	.detail-like {
		margin: 0 30rpx;
	}
	.detail-like-head {
		color: white;
		margin: 50rpx 0;
		font-size: 36rpx;
	}
	.detail-like-item {
		display: flex;
		align-items: center;
		margin-bottom: 28rpx;
	}
	.detail-like-img {
		width: 82rpx;
		height: 82rpx;
		border-radius: 20rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}
	.detail-like-img image {
		width: 100%;
		height: 100%;
	}
	.detail-like-song {
		flex: 1;
		color: #C6C2BF;
	}
	.detail-like-song view:nth-child(1) {
		font-size: 28rpx;
		color: white;
		margin-bottom: 12rpx;
	}
	.detail-like-song view:nth-child(2) {
		font-size: 22rpx;
	}
	.detail-like-song image {
		width: 26rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}
	.detail-like-item text {
		font-size: 50rpx;
		color: #C6C2BF;
	}
	
	.detail-comment {
		margin: 0 30rpx;
	}
	.detail-comment-head {
		color: white;
		margin: 50rpx 0;
		font-size: 36rpx;
	}
	.detail-comment-item {
		margin-bottom: 28rpx;
		display: flex;
	}
	.detail-comment-img {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 18rpx;
	}
	.detail-comment-img image {
		width: 100%;
		height: 100%;
	}
	.detail-comment-content {
		flex: 1;
		color: #CBCACF;
	}
	.detail-comment-title {
		display: flex;
		justify-content: space-between;
	}
	.detail-comment-name {}
	.detail-comment-name view:nth-child(1) {
		font-size: 26rpx;
	}
	.detail-comment-name view:nth-child(2) {
		font-size: 20rpx;
	}
	.detail-comment-like {
		font-size: 28rpx;
	}
	.detail-comment-text {
		font-size: 28rpx;
		line-height: 40rpx;
		color: white;
		margin-top: 20rpx;
		border-bottom: 1px solid #E0E0E0;
		padding-bottom: 40rpx;
	}
	.detail-kong {
		position: fixed;
		left: 0;
		bottom: 0;
		height: 280rpx;
		width: 100%;
	}
	.detail-top {
		width: 700rpx;
		height: 30rpx;
		margin: 20rpx auto 0;
	}
	.detail-top-top {
		height: 20rpx;
		line-height: 20rpx;
		display: flex;
		font-size: 16rpx;
		color: #838e9e;
	}
	.detail-top-title {
		width: 555rpx;
		margin: 0 16rpx;
		overflow: hidden;
		position: relative;
	}
	.detail-top-title view:nth-child(1) {
		height: 10rpx;
		border-bottom: 1rpx solid #7e7077;
	}
	.detail-top-title view:nth-child(2) {
		position: absolute;
		top: 0rpx;
		left: -540rpx;
		height: 10rpx;
		width: 555rpx;
		border-bottom: 1rpx solid #FFFFFF;
	}
	.detail-top-title view:nth-child(3) {
		position: absolute;
		top: 1rpx;
		left: 0rpx;
		width: 18rpx;
		height: 18rpx;
		background-color: #fefefe;
		border-radius: 50%;
	}
	.detail-bottom {
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		margin-top: 30rpx;
		display: flex;
		justify-content: space-around;
	}
	.detail-kong text {
		width: 50rpx;
		height: 50rpx;
		font-size: 50rpx;
		color: white;
	}
	.detail-kong text:nth-child(3) {
		width: 120rpx;
		height: 120rpx;
		font-size: 120rpx;
		color: white;
	}
	.detail {
		position: relative;
	}
	.bf-sx {
		width: 700rpx;
		height: 800rpx;
		border-radius: 40rpx 40rpx 0 0;
		position: absolute;
		left: 25rpx;
		bottom: 0rpx;
		background-color: #282828;
	}
	.bf-sx-icon {
		width: 100%;
		text-align: right;
		margin-top: 20rpx;
	}
	.bf-sx-icon text {
		font-size: 40rpx;
		color: white;
		margin-right: 20rpx;
	}
	.bf-sx-title {
		width: 100%;
		display: flex;
		font-size: 30rpx;
		color: #727272;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
	}
	.bf-sx-title view {
		font-size: 38rpx;
		margin: 0 10rpx 0 38rpx;
		color: white;
	}
	.bf-sx-title text {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		font-size: 40rpx;
		color: white;
		margin-right: 30rpx;
	}
	.bf-sx-list {
		width: 100%;
		margin-top: 20rpx;
	}
	.bf-sx-listdata {
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
	}
	.bf-sx-listdata view:nth-child(1) {
		font-size: 30rpx;
		margin: 0 10rpx 0 38rpx;
		color: white;
	}
	.bf-sx-listdata view:nth-child(2) {
		flex: 1;
		font-size: 22rpx;
		color: #727272;
	}
	.bf-sx-listdata text {
		font-size: 40rpx;
		color: white;
		margin-right: 30rpx;
	}
</style>
