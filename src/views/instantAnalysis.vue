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
              <el-collapse-item title="國家" name="1">
                <div v-if="!!collapseList">
                  <div class="collapseTag" v-if="collapseList.Nation.length > 0">
                    <span class="collapseTag__tag" v-for="(item, idx1) in collapseList.Nation" :key="idx1">{{item.w}}</span>
                  </div>
                  <div v-else>
                    <strong>無資料</strong>
                  </div>
                </div>
                <div v-else>
                  <strong>無資料</strong>
                </div>
              </el-collapse-item>

              <el-collapse-item title="地點" name="2">
                <div v-if="!!collapseList">
                  <div class="collapseTag" v-if="collapseList.Place.length > 0">
                    <span class="collapseTag__tag" v-for="(item, idx1) in collapseList.Place" :key="idx1">{{item.w}}</span>
                  </div>
                  <div v-else>
                    <strong>無資料</strong>
                  </div>
                </div>
                <div v-else>
                  <strong>無資料</strong>
                </div>
              </el-collapse-item>

              <el-collapse-item title="人名" name="3">
                <div v-if="!!collapseList">
                  <div class="collapseTag" v-if="collapseList.TitlePeople.length > 0">
                    <span class="collapseTag__tag" v-for="(item, idx1) in collapseList.TitlePeople" :key="idx1">{{item.para}}</span>
                  </div>
                  <div v-else>
                    <strong>無資料</strong>
                  </div>
                </div>
                <div v-else>
                  <strong>無資料</strong>
                </div>
              </el-collapse-item>

              <el-collapse-item title="組織" name="4">
                <div v-if="!!collapseList">
                  <div class="collapseTag" v-if="collapseList.Org.length > 0">
                    <span class="collapseTag__tag" v-for="(item, idx1) in collapseList.Org" :key="idx1">{{item.w}}</span>
                  </div>
                  <div v-else>
                    <strong>無資料</strong>
                  </div>
                </div>
                <div v-else>
                  <strong>無資料</strong>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 輸入分析資料 -->
    <el-dialog title="請輸入分析資料" :visible.sync="enterAnalysis" width="50%" center>
      <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 12}" placeholder="請輸入分析資料" v-model="listQuery.data">
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="startAnalysis()">分析</el-button>
        <el-button type="danger" @click="enterAnalysis = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "",
      listQuery: {
        data: "從川普到拜登！台美關係持續友好　美國官員訪台層級不斷提高",
        param: "BizNews",
      },
      collapseList: null,
      enterAnalysis: false,
    };
  },
  methods: {
    getList() {
      this.$api
        .getEntities(this.listQuery)
        .then((res) => {
          console.log(res.data);
          this.collapseList = res.data;
          this.enterAnalysis = false;
          this.$store.dispatch("loadingHandler", false);
        })
        .catch(() => {});
    },
    startAnalysis() {
      this.$store.dispatch("loadingHandler", true);
      this.getList();
    },
  },
  mounted() {
    this.enterAnalysis = true;
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

      .el-collapse-item__header {
        &:nth-child(1) {
          background: yellow;
        }
      }

      .collapseTag {
        padding: 4px 0;
        &__tag {
          padding: 4px 8px;
          background: #eee;
          border-radius: 10px;
          margin-right: 8px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>