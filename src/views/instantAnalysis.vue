<template>
  <div class="instantAnalysis">
    <div class="instantAnalysis__setting">
      <strong>查詢設定</strong>
    </div>

    <div class="instantAnalysis__card">
      <strong class="instantAnalysis__card--title">分析結果：</strong>

      <el-row>
        <el-col :span="14">
          <div class="instantAnalysis__card--result">
            分析結果
          </div>
        </el-col>

        <el-col :span="10">
          <div class="instantAnalysis__card--collapse">
            <el-collapse class="w-full" v-model="activeName" accordion>
              <el-collapse-item title="實體1" name="1">
                <a>內容1</a>
                <a>內容2</a>
                <a>內容3</a>
              </el-collapse-item>
              <el-collapse-item title="實體2" name="2">
                <a>內容1</a>
                <a>內容2</a>
                <a>內容3</a>
              </el-collapse-item>
              <el-collapse-item title="實體3" name="3">
                <a>內容1</a>
                <a>內容2</a>
                <a>內容3</a>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "",
      listQuery: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo"))?.userId,
        content: "XXXYYYaAADDREFADF",
      },
    };
  },
  methods: {
    getList() {
      this.$api.getEntities(this.listQuery).then((res) => {
        console.log(res);
      });
    },
  },
  mounted() {
    // this.getList();
  },
};
</script>

<style lang="scss">
.instantAnalysis {
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
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

  &__card {
    width: 100%;

    &--title {
      color: #2a2a2a;
      letter-spacing: 2px;
      font-size: 26px;
    }

    &--result {
      width: 100%;
      min-height: 500px;
      border: 1px solid #2d2d2d;
      margin-top: 20px;
    }

    &--collapse {
      padding: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: center;

      //   .el-collapse-item {
      //       &__header {
      //           background: ;
      //       }
      //   }
    }
  }
}
</style>