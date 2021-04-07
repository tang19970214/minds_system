<template>
  <div id="app">
    <Loading />
    <div id="nav">
      <el-aside class="mainLayoutAside" :class="{ isCollapse: isCollapse }" v-if="!$route.meta.hideMenu">
        <div class="mainLayoutAside__title" :class="{'mainLayoutAside__shrink': isCollapse}" :style="{'flex-direction: column': !isCollapse}">
          <img src="@/assets/images/logo.png" alt="logo" :width="getLogoWidth">
          <strong v-if="userInfo && !isCollapse">{{userInfo.name}}</strong>
          <i class="el-icon-s-unfold" :class="{'goRound': !isCollapse}" @click="isCollapse = !isCollapse"></i>
        </div>

        <el-menu :default-active="$route.name" :show-timeout="200" :collapse-transition="false" :unique-opened="uniqueOp" :collapse="isCollapse" background-color="#191972" text-color="#fff" active-text-color="#ffd04b" :router="true">
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
import Loading from "./components/Loading.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
  components: { Loading, Sidebar },
  data() {
    return {
      userInfo: null,
      isCollapse: false,
      uniqueOp: true,
      routes: [],
      transitionName: "slide-left",
    };
  },
  computed: {
    getLogoWidth() {
      return this.isCollapse ? "50px" : "80px";
    },
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
    width: 250px !important;

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

      i {
        padding: 0 8px;
        font-size: 24px;
        margin-left: auto;
        transition: 0.5s;
        cursor: pointer;

        &.goRound {
          transform: rotate(180deg);
        }
      }
    }

    &__shrink {
      flex-direction: column;

      i {
        font-size: 20px;
        margin-left: 0;
      }
    }
  }

  .el-main {
    padding: 0;
    height: 100%;
    margin-left: 250px;

    &.withUp {
      margin-left: 50px;
    }

    &.noBar {
      margin-left: 0 !important;
    }
  }
}
.el-menu {
  &--collapse {
    width: auto !important;
  }
}
</style>
