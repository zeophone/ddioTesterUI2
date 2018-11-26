<template>
    <div>
        <MainHeader></MainHeader>
        <div class="container">
            <div class="tool-warp">
                <h3 class="title">平台接口调试工具</h3>
                <div class="describe">
                    此工具旨在帮助开发者检测调用【平台API】时发送的请求参数是否正确，提交相关信息后可获得服务器的验证结果
                </div>
                <div class="detail">
                    <h3>使用说明：</h3>
                    <p>（1）选择合适的接口。</p>
                    <p>（2）系统会生成该接口的参数表，您可以直接在文本框内填入对应的参数值。(<i>*</i>表示该字段必填)</p>
                    <p>（3）点击检查问题按钮，即可得到相应的调试信息。</p>
                </div>
                <Interface></Interface>
                <Response></Response>
            </div>
        </div>
    </div>
</template>
<script>
import MainHeader from '@/components/MainHeader.vue'
import Interface from './interface.vue'
import Response from './response.vue'
export default {
    name: 'tool',
    components: {
        MainHeader,
        Interface,
        Response
    }
}
</script>
