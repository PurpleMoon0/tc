<template>
  <div class="common-layout">
    <el-container>
      <el-header style="padding: 0 !important; border-bottom: 1px solid #eee !important;">
        <HeaderView />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <AsideView />
        </el-aside>
        <el-main>
          <MainView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import HeaderView from '@/views/HeaderView.vue'
import AsideView from '@/views/AsideView.vue'
import MainView from '@/views/MainView.vue'

export default {
  components: {
    HeaderView,
    AsideView,
    MainView,
  },
}
</script>

<style scoped lang="scss">
.common-layout {
  height: 100vh;
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
</style>
