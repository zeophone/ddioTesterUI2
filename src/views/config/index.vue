<template>
    <div class="setting">
        <MainHeader Describe="接口维护工具"></MainHeader>
        <div class="mask" v-show="isAdd"></div>  
        <div class="top">
            <p>
                <label for="portName">接口名称：</label>
                <input type="text" id="portName" class="right" v-model="obj3.name"> 
            </p>
            <p>
             <label for="urlName">URL：</label>
            <input type="text" id="urlName" class="right" v-model="obj3.interfaceUrl">              
            </p>
             <p>
              <label for="portDels">接口描述：</label>
            <textarea name="" id="portDels" cols="30" rows="10" class="right" v-model="obj3.describe"></textarea><br/>  
            </p>
            <p>
                 <label for="isAble">是否启用：</label>
                <select name="" id="isAble" class="right" v-model="obj3.status">
                    <option value=1>启用</option>
                    <option value=2>禁用</option>
                </select>
            </p>
            <p>
                 <label for="isGet">请求方式：</label>
                <select name="" id="isGet" class="right" v-model="obj3.requestMethod">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="POST/FORM">POST/FORM</option>
                    <option value="POST/JSON">POST/JSON</option>
                    <option value="POST/BODY">POST/BODY</option>
                </select>
            </p>
        </div>
        <div class="params">
            <div class="paramsHeader"> 
                <span :class="class1" @click="clickHandle(1)">参数</span>
                <span :class="class2" @click="clickHandle(2)">head</span>
            </div>
            <div class="paramsContent">
                <div class="add">
                    <button @click="addHandle">新增{{addName.name}}</button>
                </div>
                <table border="1" cellspacing="0">
                    <tr><th>名称</th><th>描述</th><th>控件类型</th><th>校验</th><th>默认值</th><th>操作</th></tr>
                    <tr v-for="(item,i) in listArr" :key="i">
                        <td>{{item.name}}</td>
                        <td>{{item.describe}}</td>
                        <td>{{item.elementType.type}}</td>
                        <td>{{item.validation}}</td>
                        <td>{{item.value}}</td>
                        <td class="formControl"><span @click="formControl(i)">删除</span></td>
                    </tr>
                </table>
                <div class="btnWarp"><button class="allSub" @click="allSub">提交</button></div>
            </div>
            <div class="addPanel" v-show="isAdd" >
                <h4>新增{{addName.name}}</h4>
                <span class="addOver" @click="addOverHandle"><img :src="bgurl" alt=""></span> 
                <div class="addlist">
                    <p>
                    <label for="addName" >name：</label>
                    <input type="text" id="addName" class="right" v-model="obj2.name">  
                    </p>
                    <p>
                    <label for="addStatus">状态：</label>
                    <select name="" id="isAble" class="right" v-model="obj2.status">
                        <option value='1'>启用</option>
                        <option value='2'>禁用</option>
                    </select>
                    </p> 
                    <p>
                    <label for="addDefault">默认值：</label>
                    <input type="text" id="addDefault" class="right" v-model="obj2.value"> 
                    </p>
                    <p>
                    <label for="addDetails">描述：</label>
                    <textarea type="text" id="addDetails" class="right" v-model="obj2.describe"> </textarea>
                    </p>
                    <p>
                    <label for="addSort">排序：</label>
                    <input type="text" id="addSort" class="right" v-model="obj2.sored" placeholder ="限制输入数字"> 
                    </p> 
                    <p>
                    <label for="addCheck">前端校验：</label>
                    <span class="right">
                        <input type="checkbox" id="addCheck" v-model="obj2.validation"> 
                        <span>是否为空</span>
                    </span>               
                    </p> 
                    <p id="dealLabel">
                    <label >数据处理：</label>
                    <ul class="right" id="Deal">
                        <li v-for="(item,i) in validVal" :key="item">
                            <input name="Fruit" type="checkbox" :value="validKey[i]"  />
                        {{item}}                              
                        </li>
                    </ul>               
                    </p> 
                    <p>
                        <label>控件：</label>
                        <span class="right">
                            <select name="" id="" v-model="obj2.elementType.type" @change="isSel">
                            <option value="input">输入框</option>
                            <option value="select">下拉框</option>
                            <option value="text">文本框</option>
                            <option value="file">上传文件</option>
                        </select>
                        </span> 
                                    
                    </p> 
                    <p v-show="addName.isSel" class="controlShow">  
                        <em>选项：</em>   
                            <em>text</em><input type="text" v-model="addName.control.text"> 
                            <em>value</em><input type="text" v-model="addName.control.value">
                            <span class="controlBtn" @click="controlSave">添加</span>                                 
                    </p>                
                    <ul>
                        <li v-for="(item,i) in obj2.elementType.optionalValue" :key="i">
                        <p><span class="controlTap">名称：{{item.text}}</span><span class="controlTap"> 值：{{item.value}}</span><span class="controlDel" >
                            <i @click="controlDel(i)">删除</i></span></p>  
                        </li>
                    </ul>
                    <div class="resBtn">
                        <button @click="addSave">保存</button>
                        <button @click="addReset">重置</button>
                    </div>                      
                    
                </div>           
                          
            </div>
        </div>
        
    </div>
</template>
<script>
import MainHeader from '@/components/MainHeader.vue'
import {mapState, mapActions} from 'vuex'
    export default {
        name: 'config',
        data () {
            return{
                class1:'active',
                class2:'',
                isAdd: false,
                addName: {
                    name: '参数', 
                    isSel: false,
                    control: {
                        text: '',
                        value: ''
                    }
                },
                bgurl: require("@/assets/delete.png"),
                listArr: [],
                obj1:{
                    "describe":'',
                    "interfaceId":'',
                    "name":'',
                    "sored":'',
                    "status":'1',
                    "value":'',
                    "valid": [],
                    "validation":false,
                    "elementType":{
                        "type":'input',
                        "optionalValue":[]
                    }
                },
                obj2:{
                    "describe":'',
                    "interfaceId":'',
                    "name":'',
                    "sored":'',
                    "status":'1',
                    "value":'',
                    "valid": [],
                    "validation":false,
                    "elementType":{
                        "type":'input',
                        "optionalValue":[]
                    }
                },
                obj3:{
                    "describe": "用户模块访问接口",
                    "interfaceId": 1,
                    "interfaceUrl": "/platform/api2/token",
                    "name": "用户模块访问接口",
                    "value":"1",
                    "sored":1,
                    "status":1,
                    "version":1,
                    "requestMethod": "GET",
                    "typeId": 1,
                    "interfaceHeads":[],
                    "interfaceParameters":[]
                },
                interfaceHeads:[],
                interfaceParameters:[],
                validKey: [],
                validVal: []

            }
        },
        created() {
            this.$http.get(this.baseURl+'/reuqestValidCode').then(function(data){
                let item=data.data.data
                for(let i=0;i<item.length;i++){
                    for(let key in item[i]){
                        this.validKey.push(key)
                        this.validVal.push(item[i][key])
                    }
                }
            })
        },
        components: {
            MainHeader
        },
        computed: {
            ...mapState(['baseURl'])
        },
        methods:{
            clickHandle(num){
                this.obj2=JSON.parse(JSON.stringify(this.obj1))
                //参数显示类别切换
                if(num==1){
                this.class1='active'
                this.class2=''
                this.addName.name='参数'
                this.listArr=this.interfaceParameters
                }else{
                this.class1=''
                this.class2='active'
                this.addName.name='head'
                this.listArr=this.interfaceHeads
                }
            },
            addHandle(){
                this.isAdd= !this.isAdd
                //置空输入框
                this.obj2.elementType.type='input'
                this.addName.isSel=false
                this.addName.control={text: '',value: ''}
                this.obj2.elementType.optionalValue=[]
                
            },
            addOverHandle(){
                 this.isAdd=false
            },
            controlSave() {
                if(this.addName.control.text){
                this.obj2.elementType.optionalValue.push(JSON.parse(JSON.stringify(this.addName.control)))  
                this.addName.control.text='' 
                this.addName.control.value=''
                }                
            },
            addSave() {
                let arr=document.getElementsByName("Fruit")
                let validArr=[]
                for(let i=0;i<arr.length;i++){
                if(arr[i].checked){
                    let a = arr[i].value
                    validArr.push(a)
                    }
                }
                if(this.addName.name=='参数'){
                    this.obj2.valid=validArr
                    this.interfaceParameters.push(JSON.parse(JSON.stringify(this.obj2)))
                    this.isAdd=false
                    this.listArr=this.interfaceParameters
                }else{
                    this.obj2.valid=validArr
                    this.interfaceHeads.push(JSON.parse(JSON.stringify(this.obj2)))
                    this.isAdd=false
                    this.listArr=this.interfaceHeads
                }
            },
            addReset(){
                 this.obj2=JSON.parse(JSON.stringify(this.obj1))
            },
            controlDel(i) {
                this.obj2.elementType.optionalValue.splice(i, 1)
            },
            isSel() {
                if(this.obj2.elementType.type=='select'){
                   this.addName.isSel=true
                }else{
                    this.addName.isSel=false
                }
            },
            allSub() {
                this.obj3.interfaceHeads=this.interfaceHeads
                this.obj3.interfaceParameters=this.interfaceParameters
                this.$http.post(this.$store.state.baseURl+'/interfaceUpdate',this.obj3).then(data=>{
                    alert(JSON.stringify(data))
                },data=>{
                    alert(data)
                })
            },
            formControl(i) {
                if(this.addName.name=="参数"){
                    this.interfaceParameters.splice(i, 1)
                }else{
                    this.interfaceHeads.splice(i, 1)
                }
            }
        }
    }
</script>
<style scoped>
 #Deal li{
    padding-left: 52px;
    font-size: 12px;
} 
#dealLabel{
    line-height: 30px;
}
.top{
    width: 60%;
    text-align: left;
    margin: 0 auto;
    border: 1px solid #c5c5c5;
    padding-top: 20px;
}
.top > p,.addPanel > p{
    display: flex;
    margin-bottom: 20px;
}

.params{
    width: 60%;
    margin: 20px auto;
    border: 1px solid #c5c5c5;
    min-height: 300px;
}
.paramsHeader >span{
    height: 50px;
    width: 150px;
    float: left;
    text-align: center;
    line-height: 50px;
    background: #ffffff;
    border: 1px solid #c5c5c5;
    box-sizing: border-box;
}
.paramsHeader .active{
    background: #3d67ba;
    color:#ffffff;
}
.paramsContent table{
    width: 90%;
    margin: 0 auto;
}
.paramsContent .add{
    width: 90%;
    margin: 10px auto;
    text-align: right;
}
.paramsContent .add button{
    background: #3d67ba;
    margin-top: 20px;
    width: 80px;
    height: 48px;
    color: #fff;
}
.addPanel{
    position: absolute;
    width: 550px;
    min-height: 500px;
    padding-bottom: 20px;
    border-radius: 8px;
    left: 35%;
    top:10%;
    background: #fff; 
    z-index: 99;
}
.addPanel > h4{
    height: 50px;
    padding-left: 30px;
    line-height: 50px;
    border-bottom: 1px solid #c1c1c1;
    font-size: 20px;
}
.addPanel > .addlist{
    padding: 0 30px;
    line-height: 60px;
}
.addPanel input,.addPanel select{
    width: 300px;
    height: 30px;
    line-height: 50px;
}
.addlist  label{
    width: 80px;
    display: inline-block;
}
.addlist textarea{
    width: 300px;
    height: 80px;
    resize: none;
    vertical-align:top;
}
.addlist .resBtn{
    text-align: center;
}
.addlist ul{
    padding-left: 30px;
    line-height: 30px;
    font-size: 14px;
}
.addlist ul span{
    width: 20%;
    display: inline-block;
}
.addlist #addCheck{
 width: 20px;
 height: 20px;
 position: relative;
 top: 5px;
 margin-right: 5px;
}
.addPanel button{
    width: 100px;
    height: 38px;
    border: none;
    color: #fff;
    margin-right: 20px;
}
.addPanel button:nth-child(1){
    background: #f94441;
}
.addPanel button:nth-child(2){
    background: #999999;
}
.addOver{
    display: inline-block;
    padding: 5px 5px;
    color: #222;
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
}
.addOver img{
    width: 25px;
    height: 25px;
}
input[type="checkbox"]{
    width: 20px;
    height: 20px;
    display: inline;
    position: relative;
    top: 5px;
    margin-right: 5px;
}
.controlBtn{
    height: 30px;
    width: 60px;
    line-height: 30px;
    font-size: 15px;
    display: inline-block;
    background: #3d67ba;
    color: #fff;
    margin-left: 20px;
    cursor: pointer;
    text-align: center;
}
.controlDel{
       cursor: pointer;
       color: #f94441;
}
.controlDel i{
    position: relative;
    top: -1px;
}
.controlShow{
    margin-left: 30px;
    font-size: 14px;
}
.controlShow em{
    font-style: normal;
}
.controlShow input{
    width: 100px;
    height: 22px;
}
.controlTap{
    margin-right: 30px;
}
.allSub{
    width: 130px;
    height: 48px;
    background: #f94441;
    color: #fff;
    font-size: 20px;
}
em{
    margin-right: 10px;
}
.formControl span{
 margin-right: 5px;
 color: #f94441;
 cursor: default;
}
.formControl span:hover{
    color: #f66767;
}
</style>

