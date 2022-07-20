<template>
	<view class="music-head" :style="{ color: color }">
		<view v-if="icon" class="music-head-icon" :class="{ 'music-head-iconblack' : iconblack}">
			<text class="iconfont icon-zuojiantou" @tap="handleToBack"></text> | <text class="iconfont icon-shouye-shouye" @tap="handleToHome"></text>
		</view>
		{{ title }}
	</view>
</template>

<script>
	export default {
		name:"musichead",
		data() {
			return {
				
			};
		},
		props: ['title','icon','color','iconblack'],
		methods: {
			handleToBack () {
				// 返回到上一个页面
				uni.navigateBack()
			},
			handleToHome () {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.music-head {
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		color: #000000;
		position: relative;
	}
	.music-head-icon {
		position: absolute;
		left: 8px;
		top: 26px;
		width: 90px;
		height: 30px;
		background-color: rgba(0, 0, 0, 0.4);
		color: #FFFFFF;
		line-height: 31px;
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
	}
	.music-head-iconblack {
		color: black;
		border: 1rpx solid #EAEAEA;
		background-color: white;
	}
</style>