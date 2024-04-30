<template>
  <el-card>
  <div class="header-container">
    <h1>模型对比</h1>
  </div>
  
  <h3>ERINE</h3>
  <img src="../../assets/ERINE结果.png" style="width: 80vw; min-width: 140px;">
  <h3>MNB</h3>
  <img src="../../assets/MNB结果.png" style="width: 80vw; min-width: 140px;">
  <h3>SVM</h3>
  <img src="../../assets/SVC结果.png" style="width: 80vw; min-width: 140px;">
  </el-card>
</template>

<script>

export default {

};
</script>

<style scoped>
.header-container {
  background-color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 20px !important;
}

</style>
