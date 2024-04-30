<template>
  <div class="header-container">
    <h1></h1>
    <el-text class="mx-1" type="primary"
      >这是一个专利相关文本分类器，能够识别与专利相关的文本属于哪个类别，
      类别有：法律政策、专利文书、专利分析报告、判决文书和其他文本</el-text
    >
  </div>
  <div class="main-box">
    <el-card v-loading="loading">
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
            placeholder="请输入文本，不少于10个字符，不超过4096个字符"
            :rows="20"
            style="width: 600px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="classifyText"
            :loading="isSending"
            type="primary"
            :disabled="disable"
            >识别</el-button
          >
          <el-button @click="handleRmove">清除</el-button>
          <el-text class="mx-1" size="large" style="margin-left: 30px">{{
            classificationResult
          }}</el-text>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading">
      <div id="main" ref="main" style="width: 790px; height: 580px"></div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";
export default {
  data() {
    return {
      form: {
        textInput: "",
      },
      rules: {
        textInput: [{ validator: this.validateInput, trigger: 'change' }],
      },
      classificationResult: "请进行识别",
      disable: true, //识别按钮状态
      loading: false,  //加载动画
      minLength: 10,
      maxLength: 4096,
      API_KEY: "5uaWuAdjR1KDfOoSvxTN24lu",
      SECRET_KEY: "VwFVPoQdB4eOcDANDMhjjX8z0s7Slst5",
      accessToken: "", // 替换成access_token
      apiUrl:
        "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/text_cls/ipcls?access_token=",

      //识别文本饼图配置项
      option: {
        title: {
          text: "识别结果",
          // subtext: 'Fake Data',
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "占比",
            type: "pie",
            radius: "50%",
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      result: [],
    };
  },
  methods: {
    //表单校验
    validateInput(rule, value, callback) {
      if (value.length < this.minLength || value.length > this.maxLength) {
        callback(new Error("字符数量须在10到4096之间"));
        this.disable = true; //设置识别按钮不可用
      } else {
        callback();
        this.disable = false; //恢复识别按钮可用
      }
    },

    //文本识别
    async classifyText() {
      this.loading = true; //加载动画
      this.$refs.ruleFormRef.validate((valid) => {
        if (valid) {
          console.log("submit!");
        } else {
          console.log("error submit!");
          return false;
        }
      });

      // 请求token
      axios
        .get(
          `/api/oauth/2.0/token?client_id=${this.API_KEY}&client_secret=${this.SECRET_KEY}&grant_type=client_credentials`
        )
        .then((response) => {
          // console.log('Response:', response.data);
          // this.classificationResult = response.data.access_token;
          this.accessToken = response.data.access_token;

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
                    "Content-Type": "application/json",
                    Accept: "application/json ",
                  },
                }
              )
              .then((res) => {
                this.result = res.data.results;

                this.classificationResult =
                  "识别结果：" + res.data.results[0].name;
                this.handleDataFilter();
                this.loading = false; //停止加载动画
              });
          } catch (error) {
            console.error("Error classifying text:", error);
            this.classificationResult = "识别失败，错误代码：2。" + error;
            this.loading = false; //停止加载动画
          }
        })
        .catch((error) => {
          console.error("Error getting access token:", error);
          this.classificationResult = "token请求失败，错误代码：1。" + error;
          this.loading = false; //停止加载动画
        });

    },
    //清除输入框
    handleRmove() {
      this.form.textInput = "";
    },
    //初始化echarts图表
    handleEchartsInit(option) {
      if (!option) return;
      let chartDom = document.getElementById("main") || this.$refs.main;
      let myChart = echarts.init(chartDom);
      option && myChart.setOption(option);
    },
    //处理api返回的数据（用于echarts展示）
    handleDataFilter() {
      // { value: 1048, name: 'Search Engine' },
      this.option.series[0].data = [];
      this.result.forEach((item) => {
        this.option.series[0].data.push({
          value: (item.score * 100).toFixed(2),
          name: item.name,
        });
      });
      setTimeout(() => {
        this.handleEchartsInit(this.option);
      }, 500);
    },
  },
};
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
