<template>
	<view class="idnex">
		<musichead title="网易云音乐" :icon="false"></musichead>
		<div class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索框 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-fangdajing"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				<!-- 内容 -->
				<view class="index-list">
					<view class="index-list-item" v-for="(item,index) in topList" :key="index" @tap="handleToList(item.id)">
						<!-- 左侧图片 -->
						<view class="index-list-img">
							<image :src="item.coverImgUrl"></image> 
							<text>{{item.updateFrequency}}</text>
						</view>
						<!-- 右侧文字 -->
						<view class="index-list-text">
							<view v-for="(item2,index2) in item.tracks" :key="index2">{{index2 + 1}}.{{item2.first}} - {{item2.second}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</div>
	</view>
</template>

<script>
	import musichead from '@/components/musichead/musichead.vue'
	import '@/common/iconfont.css'
	import { myRequest } from '@/common/http.js'
	
	export default {
		data() {
			return {
				topList: []
			}
		},
		// 等整个页面加载完触发
		onLoad() {
			this.getList()
		},
		methods: {
			handleToList (value) {
				uni.navigateTo({
					url: `/pages/list/list?id=${value}`
				})
			},
			async getList () {
				const data = await myRequest({url:"/toplist/detail"})
				this.topList = data.data.list
			},
			handleToSearch () {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.index {}
	.index-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #F7F7F7;
		border-radius: 50rpx;
	}
	.index-search text {
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.index-search input {
		font-size: 28rpx;
		flex: 1;
	}
	.index-list {
		margin: 0 30rpx;
	}
	.index-list-item {
		display: flex;
		margin-bottom: 34rpx;
	}
	.index-list-img {
		width: 212rpx;
		height: 212rpx;
		position: relative;
		border-radius: 30rpx;
		overflow: hidden;
		margin-right: 22rpx;
		background-color: pink;
	}
	.index-list-img image {
		width: 100%;
		height: 100%;
	}
	.index-list-img text {
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: white;
		font-size: 20rpx;
	}
	.index-list-text {
		font-size: 24rpx;
		line-height: 66rpx;
		width: 400rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
