<template>
	<view class="search">
		<musichead title="歌单" :icon="true" :iconblack="true"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索框 -->
				<view class="search-search">
					<text class="iconfont icon-fangdajing"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWords" @confirm="handleToSearch(searchWords)" @input="handleToSuggest" />
					<text v-show="searchType !== 1" class="iconfont icon-guanbi" @tap="handleToClose"></text>
				</view>
				<block v-if="searchType === 1">
					<!-- 历史记录 -->
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="iconfont icon-lajitong" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<text v-for="(item,index) in searchHistory" @tap="handleToWord(item)">{{ item }}</text>
						</view>
					</view>
					<!-- 热搜榜 -->
					<view class="search-hot">
						<view class="search-hot-head">热搜榜</view>
						<view class="search-hot-item" v-for="(item,index) in searchHots" :key="index" @tap="handleToWord(item.searchWord)">
							<view class="search-hot-top">{{ index + 1 }}</view>
							<view class="search-hot-word">
								<view>{{ item.searchWord }}
									<image :src="item.iconUrl" mode="aspectFit"></image>
								</view>
								<view>{{ item.content }}</view>
							</view>
							<view class="search-hot-count">{{ item.score }}</view>
						</view>
					</view>
				</block>
				<block v-else-if="searchType === 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchlist" :key="index" @tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{ item.name }}</view>
								<view>{{ item.artists[0].name }} - {{ item.album.name }}</view>
							</view>
							<text class="iconfont icon-24gl-playCircle"></text>
						</view>
					</view>
				</block>
				<!-- 搜索提示 -->
				<block v-if="searchType === 3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索"{{ searchWords }}"</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggests" :key="index" @tap="handleToWord(item.keyword)">
							<text class="iconfont icon-fangdajing"></text>{{ item.keyword }}
						</view>
					</view>
				</block>
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
				searchHots: [],
				searchWords: '',
				searchHistory: [],
				searchType: 1,
				searchlist: [],
				searchSuggests: []
			}
		},
		// 监听传过来的参数
		onLoad () {
			this.searchHot()
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.searchHistory = res.data;
				}
			})
		},
		methods: {
			async searchHot () {
				const res = await myRequest({ url:`/search/hot/detail` })
				this.searchHots = res.data.data
			},
			// 搜索结果
			async searchWord (value) {
				const res = await myRequest({ url:`/search?keywords=${value}` })
				this.searchlist = res.data.result.songs;
				this.searchType = 2
				// 数据加载出阿来之后隐藏
				uni.hideLoading()
			},
			// 模糊搜索
			async searchSuggest (value) {
				const res = await myRequest({ url:`/search/suggest?keywords=${value}&type=mobile` })
				this.searchSuggests = res.data.result.allMatch
				this.searchType = 3
			},
			// 点击
			handleToWord (value) {
				this.searchWords = value
				this.handleToSearch(value)
				// 点击的时候显示加载中
				uni.showLoading ({
					title: '玩命加载中...',
					icon: 'loading',
					mask: true
				})
			},
			// 回车
			handleToSearch (value) {
				this.searchHistory.unshift(value)
				// 去重
				this.searchHistory = [...new Set(this.searchHistory)]
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				})
				// 点击的时候显示加载中
				uni.showLoading ({
					title: '玩命加载中...',
					icon: 'loading',
					mask: true
				})
				this.getSearchList(value)
			},
			// 删除历史记录
			handleToClear () {
				uni.clearStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = []
					}
				})
			},
			getSearchList (value) {
				this.searchWord(value)
			},
			// 点击X号关闭搜索
			handleToClose () {
				this.searchWords = '';
				this.searchType = 1
			},
			handleToDetail (valueId) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${valueId}`
				})
			},
			// 下拉提示方法
			handleToSuggest (e) {
				let value = e.detail.value
				if (!value) {
					this.searchType = 1;
					return
				}
				this.searchSuggest(value)
			}
		}
	}
</script>

<style scoped>
	.search-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 50rpx 30rpx;
		background-color: #F7F7F7;
		border-radius: 50rpx;
	}
	.search-search text {
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.search-search input {
		font-size: 28rpx;
		flex: 1;
	}
	.search-history {
		margin: 0 30rpx 50rpx 30rpx;
		font-size: 26rpx;
	}
	.search-history-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
	}
	.search-history-lisy {
		display: flex;
		flex-wrap: wrap;
	}
	.search-history-list text {
		display: inline-block;
		padding: 16rpx 28rpx;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		background-color: #F7F7F7;
	}
	.search-hot {
		margin: 0 30rpx;
		font-size: 26rpx;
	}
	.search-hot-head {
		margin-bottom: 36rpx;
	}
	.search-hot-item {
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
	}
	.search-hot-top {
		color: #fb2222;
		width: 60rpx;
		margin-left: 8rpx;
	}
	.search-hot-word {
		flex: 1;
	}
	.search-hot-word view:nth-child(1) {
		font-size: 30rpx;
		color: black;
	}
	.search-hot-word view:nth-child(2) {
		font-size: 24rpx;
		color: #878787;
	}
	.search-hot-word image {
		width: 48rpx;
		height: 22rpx;
	}
	.search-hot-count {
		color: #878787;
	}
	.search-result {
		border-top: 2rpx solid #E4E4E4;
		padding: 30rpx;
	}
	.search-result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 2rpx solid #E4E4E4;
	}
	.search-result-word {}
	.search-result-word view:nth-child(1) {
		font-size: 28rpx;
		color: #235790;
		margin-bottom: 12rpx;
	}
	.search-result-word view:nth-child(2) {
		font-size: 22rpx;
		color: #898989;
	}
	.search-result-item text {
		font-size: 50rpx;
	}
	.search-suggest {
		border-top: 2rpx solid #E4E4E4;
		padding: 30rpx;
		font-size: 26rpx;
	}
	.search-suggest-head  {
		color: #4574A5;
		margin-bottom: 74rpx;
	}
	.search-suggest-item {
		color: #5D5D5D;
		margin-bottom: 74rpx;
	}
	.search-suggest-item text {
		color: #BDBDBD;
		margin-right: 28rpx;
	}
</style>
