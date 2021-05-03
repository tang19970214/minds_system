<template>
  <div id="page">
    <strong>共{{listNum}}筆</strong>
    <el-select v-model="getPageSize" placeholder="請選擇顯示筆數" @change="handleSizeChange">
      <el-option label="10筆/頁" :value="10"></el-option>
      <el-option label="20筆/頁" :value="20"></el-option>
      <el-option label="50筆/頁" :value="50"></el-option>
      <el-option label="100筆/頁" :value="100"></el-option>
    </el-select>
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="listNum" :page-size="getPageSize"></el-pagination>
  </div>
</template>

<script>
export default {
  name: "page",
  props: {
    listNum: {
      type: Number,
      require: true,
      default: 1,
    },
  },
  data() {
    return {
      getPageSize: 10,
    };
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
  },
};
</script>

<style lang="scss">
#page {
  width: 100%;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .el-select {
    margin-left: 16px;
    width: 110px;
  }
}
</style>