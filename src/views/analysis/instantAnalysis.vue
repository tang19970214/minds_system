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
            <div class="markKeyWord">
              <el-tooltip effect="dark" content="國家" placement="top">
                <font-awesome-icon icon="flag" @click="markTextHighlight('Nation')" />
              </el-tooltip>
              <el-tooltip effect="dark" content="地點" placement="top">
                <font-awesome-icon icon="map-marker-alt" @click="markTextHighlight('Place')" />
              </el-tooltip>
              <el-tooltip effect="dark" content="人名" placement="top">
                <font-awesome-icon icon="user" @click="markTextHighlight('TitlePeople')" />
              </el-tooltip>
              <el-tooltip effect="dark" content="組織" placement="top">
                <font-awesome-icon icon="building" @click="markTextHighlight('Org')" />
              </el-tooltip>
            </div>

            <div class="newsContent">
              <text-highlight :class="ChangeHighlightBG(tagName)" :queries="queries">{{ getAnalysisContent }}</text-highlight>
            </div>
          </div>
        </el-col>

        <el-col :span="10">
          <div class="instantAnalysis__card--collapse">
            <div class="detailPage" v-if="!!collapseList">
              <div class="detailPage__tagBox" v-for="item in tagGroup" :key="item.id">
                <div class="detailPage__tagBox--header" :style="{background: getBG(item.id)}">
                  <strong>{{item.title}}</strong>
                  <i class="el-icon-plus" v-if="!item.require" @click="collapseTag(item.id)"></i>
                  <i class="el-icon-minus" v-else @click="collapseTag(item.id)"></i>
                </div>
                <div class="detailPage__tagBox--body" v-if="item.require">
                  <div v-if="collapseList[item.value].length > 0">
                    <el-tag type="info" v-for="(items, idx) in collapseList[item.value]" :key="idx">
                      <strong v-if="item.value == 'Nation' || item.value == 'Place'">{{items.w}}</strong>
                      <strong v-else-if="item.value == 'TitlePeople'">{{items.para}}</strong>
                      <strong v-else-if="item.value == 'Org'">{{items.OrgName}}</strong>
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
        data: "",
        param: "BizNews",
      },
      getAnalysisContent: "",
      tagGroup: [
        { id: 0, title: "國家", value: "Nation", require: true },
        { id: 1, title: "地點", value: "Place", require: false },
        { id: 2, title: "人名", value: "TitlePeople", require: false },
        { id: 3, title: "組織", value: "Org", require: false },
      ],
      tabIndex: 0,
      queries: [],
      tagName: "",

      collapseList: null,
      enterAnalysis: false,
    };
  },
  computed: {
    getBG() {
      return (id) => {
        let setBG = "";
        switch (id) {
          case 0:
            setBG = "#BBFFFF";
            break;
          case 1:
            setBG = "#BBFFBB";
            break;
          case 2:
            setBG = "#FFFFCE";
            break;
          case 3:
            setBG = "#FFD9EC";
            break;
        }
        return setBG;
      };
    },
    ChangeHighlightBG() {
      return (val) => {
        switch (val) {
          case "Nation":
            return "nation";
            break;
          case "Place":
            return "place";
            break;
          case "TitlePeople":
            return "titlePeople";
            break;
          case "Org":
            return "org";
            break;
        }
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
      this.getAnalysisContent = this.listQuery.data;
      this.getList();
    },
    markTextHighlight(val) {
      let setKeyWord = null;
      switch (val) {
        case "Nation":
          setKeyWord = this.collapseList.Nation.map((res) => res.w);
          break;
        case "Place":
          setKeyWord = this.collapseList.Place.map((res) => res.w);
          break;
        case "TitlePeople":
          setKeyWord = this.collapseList.TitlePeople.map((res) => res.para);
          break;
        case "Org":
          setKeyWord = this.collapseList.Org.map((res) => res.OrgName);
          break;
      }
      this.queries = setKeyWord;
      this.tagName = val;
    },
    /* tagGroup收合 */
    collapseTag(id) {
      this.tagGroup.map(
        (item, index) =>
          (item.require = index === id ? (item.require = !item.require) : false)
      );
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
    padding: 8px 16px;
    background: #00abb9;
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
      position: relative;
      width: 100%;
      height: calc(100vh - 100px);
      border: 1px solid #2d2d2d;
      margin-top: 20px;

      .markKeyWord {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        svg {
          padding: 0 8px;
          transition: 0.4s;
          cursor: pointer;

          &:nth-child(1) {
            color: #4dffff;
          }
          &:nth-child(2) {
            color: #79ff79;
          }
          &:nth-child(3) {
            color: #ffe66f;
          }
          &:nth-child(4) {
            color: #ff95ca;
          }

          &:hover {
            transform: scale(1.3);
          }
        }
      }

      .newsContent {
        width: 100%;
        height: calc(100% - 32px);
        padding: 8px;
        overflow: auto;
        box-sizing: border-box;
        overflow-wrap: break-word;
        line-height: 1.5rem;

        .nation > mark {
          background: rgb(187, 255, 255) !important;
        }
        .place > mark {
          background: rgb(187, 255, 187) !important;
        }
        .titlePeople > mark {
          background: rgb(255, 255, 206) !important;
        }
        .org > mark {
          background: rgb(255, 217, 236) !important;
        }
      }
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
              transition: 0.4s;
              cursor: pointer;

              &:hover {
                transform: scale(1.3);
              }
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