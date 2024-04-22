<template>
  <!-- <div>
    <textarea v-model="textInput" :maxlength="maxLength" rows="5" cols="50"></textarea>
    <button @click="classifyText">Classify</button>
    <div v-if="classificationResult">
      <h2>Classification Result:</h2>
      <p>{{ classificationResult }}</p>
    </div>
  </div> -->
  <div>
    <el-card>
      <el-form label-width="auto" style="max-width: 800px">
        <el-form-item prop="input">
          <el-input type="textarea" :rules="rules" v-model="textInput" placeholder="请输入文本，不超过512个字符"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="classifyText" :loading="isSending" type="primary">识别</el-button>
          <el-button @click="handleRmove">清除</el-button>
          <el-text class="mx-1" size="large" style="margin-left: 30px">{{
            classificationResult
          }}</el-text>
          <!-- <el-button @click="()=>{console.log(results[0].name)}"></el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <el-card style="margin-top: 10px">
    <div id="main" ref="main" style="width: 100vw; height: 500px"></div>
  </el-card>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";

export default {
  data() {
    return {
      textInput: "",
      classificationResult: "请进行识别",
      isSending: false,
      maxLength: 512,
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
            name: "Access From",
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
  mounted() {},
  methods: {
    async classifyText() {
      this.isSending = true; //设置按钮不可用

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
                  text: this.textInput,
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

                this.classificationResult = res.data.results[0].name;
                this.handleDataFilter();
              });
          } catch (error) {
            console.error("Error classifying text:", error);
            this.classificationResult = "error2：" + error;
          }
        })
        .catch((error) => {
          console.error("Error getting access token:", error);
          this.classificationResult = "error1：" + error;
        });

      this.isSending = false; //恢复按钮可用
    },
    //清除输入框
    handleRmove() {
      this.textInput = "";
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

<style scoped>
/* 可选：组件的样式 */
</style>
