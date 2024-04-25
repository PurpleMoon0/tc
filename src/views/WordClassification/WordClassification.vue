<template>
  <div class="header-container">
    <h1>分类</h1>
  </div>
  <div class="main-box">
    <el-card>
      <el-form
        label-width="auto"
        style="width: 790px"
        ref="ruleFormRef"
        :rules="rules"
        :model="form"
      >
        <el-form-item prop="textInput">
          <el-input
            type="textarea"
            v-model="form.textInput"
            placeholder="请输入文本，不少于10个字符，不超过512个字符"
            :rows="20"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleRmove">清除</el-button>
          <el-button @click="classifyText" :loading="isSending" type="primary"
            >识别</el-button
          >
          <el-text class="mx-1" size="large" style="margin-left: 30px">{{
            classificationResult
          }}</el-text>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div id="main" ref="main" style="width: 790px; height: 580px"></div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      form: {
        textInput: '',
      },
      rules: {
        textInput: [{ validator: this.validateInput, trigger: 'blur' }],
      },
      classificationResult: '请进行识别',
      isSending: false,
      minLength: 10,
      maxLength: 512,
      API_KEY: '5uaWuAdjR1KDfOoSvxTN24lu',
      SECRET_KEY: 'VwFVPoQdB4eOcDANDMhjjX8z0s7Slst5',
      accessToken: '', // 替换成access_token
      apiUrl:
        'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/text_cls/ipcls?access_token=',

      //识别文本饼图配置项
      option: {
        title: {
          text: '识别结果',
          // subtext: 'Fake Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
      result: [],
    }
  },
  methods: {
    validateInput(rule, value, callback) {
      if (value.length < this.minLength || value.length > this.maxLength) {
        callback(new Error('字符数量须在10到512之间'))
      } else {
        callback()
      }
    },
    async classifyText() {
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!')
          return false
        }
      })
      this.isSending = true //设置按钮不可用
      // 请求token
      axios
        .get(
          `/api/oauth/2.0/token?client_id=${this.API_KEY}&client_secret=${this.SECRET_KEY}&grant_type=client_credentials`
        )
        .then((response) => {
          // console.log('Response:', response.data);
          // this.classificationResult = response.data.access_token;
          this.accessToken = response.data.access_token

          //分类
          try {
            axios
              .post(
                this.apiUrl + this.accessToken,
                {
                  text: this.form.textInput,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json ',
                  },
                }
              )
              .then((res) => {
                this.result = res.data.results

                this.classificationResult = res.data.results[0].name
                this.handleDataFilter()
              })
          } catch (error) {
            console.error('Error classifying text:', error)
            this.classificationResult = 'error2：' + error
          }
        })
        .catch((error) => {
          console.error('Error getting access token:', error)
          this.classificationResult = 'error1：' + error
        })

      this.isSending = false //恢复按钮可用
    },
    //清除输入框
    handleRmove() {
      this.form.textInput = ''
    },
    //初始化echarts图表
    handleEchartsInit(option) {
      if (!option) return
      let chartDom = document.getElementById('main') || this.$refs.main
      let myChart = echarts.init(chartDom)
      option && myChart.setOption(option)
    },
    //处理api返回的数据（用于echarts展示）
    handleDataFilter() {
      // { value: 1048, name: 'Search Engine' },
      this.option.series[0].data = []
      this.result.forEach((item) => {
        this.option.series[0].data.push({
          value: (item.score * 100).toFixed(2),
          name: item.name,
        })
      })
      setTimeout(() => {
        this.handleEchartsInit(this.option)
      }, 500)
    },
  },
}
</script>

<style scoped lang="scss">
.header-container {
  background-color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 20px !important;
}
.main-box {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
