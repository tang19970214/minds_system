<template>
  <div id="sideBar" :class="{'shrinkBar': isCollapse}">
    <template>
      <!-- 有子層 -->
      <el-submenu v-if="item.children.length > 0" :index="item.path" :key="item.id">
        <!-- 父層 -->
        <template slot="title">
          <i v-if="
              item.children &&
              item.children.length > 0
            " :class="item.icon"></i>
          <span class="title-name" slot="title" v-if="!isCollapse">
            {{item.name}}
          </span>
        </template>
        <!-- 渲染子層路由 子層 -->
        <template v-for="child in item.children">
          <!-- 實現元件(sidbar)嵌套 當子層不隱藏且不是按鈕時 -->
          <!-- <sidebar v-if="child.children && child.children.length > 0" :item="child" :index="child.id" :key="child.id" /> -->
          <el-menu-item :key="child.id" :index="child.path">
            <i :class="child.icon"></i>
            <template slot="title">
              <span class="title-name" slot="title">{{ child.name }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-submenu>
      <!-- 無子層 -->
      <template v-else>
        <el-menu-item v-if="item.name !== '登出'" :index="item.path" :key="item.id">
          <i :class="item.icon"></i>
          <!-- <i class="el-icon-search"></i> -->
          <template slot="title">
            <!-- <i :class="item.icon"></i> -->
            <span class="title-name" slot="title">{{ item.name }}</span>
          </template>
        </el-menu-item>
        <el-menu-item v-else :index="item.path" @click="signout">
          <i :class="item.icon"></i>
          <template slot="title">
            <span class="title-name" slot="title">{{ item.name }}</span>
          </template>
        </el-menu-item>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
      required: false,
    },
    item: {
      type: Object,
      required: false,
    },
  },
  methods: {
    signout() {
      this.$confirm("確定要登出系統嗎？", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("loadingHandler", true);
        this.$api
          .logout({
            userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
          })
          .then((res) => {
            if (res.data) {
              window.localStorage.removeItem("userInfo");
              window.localStorage.removeItem("menu");
              this.$message({
                type: "success",
                message: "您已成功登出!",
              });
              this.$router.push({ name: "login" });
            }
            this.$store.dispatch("loadingHandler", false);
          });
      });
    },
  },
};
</script>

<style lang="scss">
#sideBar {
  &.shrinkBar {
    li,
    .el-tooltip {
      padding: 0 !important;
      text-align: center !important;
      i {
        margin-right: 0 !important;
      }
    }
  }
}
</style>