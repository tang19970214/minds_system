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
            <p>{{detailList.newsContent}}</p>
          </div>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="detailPage__rightBox">
          <div class="detailPage__rightBox--tagBox" v-for="item in tagGroup" :key="item.id">
            <div class="header">
              <strong>{{item.title}}</strong>
              <i class="el-icon-plus"></i>
            </div>
            <div class="body">
              <el-tag type="info" v-for="item in 13" :key="item">菜菜</el-tag>
            </div>
          </div>

          <el-collapse class="w-full" v-model="activeName" accordion>
            <el-collapse-item title="國家" name="1">
              <div v-if="!!collapseList">
                <div class="detailPage__rightBox--tag" v-if="collapseList.Nation.length > 0">
                  <span class="collapseTag" v-for="(item, idx1) in collapseList.Nation" :key="idx1">{{item.w}}</span>
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
                <div class="detailPage__rightBox--tag" v-if="collapseList.Place.length > 0">
                  <span class="collapseTag" v-for="(item, idx1) in collapseList.Place" :key="idx1">{{item.w}}</span>
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
                <div class="detailPage__rightBox--tag" v-if="collapseList.TitlePeople.length > 0">
                  <span class="collapseTag" v-for="(item, idx1) in collapseList.TitlePeople" :key="idx1">{{item.para}}</span>
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
                <div class="detailPage__rightBox--tag" v-if="collapseList.Org.length > 0">
                  <span class="collapseTag" v-for="(item, idx1) in collapseList.Org" :key="idx1">{{item.w}}</span>
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

    <div class="detailPage__footer">
      <el-button type="primary">加入分析專卷</el-button>
      <el-button type="primary" @click="closeDetail">關閉</el-button>
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
        { id: 1, title: "國家" },
        { id: 2, title: "地點" },
        { id: 3, title: "人名" },
        { id: 4, title: "組織" },
      ],
      collapseList: null,
      activeName: 1,
    };
  },
  //   computed: {
  //     getBG() {
  //       return (id) => {
  //         console.log(id);
  //         let setBG = "";
  //         switch (id) {
  //           case 1:
  //             setBG = "#FFFFCE";
  //             break;
  //           case 2:
  //             setBG = "#FFD9EC";
  //             break;
  //           case 3:
  //             setBG = "#BBFFBB";
  //             break;
  //           case 4:
  //             setBG = "#BBFFFF";
  //             break;
  //         }
  //         return setBG;
  //       };
  //     },
  //   },
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