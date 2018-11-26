<template>
    <div class="response">
        <div align="center" v-show="loadOn"><img :src="loadurl" alt="" class="img"><i>{{loadText}}</i></div>
        <div class="list" v-for="(item, i) in listArr" :key="i">
            <div class="response-title" @click="showRes(i)">
                <span>{{listTitle[i]}}</span>
                <img :src="bgurl" @click.stop="deleteHandle(i)">
            </div>
            <div class="response-content" v-show="listShow[i]">
                <div class="address">
                   <span>请求地址：</span> 
                   <article>{{listUrl[i]}}</article>
                </div>
                <div class="result">
                    <span>返回结果：</span> 
                    <article v-html="item"></article>                                   
                </div>
                <div class="prompt">
                    <span>提示：</span> 
                    <article>{{listMsg[i]}}<span class="right">{{listTime[i]}}</span></article>                   
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    name: 'Response',
    data (){
        return {
            bgurl: require("@/assets/delete.png"),
            loadurl: require("@/assets/loading.gif"),
            listArr: [],
            listShow: [],
            listUrl: [],
            listMsg: [],
            listTitle: [],
            listTime: []
        }
    },
    watch: {
        time() {
            this.listArr.unshift(this.responseStr)
            this.listUrl.unshift(this.requestHttpUrl)
            this.listMsg.unshift(this.requestMsg)
            this.listTitle.unshift(this.requestTitle)
            this.listTime.unshift(this.time)
            this.listShow=[true,false,false]
            if(this.listArr.length>this.responseNum){
                this.listArr.pop()
                this.listUrl.pop()
                this.listMsg.pop()
                this.listTitle.pop()
                this.listTime.pop()
            }
        },
        errorInfo(val){
            console.log('错误',val)
        }
    },
    computed: {
        ...mapState([
            'responseStr','baseURl','requestHttpUrl','requestMsg','requestTitle','time','responseNum','loadOn','errorInfo','loadText'
        ])
    },
    methods:{
        deleteHandle(i){
            this.listArr.splice(i,1)
        },
        showRes(i){
            this.listShow.splice(i,1,!this.listShow[i])           
        }        
    }
}
</script>
