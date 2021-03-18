<template>
  <div id="app">
    <div id="nav">
      <!-- <el-container> -->
      <el-aside class="mainLayoutAside" :class="{ isCollapse: isCollapse }" v-if="!$route.meta.hideMenu">
        <div class="mainLayoutAside__title">
          <img src="@/assets/images/logo.png" alt="logo" width="80px">
          <strong v-if="userInfo">{{userInfo.name}}</strong>
        </div>

        <el-menu :default-active="$route.name" :collapse-transition="false" :unique-opened="uniqueOp" :collapse="isCollapse" background-color="#191972" text-color="#fff" active-text-color="#ffd04b" :router="true">
          <Sidebar :isCollapse="isCollapse" v-for="menu in routes" :key="menu.id" :item="menu" />
        </el-menu>
      </el-aside>

      <el-main :class="{ withUp: isCollapse, noBar: $route.meta.hideMenu }">
        <div class="viewHeight">
          <router-view></router-view>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";

export default {
  components: { Sidebar },
  data() {
    return {
      userInfo: null,
      isCollapse: false,
      uniqueOp: true,
      routes: [],
      transitionName: "slide-left",
    };
  },
  mounted() {
    // menu
    let NavigationBar = JSON.parse(
      window.localStorage.menu ? window.localStorage.menu : null
    );
    if (this.routes.length <= 0 && NavigationBar && NavigationBar.length >= 0) {
      this.routes = NavigationBar;
    }

    // user
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
  },
};
</script>

<style lang="scss">
#nav {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: flex-start;

  .mainLayoutAside {
    position: fixed;
    z-index: 2;
    height: 100vh;
    background: #191972;
    color: #fff;
    transition: 0.5s;
    width: 200px !important;

    &.isCollapse {
      width: auto !important;
    }

    &__title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      strong {
        font-size: 24px;
        color: white;
      }
    }
  }

  .el-main {
    padding: 0;
    height: 100%;
    margin-left: 200px;

    &.withUp {
      margin-left: 70px;
    }

    &.noBar {
      margin-left: 0 !important;
    }
  }
}
</style>
