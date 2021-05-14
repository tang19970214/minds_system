<template>
  <div id="infoDetail">
    <el-row class="detailPage">
      <el-col :span="16">
        <div class="detailPage__leftBox">
          <div class="detailPage__leftBox--newsInfo">
            <label>新聞標題：<strong>{{detailList.newsTitle}}</strong></label>
            <label>新聞來源：<strong>{{detailList.newsAuthor}}</strong></label>
            <label>新聞時間：<strong>{{detailList.newsTime | moment("YYYY-MM-DD HH:mm")}}</strong></label>
          </div>

          <div class="detailPage__leftBox--newsContent">
            <div class="markKeyWord">
              <div class="markKeyWord__markIcon">
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
            </div>

            <text-highlight :class="ChangeHighlightBG(tagName)" :queries="queries">{{ detailList.newsContent }}</text-highlight>
          </div>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="detailPage__rightBox" v-if="!!collapseList">
          <div class="detailPage__rightBox--tagBox" v-for="item in tagGroup" :key="item.id">
            <div class="header" :style="{background: getBG(item.id)}">
              <strong>{{item.title}}</strong>
              <i class="el-icon-plus" v-if="!item.require" @click="collapseTag(item.id)"></i>
              <i class="el-icon-minus" v-else @click="collapseTag(item.id)"></i>
            </div>
            <div class="body" v-if="item.require">
              <div v-if="collapseList[item.value].length > 0">
                <el-tag type="info" v-for="(items, idx) in collapseList[item.value]" :key="idx">
                  <strong v-if="item.value == 'Nation' || item.value == 'Place'">{{items.w}}</strong>
                  <strong v-else-if="item.value == 'TitlePeople'">{{items.para}}</strong>
                  <strong v-else-if="item.value == 'Org'">{{items.OrgName}}</strong>
                </el-tag>
              </div>
              <div v-else>
                <p class="body__noData">無資料</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="detailPage__footer">
      <el-button type="primary" @click="joinProjEdit()">加入分析專卷</el-button>
      <el-button type="primary" @click="closeDetail()">關閉</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listQuery: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        NewsId: Number(this.$route.params.id),
      },
      detailList: {},
      tagGroup: [
        { id: 0, title: "國家", value: "Nation", require: true },
        { id: 1, title: "地點", value: "Place", require: false },
        { id: 2, title: "人名", value: "TitlePeople", require: false },
        { id: 3, title: "組織", value: "Org", require: false },
      ],
      collapseList: null,
      tagName: "",
      queries: [],
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
      this.$api.getNewsDetail(this.listQuery).then((res) => {
        this.detailList = res.data;
        this.getEntities(res.data.newsTitle);
      });
    },
    getEntities(item) {
      const entitiesQuery = {
        data: item,
        param: "BizNews",
      };
      this.$api
        .getEntities(entitiesQuery)
        .then((res) => {
          console.log(res.data);
          this.collapseList = res.data;
          this.$store.dispatch("loadingHandler", false);
        })
        .catch(() => {});
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
    /* 加入專卷分析 */
    joinProjEdit() {
      let routeUrl = this.$router.resolve({
        name: "projEdit",
        query: { chooseID: JSON.stringify([this.detailList.id]) },
      });
      window.open(routeUrl.href, "_blank");
    },
    closeDetail() {
      this.$confirm("確定要關閉此頁面嗎？", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.close();
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.$store.dispatch("loadingHandler", true);
    this.getList();
  },
};
</script>

<style lang="scss" scope>
#infoDetail {
  width: 100%;
  height: 100vh;
  padding: 8px;
  box-sizing: border-box;

  .detailPage {
    &__leftBox {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;

      &--newsInfo {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;

        label {
          padding-bottom: 8px;
        }
      }

      &--newsContent {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        min-height: 500px;
        border: 1px solid black;
        box-sizing: border-box;

        p {
          margin: 0;
          letter-spacing: 1.6px;
          line-height: 1.6rem;
        }

        .markKeyWord {
          width: 100%;
          padding-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          &__markIcon {
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
        }

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

    &__rightBox {
      width: 100%;
      padding: 95px 8px 8px 8px;
      box-sizing: border-box;

      &--tagBox {
        width: 100%;
        border: 1px solid #eee;
        border-radius: 4px;
        margin-bottom: 8px;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);

        &:last-child {
          margin: 0;
        }

        .header {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #191970;

          i {
            padding: 4px 8px;
            font-weight: bold;
            color: #191970;
            transition: 0.4s;
            cursor: pointer;

            &:hover {
              transform: scale(1.3);
            }
          }
        }

        .body {
          width: 100%;
          padding: 8px 8px 4px 8px;
          box-sizing: border-box;

          .el-tag {
            margin: 0 4px 4px 0;

            &:last-child {
              margin-right: 0;
            }
          }

          &__noData {
            padding-bottom: 4px;
            margin: 0;
            font-size: 13px;
          }
        }
      }

      &--tag {
        padding: 4px 0;
        .collapseTag {
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

    &__footer {
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>