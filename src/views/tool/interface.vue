<template>
    <div class="interface">
        <div class="type">
            <label for="interface-type">一、接口类型:</label>          
            <select name="" id="interface-type" v-model="typeName">
                <option :value="item.interfaceLists.join(',')" v-for="(item,i) in interType" :key="i">{{item.describe}}</option>
            </select>
        </div>
        <div class="list">
            <label for="interface-list">二、接口列表:</label>          
            <select name="" id="interface-list" v-model="listVal">
                <option :value="i" v-for="(item,i) in interList" :key="i" >{{item.name}}</option>
            </select>
        </div>
        <div class="header" v-if="headerOn">
            <label for="interface-header">三、请求头:</label>
            <div v-for="(item,i) in headerList" :key="i" class="row">
                <i v-if="item.validation">*</i>
                <span class="name" v-show="item.name" >{{item.name}} :</span>
                <template v-if="item.elementType.type === 'input'">
                <input type="text" v-model="headerArr[i]" @blur="blurHeader(i)">
                <span  v-show="isNullH[i]" class="is-null">该项不能为空</span>
                </template>
                <template v-else-if="item.elementType.type === 'select'">
                <select type="text" v-model="headerArr[i]">
                    <option :value="op.value" v-for="(op,i) in item.elementType.optionalValue" :key='i'>{{op.text}}</option>
                </select>
                </template>
                <template v-else-if="item.elementType.type === 'text'">
                <textarea type="text" v-model="headerArr[i]" rows="3" cols="30"></textarea>
                </template>     
                <p class="descrobe">{{item.describe}}</p>
            </div>            
        </div>
        <div class="params">
            <label for="interface-params">{{number}}、参数列表:</label>
            <div v-for="(item,i) in paramList" :key="i" class="row">
            <i v-if="item.validation">*</i>
            <span class="name">{{item.name}} :</span>
            <!-- 根据类型加载不同输入框 -->
            <template v-if="item.elementType.type === 'input'">
                <input type="text" v-model="resultArr[i]" @blur="blurParams(i)">
                <span  v-show="isNullP[i]" class="is-null">该项不能为空</span>
            </template>
            <template v-else-if="item.elementType.type === 'select'">
                <select type="text" v-model="resultArr[i]">
                    <option :value="op.value" v-for="(op,i) in item.elementType.optionalValue" :key='i'>{{op.text}}</option>
                </select>
            </template>
            <template v-else-if="item.elementType.type === 'text'">
                <textarea type="text" v-model="resultArr[i]" rows="3" cols="30" @blur="blurParams(i)"></textarea>
                <span  v-show="isNullP[i]" class="is-null">该项不能为空</span>
            </template>
            <template v-else-if="item.elementType.type === 'file'">
                <form enctype="multipart/form-data" id="uploadImg">
                    <input name="file" type="file" id="fileUp" @change="fileHandle($event,i)"> 
                </form>
            </template>
            <p class="descrobe">{{item.describe}}</p>
            </div>
        </div>            
        <div class="btnWarp">
            <div><i :class="warmShow">带*项不能为空</i></div>
            <span :class="btnClass" @click="btnHandle">检查问题</span> 

        </div>        
    </div>

</template>
<script>
import {mapState,mapMutations, mapActions} from 'vuex'
export default {
    name: 'Interface',
    data() {
        return {
            number: '四',
            typeName: null,
            listVal: null,
            resultArr: [],
            headerArr: [],
            btnClass: 'submit',
            userData: null,
            warmShow: 'hide',
            resNumber: null,
            isNullH:[],
            isNullP: []
        }
    },
    watch:{
        interType(){
            this.typeName=this.selectValue
        },
        typeName(val){
            this.getInterList(val)
        },
        interList(val){
            this.setList(0)
            this.listVal=0
            //循环显示默认值
            for( let i=0;i<val[0].interfaceParameters.length;i++){
                this.resultArr[i] =val[0].interfaceParameters[i].value
                this.isNullP[i]=false
            }
            for( let i=0;i<val[0].interfaceHeads.length;i++){
                this.headerArr[i] =val[0].interfaceHeads[i].value
                this.isNullH[i]=false
            }
            //设置提交数据包
            this.userData=val[0]
        },
        selectValue2(){
            this.listVal=0
        },
        listVal(val){
            this.setList(val)
            //循环显示默认值
            for( let i=0;i<this.interList[val].interfaceParameters.length;i++){
                this.resultArr[i] =this.interList[val].interfaceParameters[i].value
                this.isNullP[i]=false
            }
            for( let i=0;i<this.interList[val].interfaceHeads.length;i++){
                this.headerArr[i] =this.interList[val].interfaceHeads[i].value
                this.isNullH[i]=false
            }
            //设置提交数据包
            this.userData=this.interList[val]
        },
        headerOn(val){
            this.number= val? '四':'三'
        },
        fileVal(val){
            this.resultArr[this.resNumber]=val
        },
        loadOn(bool){
            this.btnClass= bool? 'noSubmit' : 'submit'
        }
    },
    computed: {
        ...mapState([
            'interType','interList','headerList','paramList','selectValue','selectValue2','headerOn','fileVal','loadOn'
        ])
    },
    methods: {
        ...mapActions([
            'getType','getInterList','submitRes','upfile'
        ]),
        ...mapMutations([
            'setList','setLoading'
        ]),
        btnHandle(){
            let This=this
            //创建提交数据包
            this.$store.commit('setTitle',this.interList[this.listVal].name)
            for( let i=0;i<this.userData.interfaceParameters.length;i++){
                      this.userData.interfaceParameters[i].value=this.resultArr[i]
                      if(this.userData.interfaceParameters[i].validation && !this.resultArr[i]){
                            this.warmShow='show'
                            setTimeout(() => {
                                This.warmShow= 'hide'
                            }, 2000)
                            return
                      }
              }
                       
            for( let i=0;i<this.userData.interfaceHeads.length;i++){
                      this.userData.interfaceHeads[i].value=this.headerArr[i]
                      if(this.userData.interfaceHeads[i].validation && !this.headerArr[i]){
                            this.warmShow='show'
                             setTimeout(() => {
                                This.warmShow= 'hide'
                            }, 2000)                           
                            return
                      }
              }
            this.setLoading(true)   
            this.submitRes(this.userData)
        },
        fileHandle(e,i){
            let formData=new FormData()
            formData.append('file',e.target.files[0])
            this.upfile(formData)
            this.resNumber= i
        },
        blurHeader(i){
            if(!this.headerArr[i]){
               this.$set(this.isNullH,i,true)           
            }else{
                this.$set(this.isNullH,i,false)
            }

        },
        blurParams(i){
            if(!this.resultArr[i]&&this.userData.interfaceParameters[i].validation){
               this.$set(this.isNullP,i,true)           
            }else{
                this.$set(this.isNullP,i,false)
            }

        }
    },
    created() {
        this.getType()    
    }
}
</script>
