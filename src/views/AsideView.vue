<template>
  <div class="aside-container">
    <el-menu :default-active="routesList[0].path" router class="el-menu-vertical-demo">
      <el-menu-item :index="route.path" v-for="route in routesList" :key="route">
          <el-icon><icon-menu /></el-icon>
          <span>{{ route.meta.label }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { routes } from '@/router'
export default {
  data: () => {
    return {
    }
  },
  computed: {
    routesList: () => {
      return routes.filter((item) => item.meta?.label)
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.aside-container {
  background-color: #fff;
  height: 100%;
}
</style>
