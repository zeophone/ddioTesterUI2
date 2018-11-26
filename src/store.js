import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseURl: "http://192.168.0.135:8080", //后台接口地址，本地填写：location.origin
    baseLogo: require("./assets/logo.png"), //logo地址
    responseNum: 3,//限制显示返回结果数量
    baseTitle: '豆豆',//主标题
    baseDescribe: '接口调试工具',//副标题
    interType: null,//接口类型
    interList: null,//接口列表
    headerList: null,//请求头列表
    paramList: null,//参数列表
    requestData: null,//请求数据集
    responseData: null,//返回结果
    errorInfo: null,  //错误信息
    selectValue: '',  //类型默认值
    selectValue2: null, //列表默认值
    headerOn: true, //请求头显示开关
    responseStr: '', //返回结果字符串
    requestHttpUrl: '',//返回接口地址
    requestMsg: '',//返回提示信息
    requestResponse: null,//处理好格式后的结果内容
    requestTitle: '',//记录接口名称
    loadOn: false, //加载样式控制
    time: '',//提交请求时间
    fileVal: '',//返回的文件名称
    loadText: ''//超时提示文本
  },
  mutations: {
    //获取接口类型数据
    setType(state,val) {
      state.interType=val
      state.selectValue=val[0].interfaceLists.join(',') 
    },
    //获取接口列表
    setInterList(state,val) {
      state.interList = val
      state.selectValue2=0
    },
    //获取参数和头部列表
    setList(state,val) {
      state.headerList=state.interList[val].interfaceHeads
      state.paramList=state.interList[val].interfaceParameters
      if(!state.headerList[0].elementType){
        state.headerOn=false
      }else{
        state.headerOn=true
      }
    },
    //保存错误信息
    setError(state,val){
      state.errorInfo=val
    },
    setResponse(state,str){
      state.responseStr=str

    },
    //设置返回的信息
    setInfo(state,obj){
      state.requestHttpUrl=obj.url
      state.requestMsg=obj.msg
      state.time=new Date().toLocaleTimeString()
      console.log(state.time)
    },
    //设置结果显示标题
    setTitle(state,str){
      state.requestTitle=str
    },
    //设置文件名信息
    setFileVal(state,str){
      state.fileVal=str
    },
    //设置加载状态
    setLoading(state,bool){
      state.loadOn=bool
      if(bool)state.loadText=''
    }
  },
  actions: {
    //请求类型数据
    getType(context){
      Vue.http.get(context.state.baseURl+'/interfaceData?type=1').then(function (data) {
        data.body.data.sort(function(a,b){
            return a.sored-b.sored
          })
        context.commit('setType',data.body.data)         
      },function(data){
        context.commit('setError',data)
      })
    },
    //请求列表数据
    getInterList(context,val){
      Vue.http.get(context.state.baseURl+'/interfaceData?type=2&selectValue='+val).then(function (data) {
        context.commit('setInterList',data.body.data)  
      },function(data){
        context.commit('setError',data)
      })
    },
    //提交数据
    submitRes(context,obj){
      Vue.http.post(context.state.baseURl+'/commit',JSON.stringify(obj)).then(function (data) {
        context.commit('setLoading',false)        
          if(data.body.state==="200"){
            context.dispatch('formatJson',JSON.parse(data.body.data.response))
            context.commit('setInfo',{url:data.body.data.requestHttpUrl,msg:data.body.msg})
          }else{
            context.commit('setResponse',data.body.data)
            context.commit('setInfo',{url:data.body.data.requestHttpUrl,msg:data.body.msg})
          }
        },function (data) {
          context.commit('setLoading',false)
          context.dispatch('formatJson',JSON.parse(data.body.data))
        })    
        setTimeout(()=>{
          if(context.state.loadOn){
            context.commit('setLoading',false)
            context.state.loadText='连接超时...'
          }
        },5000)
    },
    //文件上传
    upfile(context,file){
      Vue.http.post(context.state.baseURl+'/fileUpload',file,{headers: { 'Content-Type': 'multipart/form-data' }}).then(function (data) {
          if(data.body.state==="200"){
            context.commit('setFileVal',data.body.data)
          }
      })
    },
    //格式处理
    formatJson(context,msg){
      let rep = "~"
      let jsonStr = JSON.stringify(msg, null, rep)
      let str = ""
      for (let i = 0; i < jsonStr.length; i++) {
          let text2 = jsonStr.charAt(i)
          if (i > 1) {
              let text = jsonStr.charAt(i - 1)
              if (rep != text && rep == text2) {
                  str += "<br/>"
              }
          }
          str += text2;
      }
      jsonStr = ""
      for (let i = 0; i < str.length; i++) {
          let text = str.charAt(i)
          if (rep == text)
              jsonStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          else {
              jsonStr += text
          }
          if (i == str.length - 2)
              jsonStr += "<br/>"
      }
      context.commit('setResponse',jsonStr)
    }
  }
})
