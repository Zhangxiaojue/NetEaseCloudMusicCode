<template>
	<view class="pinlun">
		<view class="fixbg" style="background-color: #151515;"></view>
		<musichead :title='name' icon="true" color="white"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 评论区 -->
				<view class="detail-comment">
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
				name: '评论区',
				songComment: []
			}
		},
		components: {
			musichead
		},
		onLoad (e) {
			console.log(e.id)
			this.getComment(e.id)
		},
		methods: {
			// 评论接口
			async getComment (id) {
				const res = await myRequest({ url: `/comment/music?id=${id}` })
				this.songComment = res.data.hotComments;
			}
		}
	}
</script>

<style scoped>
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
		border-bottom: 1px solid #2c2c2c;
		padding-bottom: 40rpx;
	}
</style>
