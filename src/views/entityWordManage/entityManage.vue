<template>
  <div class="entityManagePage">
    <div class="entityManagePage__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="entityManagePage__searchBox" v-if="openSearchBox">
        <div class="entityManagePage__searchBox--sort">
          <label>實體分類：</label>
          <el-select v-model="entitySort" placeholder="請選擇實體分類" no-data-text="無數據">
            <el-option label="請選擇" value=""></el-option>
          </el-select>
          <i class="el-icon-edit" @click="openProjSortModal('edit')"></i>
          <i class="el-icon-plus" @click="openProjSortModal('add')"></i>
          <i class="el-icon-delete-solid" @click="openProjSortModal('del')"></i>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  data() {
    return {
      listQuery: {
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
      },
      openSearchBox: true,
      entitySort: "",
    };
  },
  methods: {
    openProjSortModal() {},
  },
};
</script>

<style lang="scss">
.entityManagePage {
  width: 100%;
  height: 100vh;
  position: relative;

  &__setting {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    padding: 16px 8px;
    background: #00abb9;
    -webkit-writing-mode: vertical-lr;
    writing-mode: vertical-lr;
    transition: 0.6s;
    cursor: pointer;

    strong {
      color: white;
    }

    &:hover {
      background: #038bb4;
    }
  }

  &__searchBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #191972;

    &--sort {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      label {
        font-weight: 600;
        color: #2a2a2a;
        letter-spacing: 2px;
        font-size: 18px;
      }

      .el-select {
        min-width: 300px !important;
      }

      i {
        font-weight: bold;
        font-size: 24px;
        padding: 0 12px;
        transition: 0.6s;
        cursor: pointer;

        &:hover {
          font-size: 28px;
          color: #00abb9;
        }
      }
    }
  }
}
</style>