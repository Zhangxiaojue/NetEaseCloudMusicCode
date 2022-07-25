<template>
	<view class="list">
		<view class="fixbg" :style="{ 'background-image' : `url('${playlist.coverImgUrl}')`}"></view>
		<musichead title="歌单" :icon="true" color="white"></musichead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<!-- 左侧图片 -->
					<view class="list-head-img">
						<image v-if="playlist.coverImgUrl !== ' ' " :src="playlist.coverImgUrl" mode=""></image>
						<text class="iconfont icon-xiangyousanjiaoxing">{{ playlist.playCount }}</text>
					</view>
					<!-- 右侧文字 -->
					<view class="list-head-text">
						<view>{{ playlist.name }}</view>
						<view>
							<image v-if="playlist.creator.avatarUrl !== ' ' " src="http://p1.music.126.net/imDGOWcpQvcO8fat7U9aUQ==/109951165806223960.jpg" mode=""></image>原创君
						</view>
						<view>{{ playlist.description }}</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="list-share" open-type="share">
					<text class="iconfont icon-fenxiang"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<!-- 播放列表 -->
				<view class="list-music">
					<!-- 头部 -->
					<view class="list-music-head">
						<text class="iconfont icon-bofang"></text>
						<text>播放全部</text>
						<text>(共{{ playlist.trackCount }}首)</text>
					</view>
					<!-- 列表 -->
					<view class="list-music-item" v-for="(item,index) in playlist.tracks" :key="index" @tap="handleToDetail(item.id)">
						<view class="list-music-top">{{ index + 1 }}</view>
						<view class="list-music-song">
							<view>{{ item.name }}</view>
							<view>
								<image v-if="privileges[index].flag > 60 && privileges[index].flag < 70" src="/static/vip.png" mode=""></image>
								<image v-if="privileges[index].maxbr === 999000" src="/static/sq.png" mode=""></image>
								{{ item.ar[0].name }} - {{ item.al.name }}
							</view>
						</view>
						<text class="iconfont icon-24gl-playCircle"></text>
					</view>
				</view>
			</scroll-view>
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
				playlist: {
					coverImgUrl: ' ',
					creator: {
						avatarUrl: ' '
					},
					trackCount: ' '
				},
				privileges: [],
				isLoading: true
			}
		},
		// 监听传过来的参数
		onLoad (e) {
			// console.log(e.id)
			uni.showLoading ({
				title: '玩命加载中...',
				icon: 'loading',
				mask: true
			})
			this.isLoading = true
			
			this.getList(e.id)
		},
		methods: {
			handleToDetail(value) {
				// console.log(value)
				uni.navigateTo({
					url: `/pages/detail/detail?id=${value}`
				})
			},
			async getList (id) {
				const res = await myRequest({url:`/playlist/detail?id=${id}`})
				this.playlist = res.data.playlist;
				this.privileges = res.data.privileges;
				// this.$store.commit('INIT_TOPLISTIDS', res.data.playlist.trackIds)
				// console.log(res.data.privileges)
				// 数据加载出阿来之后隐藏
				this.isLoading = false;
				uni.hideLoading()
			}
		},
		watch: {
			'playlist.playCount'(value) {
				if (value >= 10000 && value <= 100000000) {
					value /= 1000;
					this.playlist.playCount = value.toFixed(1) + '万'
					// return value.toFixed(1) + '万'
				} else if(value > 100000000) {
					value /= 100000000;
					this.playlist.playCount = value.toFixed(1) + '亿'
					// return value.toFixed(1) + '亿'
				} else {
					this.playlist.playCount = value
					// return value
				}
			}
		}
	}
</script>

<style scoped>
	.list-head {
		display: flex;
		margin: 30rpx;
	}
	.list-head-img {
		width: 264rpx;
		height: 264rpx;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		margin-right: 42rpx;
	}
	.list-head image {
		width: 100%;
		height: 100%;
	}
	.list-head text {
		position: absolute;
		right: 8rpx;
		top: 8rpx;
		color: white;
		font-size: 26rpx;
	}
	.list-head-text {
		flex: 1;
		color: #F0F2F7;
	}
	.list-head-text view:nth-child(1) {
		color: white;
		font-size: 34rpx;
	}
	.list-head-text view:nth-child(2) {
		display: flex;
		margin: 20rpx 0;
		font-size: 24rpx;
		align-items: center;
	}
	.list-head-text view:nth-child(2) image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}
	.list-head-text view:nth-child(3) {
		line-height: 34rpx;
		font-size: 22rpx;
	}
	.list-share {
		width: 330rpx;
		height: 74rpxc;
		margin: 0 auto;
		background-color: rgba(0, 0, 0, 0.4);
		border-radius: 37rpx;
		color: white;
		text-align: center;
		line-height: 74rpx;
		font-size: 28rpx;
	}
	.list-share text {
		margin-right: 16rpx;
	}
	
	.list-music {
		background-color: white;
		border-radius: 50rpx;
		margin-top: 40rpx;
		overflow: hidden;
	}
	.list-music-head {
		height: 50rpx;
		margin: 30rpx 0 70rpx 22rpx;
	}
	.list-music-head text:nth-child(1) {
		height: 50rpx;
		font-size: 50rpx;
	}
	.list-music-head text:nth-child(2) {
		font-size: 30rpx;
		margin: 0 10rpx 0 26rpx;
	}
	.list-music-head text:nth-child(3) {
		font-size: 26rpx;
		color: #B2B2B2;
	}
	.list-music-item {
		display: flex;
		margin: 0 32rpx 66rpx 46rpx;
		align-items: center;
		color: #959595;
	}
	.list-music-top {
		width: 58rpx;
		font-size: 30rpx;
		line-height: 30rpx;
	}
	.list-music-song {
		flex: 1;
	}
	.list-music-song view:nth-child(1) {
		font-size: 28rpx;
		color: black;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list-music-song view:nth-child(2) {
		display: flex;
		font-size: 20rpx;
		align-items: center;
	}
	.list-music-song view:nth-child(2) image {
		width: 32rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}
	.list-music-item text {
		font-size: 50rpx;
		color: #C7C7C7;
	}
</style>
