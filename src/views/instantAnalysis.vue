<template>
  <div class="instantAnalysis">
    <div class="instantAnalysis__setting" @click="enterAnalysis = true">
      <strong>請輸入分析資料</strong>
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
            <div class="detailPage" v-if="!!collapseList">
              <div class="detailPage__tagBox" v-for="item in tagGroup" :key="item.id">
                <div class="detailPage__tagBox--header" :style="{background: getBG(item.id)}">
                  <strong>{{item.title}}</strong>
                  <i class="el-icon-plus"></i>
                </div>
                <div class="detailPage__tagBox--body">
                  <div v-if="collapseList[item.value].length > 0">
                    <el-tag type="info" v-for="(items, idx) in collapseList[item.value]" :key="idx">
                      <strong v-if="item.value == 'Nation'">{{items.w}}</strong>
                      <strong v-else-if="item.value == 'TitlePeople'">{{items.para}}</strong>
                    </el-tag>
                  </div>
                  <div v-else>
                    <p class="noData">無資料</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="detailPage" v-else>
              <div class="detailPage__tagBox" v-for="item in tagGroup" :key="item.id">
                <div class="detailPage__tagBox--header" :style="{background: getBG(item.id)}">
                  <strong>{{item.title}}</strong>
                  <i class="el-icon-plus"></i>
                </div>
                <div class="detailPage__tagBox--body">
                  <p class="noData">無資料</p>
                </div>
              </div>
            </div>
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
      tagGroup: [
        { id: 1, title: "國家", value: "Nation" },
        { id: 2, title: "地點", value: "Place" },
        { id: 3, title: "人名", value: "TitlePeople" },
        { id: 4, title: "組織", value: "Org" },
      ],

      collapseList: null,
      enterAnalysis: false,
    };
  },
  computed: {
    getBG() {
      return (id) => {
        let setBG = "";
        switch (id) {
          case 1:
            setBG = "#FFFFCE";
            break;
          case 2:
            setBG = "#FFD9EC";
            break;
          case 3:
            setBG = "#BBFFBB";
            break;
          case 4:
            setBG = "#BBFFFF";
            break;
        }
        return setBG;
      };
    },
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

      .detailPage {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;

        &__tagBox {
          width: 100%;
          border: 1px solid #eee;
          border-radius: 4px;
          margin-bottom: 8px;
          box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);

          &:last-child {
            margin: 0;
          }

          &--header {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #191970;

            i {
              font-weight: bold;
              color: #191970;
            }
          }

          &--body {
            width: 100%;
            padding: 8px 8px 4px 8px;
            box-sizing: border-box;

            .el-tag {
              margin: 0 4px 4px 0;

              &:last-child {
                margin-right: 0;
              }
            }

            .noData {
              padding-bottom: 4px;
              margin: 0;
              font-size: 13px;
            }
          }
        }
      }

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