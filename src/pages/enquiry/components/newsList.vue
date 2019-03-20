<template>
    <div class="news">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <van-cell
                v-for="item in newsList"
                :key="item.time"
                style="background-color:#292836;"
            >
                <div class="content">
                    <p>{{item.text}}</p>
                    <p class="time flex">{{item.time}}<span>查看全文</span></p>
                </div>
            
            </van-cell>
        </van-list>
    </div>
</template>

<script>
export default {
    name: "newsList",
    props:['newsList'],
    data() {
        return {
            loading: false,
            finished: false
        };
    },
    methods: {
        onLoad() {
        // 异步更新数据
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
            this.newsList.push(this.newsList.length + 1);
            }
            // 加载状态结束
            this.loading = false;

            // 数据全部加载完成
            if (this.newsList.length >= 2) {
                this.finished = true;
            }
        }, 500);
        }
    }
}
</script>
<style lang="less" scoped>
.news{
    margin: 20px 0;
    .van-cell{
       .content{
        p{
            color: #fff;
            font-size:14px;
            margin: 4px 2px;
        }
        .time{
            font-size: 13px;
            color:#D0D0D0;
            justify-content: space-between;
        }
        
    } 
    }
    
}
</style>



