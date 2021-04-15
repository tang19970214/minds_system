<template>
  <div class="projEdit">

    <div class="projEdit__leftBox" :style="checkLeftBoxWidth.leftBox">
      <transition name="moveL">
        <div class="body" v-if="openLeftBox">
          <div class="body__projSort">
            <strong>專卷分類：</strong>
            <div class="body__projSort--func">
              <el-select v-model="searchSort" placeholder="請選擇" no-data-text="無數據" @change="getProjData">
                <el-option label="請選擇" value=""></el-option>
                <el-option :label="item.name" :value="item.name" v-for="item in projSortList" :key="item.id"></el-option>
              </el-select>
              <el-tooltip effect="dark" content="新增專卷分類" placement="bottom">
                <i class="el-icon-plus" @click="openAddProjSort = true"></i>
              </el-tooltip>
            </div>
          </div>

          <div class="body__addTheme">
            <span @click="checkSort()">
              <i class="el-icon-circle-plus-outline"></i>
              <a>新增主題</a>
            </span>
          </div>
          <div class="body__projTheme">
            <el-table :data="(getChild(projThemeList).length > 0) ? getChild(projThemeList)[0].children : []" align="center" style="width: 100%" border empty-text="暫無數據">
              <el-table-column label="專卷主題">
                <template slot-scope="scope">
                  <el-button @click="chooseTheme(scope.row.name)" type="text" :disabled="(relationList.length > 0) ? relationList[relationList.length - 1].label == scope.row.name: false">
                    <b :class="{'body__projTheme--active':getTheme.name == scope.row.name}">{{scope.row.name}}</b>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </transition>

      <div class="projEdit__leftBox--shrinkLeftBox" :style="checkLeftBoxWidth.shrink">
        <i class="el-icon-caret-left" @click="openLeftBox = false" v-if="openLeftBox"></i>
        <i class="el-icon-caret-right" @click="openLeftBox = true" v-else></i>
      </div>
    </div>

    <div class="projEdit__rightBox" :style="checkLeftBoxWidth.rightBox">
      <div class="projEdit__rightBox--infoBox">
        <el-row>
          <el-col :span="12">
            <strong>專卷分類：</strong>
            <el-select v-model="searchSort" placeholder="請選擇" no-data-text="無數據" @change="getProjData">
              <el-option label="請選擇" value=""></el-option>
              <el-option :label="item.name" :value="item.name" v-for="item in projSortList" :key="item.id"></el-option>
            </el-select>
            <!-- <p>{{rightBoxData.projSort}}</p> -->
          </el-col>
          <el-col :span="12">
            <strong>備註：</strong>
            <p>{{rightBoxData.remark}}</p>
          </el-col>
          <el-col :span="24">
            <strong>專卷主題：</strong>
            <a class="childrenItem" :class="{'childrenItem__active':getTheme.name == item}" v-for="(item, idx) in rightBoxData.projTheme" :key="idx" @click="chooseTheme(item)">{{item}}</a>
          </el-col>
        </el-row>
      </div>

      <div class="projEdit__rightBox--contentBox">
        <div class="relationBtn">
          <span @click="openSearchRelation = true">
            <i class="el-icon-search"></i>
            <strong>搜尋關聯分析內容</strong>
          </span>
        </div>

        <!-- 關聯分析 -->
        <el-transfer class="relationList" v-model="relationValue" :data="relationList" :titles="['現有分析內容', '候選關聯新聞']" @change="getObject"></el-transfer>

        <div class="relationFuncBtn">
          <el-button type="primary" @click="saveTopic()" :disabled="!getTheme">儲存</el-button>
          <el-button type="danger" @click="getRelationList()">取消</el-button>
        </div>
      </div>
    </div>

    <!-- modal -->
    <!-- add projSort -->
    <el-dialog title="新增專卷分類" :visible.sync="openAddProjSort" width="50%" center>
      <el-form :model="addProjSort" :rules="rules_addProjSort" ref="ruleForm_addProjSort" label-width="110px">
        <el-form-item label="專卷分類" prop="name">
          <el-input v-model="addProjSort.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSort()">新增</el-button>
        <el-button type="danger" @click="openAddProjSort = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- add projTheme -->
    <el-dialog title="新增專卷主題" :visible.sync="openAddProjTheme" width="50%" center>
      <el-form :model="addProjTheme" :rules="rules_addProjTheme" ref="ruleForm_addProjTheme" label-width="110px">
        <el-form-item label="專卷分類">
          <strong class="modal__title">{{searchSort}}</strong>
        </el-form-item>
        <el-form-item label="專卷主題" prop="name">
          <el-input v-model="addProjTheme.name"></el-input>
        </el-form-item>
        <el-form-item label="備註" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="addProjTheme.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTheme()">新增</el-button>
        <el-button type="danger" @click="openAddProjTheme = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- search relation -->
    <el-dialog class="searchRelationModal" title="" :visible.sync="openSearchRelation" width="70%" center>
      <div class="searchRelationModal__searchBox">
        <el-row>
          <el-col :span="12">
            <strong>搜尋日期：</strong>
            <el-date-picker v-model="searchRelation.dateRange" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="12">
            <strong>查詢來源：</strong>
            <el-select v-model="searchRelation.searchFrom" placeholder="請選擇" no-data-text="無數據">
              <el-option label="請選擇" value=""></el-option>
              <el-option v-for="item in searchList" :key="item.id" :label="item.gKey" :value="item.gKey"></el-option>
            </el-select>
          </el-col>
          <el-col :span="24">
            <el-input type="text" v-model="searchRelation.keyword"></el-input>
            <el-button type="primary" @click="searchNewsList()">搜尋</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="searchRelationModal__listBox">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border empty-text="暫無數據">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="類型" prop="source" width="100"></el-table-column>
          <el-table-column label="新聞標題" prop="newsTitle"></el-table-column>
          <el-table-column label="新聞時間" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.newsTime | moment("YYYY-MM-DD") }}</div>
              <div>{{ scope.row.newsTime | moment("HH:mm") }}</div>
            </template>
          </el-table-column>
          <el-table-column label="新聞網站" prop="newsSite" width="100"></el-table-column>
          <el-table-column label="新聞頻道" prop="newsChannel" width="100"></el-table-column>
          <el-table-column label="情緒指標" prop="sentiment" width="100"></el-table-column>

          <!-- <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="新聞標題" prop="newsTitle">
          </el-table-column>
          <el-table-column label="新聞時間" width="150">
            <template slot-scope="scope">{{ scope.row.newsTime | moment("YYYY-MM-DD HH:mm") }}</template>
          </el-table-column>
          <el-table-column label="新聞網站" prop="newsUrl">
          </el-table-column>
          <el-table-column label="新聞頻道" prop="newsChannel" width="100">
          </el-table-column>
          <el-table-column label="情緒指標" prop="sentiment" width="100">
          </el-table-column> -->
        </el-table>

        <Page :listNum="listNum" :getPageSize="newsListQuery.pageSize" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="join()">加入</el-button>
        <el-button type="danger" @click="openSearchRelation = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";

import Page from "../../components/Page.vue";

export default {
  components: { Page },
  data() {
    return {
      openLeftBox: true,
      searchSort: "",
      projSortList: [],
      projThemeList: [],
      getTheme: "",
      newsListQuery: {
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        sDate: "2021-01-01",
        eDate: "2021-12-31",
        query: "",
        nSite: "全部",
        nChannel: "全部",
        page: 1,
        pageSize: 10,
      },
      tableData: [],
      rightBoxData: {},
      //   專卷分類modal
      openAddProjSort: false,
      addProjSort: {
        name: "",
      },
      rules_addProjSort: {
        name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },
      // 專卷主題modal
      openAddProjTheme: false,
      addProjTheme: {
        name: "",
        remark: "",
      },
      rules_addProjTheme: {
        name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        remark: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },
      // 關聯分析modal
      openSearchRelation: false,
      searchList: [],
      searchRelation: {
        dateRange: "",
        searchFrom: "",
        keyword: "",
      },
      tableData: [],
      listNum: null,
      multipleSelection: [],

      relationValue: [],
      copyRelationValue: [],
      relationList: [],
      leftRelationIds: [],
    };
  },
  computed: {
    checkLeftBoxWidth() {
      return {
        leftBox: this.openLeftBox ? "" : "width: 1.5%",
        shrink: this.openLeftBox ? "" : "width: 100%",
        rightBox: this.openLeftBox ? "" : "width: 98.5%",
      };
    },
    getChild() {
      return (data) => {
        const getChildItem =
          data.filter((res) => res.name == this.searchSort) || [];
        return getChildItem;
      };
    },
  },
  methods: {
    /* 獲取專卷 */
    getProjSortList() {
      this.$api
        .getUserTopic({
          UserId: JSON.parse(window.localStorage.getItem("userInfo"))?.userId,
        })
        .then((res) => {
          this.projSortList = res.data.filter((resp) => resp.pid == null);
          const childrenList = res.data.filter((sup) => sup.pid !== null);
          this.projThemeList = this.projSortList.map((p) => {
            p.children = childrenList.filter((c) => {
              return c.pid === p.id;
            });
            return p;
          });
        });
    },
    /* 獲取穿梭框資料 */
    getRelationList() {
      let listIds = JSON.parse(this.$route.query.chooseID);
      let chooseData = [];
      let chooseIDX = [];
      listIds.forEach((id) => {
        let getItems = {};
        let items = this.tableData.filter((res) => res.id == id)[0];
        getItems = {
          key: items.id,
          label: items.newsTitle,
          value: items.source,
          disabled: true,
        };
        chooseData.push(getItems);
        chooseIDX.push(id);
      });
      this.relationList = chooseData;
      this.relationValue = chooseIDX;
      this.copyRelationValue = chooseIDX;
      // console.log(this.relationList, this.relationValue);
    },
    /* 獲取所選專卷分類 */
    getProjData(val) {
      if (!!val) {
        const getFather = this.projThemeList.filter(
          (res) => res.name == val
        )[0];
        let childData = [];
        getFather.children.forEach((element) => {
          childData.push(element.name);
        });
        this.rightBoxData = {
          projSort: getFather?.name,
          remark: getFather?.memo,
          projTheme: childData,
        };
      } else {
        this.rightBoxData = {};
      }
      this.getRelationList();
    },
    /* 選擇專卷主題並帶入現有分析內容 */
    async chooseTheme(val) {
      this.$store.dispatch("loadingHandler", true);
      /* 檢查是否已選擇主題 */
      const getNews = this.relationList.filter((resp) => resp.value !== "主題");
      const getTheme = this.getChild(this.projThemeList)[0]?.children.filter(
        (res) => res.name == val
      )[0];

      /* 有選擇主題時解鎖新聞 */
      if (val) {
        getNews.map((item) => {
          item.disabled = false;
          return item;
        });
      }

      const topicQuery = {
        UserId: JSON.parse(window.localStorage.getItem("userInfo"))?.userId,
        TopicId: this.getTheme.id,
        Page: 1,
        PageSize: 10,
      };
      await this.$api.getDataByTopicId(topicQuery).then((res) => {
        if (res.data.length > 0) {
          const getSaveIds = res.data.map((item) => item.newsId);
          this.relationValue = this.relationValue.filter(
            (i) => !getSaveIds.includes(i)
          );
        } else {
          this.relationValue = this.copyRelationValue;
        }
        this.$store.dispatch("loadingHandler", false);
      });
    },
    /* 新增專卷分類 */
    addSort() {
      this.$refs.ruleForm_addProjSort.validate((valid) => {
        if (valid) {
          const sortQuery = {
            OrgId: 2,
            UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
            Name: this.addProjSort.name,
            Action: "http://localhost/aaa",
            Memo: "",
            SortOrder: 1,
            Pid: null,
            isShare: 0,
            isActive: 1,
          };
          this.$api.addUserTopic(sortQuery).then((res) => {
            if (res.data) {
              this.$notify({
                title: "成功",
                message: "新增成功！",
                type: "success",
              });
              this.getProjSortList();
              this.openAddProjSort = false;
            }
          });
        }
      });
    },
    /* 檢查是否有選擇專卷分類 */
    checkSort() {
      if (!!this.searchSort) {
        this.openAddProjTheme = true;
      } else {
        this.$notify({
          title: "警告",
          message: "請先選擇『專卷分類』！",
          type: "warning",
        });
      }
    },
    /* 新增專卷主題 */
    addTheme() {
      this.$refs.ruleForm_addProjTheme.validate((valid) => {
        if (valid) {
          this.$store.dispatch("loadingHandler", true);
          const getData = this.projSortList.filter(
            (res) => res.name == this.searchSort
          )[0];
          const sortQuery = {
            OrgId: getData.orgId,
            UserId: getData.userId,
            Name: this.addProjTheme.name,
            Action: "",
            Memo: this.addProjTheme.remark,
            SortOrder: getData.sortOrder,
            Pid: getData.id,
            isShare: getData.isShare,
            isActive: getData.isActive,
          };
          this.$api.addUserTopic(sortQuery).then((res) => {
            if (res.data) {
              this.getProjSortList();
              // this.searchSort = "";
              this.rightBoxData = {};
              this.openAddProjTheme = false;
              this.$notify({
                title: "成功",
                message: "新增成功！",
                type: "success",
              });
              this.$store.dispatch("loadingHandler", false);
            }
          });
        }
      });
    },

    /* 取得左框資訊 */
    getObject(arr) {
      const getAllValue = this.relationList.map((v) => v.key);
      this.leftRelationIds = getAllValue.filter((i) => !arr.includes(i));
    },
    /* 儲存鈕 */
    saveTopic() {
      const checkValue = this.relationList.filter(
        (i) => !this.relationValue.includes(i.key)
      );
      if (checkValue.length > 0) {
        this.$confirm("確定要儲存嗎？", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$store.dispatch("loadingHandler", true);
            const topicQuery = {
              UserId: JSON.parse(window.localStorage.getItem("userInfo"))
                .userId,
              TopicId: this.getTheme.id,
              NewsId: this.leftRelationIds,
            };
            this.$api.addDataTopic(topicQuery).then((res) => {
              if (res.data) {
                this.$notify({
                  title: "成功",
                  message: "儲存成功！",
                  type: "success",
                });
              } else {
                this.$notify.error({
                  title: "錯誤",
                  message: "未知的錯誤，請重新操作！",
                });
              }
              this.$store.dispatch("loadingHandler", false);
            });
          })
          .catch(() => {});
      } else {
        this.$notify({
          title: "警告",
          message: "現有分析內容無資料！",
          type: "warning",
        });
      }
      return;
    },

    // 搜尋關聯分析內容modal
    /* 取得搜尋來源資料 */
    getSearchList() {
      const searchQuery = {
        sDate: "2020-01-01",
        eDate: "2021-12-31",
      };
      this.$api.getNewsStatics(searchQuery).then((res) => {
        this.searchList = res.data;
      });
    },
    /* 獲取列表 */
    async getNewsList() {
      await this.$api.getNewsList(this.newsListQuery).then((res) => {
        this.tableData = res.data.data;
        this.listNum = res.data.count;
        this.$store.dispatch("loadingHandler", false);
      });
    },
    /* 換頁鈕 */
    handleSizeChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.newsListQuery.pageSize = val;
      this.getNewsList();
    },
    handleCurrentChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.newsListQuery.page = val;
      this.getNewsList();
    },
    /* 表格選擇 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /* 搜尋鈕 */
    searchNewsList() {
      this.$store.dispatch("loadingHandler", true);
      this.newsListQuery.sDate = moment(
        this.searchRelation.dateRange[0]
      ).format("YYYY-MM-DD");
      this.newsListQuery.eDate = moment(
        this.searchRelation.dateRange[1]
      ).format("YYYY-MM-DD");
      this.newsListQuery.query = this.searchRelation.keyword;
      this.newsListQuery.nSite = this.searchRelation.searchFrom;
      this.getNewsList();
    },
    /* 加入候選關聯新聞 */
    join() {
      if (this.multipleSelection.length > 0) {
        this.$store.dispatch("loadingHandler", true);
        this.$router.push({
          name: "projEdit",
          query: {
            chooseID: JSON.stringify(this.multipleSelection.map((i) => i.id)),
          },
        });
        this.getRelationList();
        this.openSearchRelation = false;
        this.$store.dispatch("loadingHandler", false);
      } else {
        this.$notify({
          title: "警告",
          message: "請至少選擇一筆資料！",
          type: "warning",
        });
      }
    },
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    this.getProjSortList();
    this.getSearchList();
    await this.getNewsList();
    this.getRelationList();
  },
};
</script>

<style lang="scss">
.projEdit {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  position: relative;

  &__leftBox {
    width: 250px;
    height: 100%;
    background: #191970;
    display: flex;
    align-items: flex-start;
    border-right: 1px solid black;

    .body {
      width: 95%;
      min-height: 100vh;
      padding: 12px;
      box-sizing: border-box;
      border-right: 1px solid white;

      &__projSort {
        width: 100%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        color: white;

        &--func {
          width: 100%;
          padding: 16px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .el-select {
          width: 150px !important;
        }

        i {
          font-weight: bolder;
          color: white;
          font-size: 24px;
          transition: 0.5s;
          cursor: pointer;

          &:hover {
            transform: scale(1.2);
          }
        }
      }

      &__addTheme {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        span {
          transition: 0.6s;
          cursor: pointer;
          i,
          a {
            padding: 0 2px;
            font-size: 18px;
            font-weight: bold;
            color: white;
          }

          &:hover {
            letter-spacing: 2px;
          }
        }
      }

      &__projTheme {
        width: 100%;
        padding-top: 32px;

        b {
          color: #191970;
          font-size: 18px;
          transition: 0.4s;

          &:hover {
            color: #00abb9;
            letter-spacing: 2px;
          }
        }

        &--active {
          color: #00abb9 !important;
        }
      }
    }

    &--shrinkLeftBox {
      width: 5%;
      min-height: 100vh;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        padding: 16px 0;
        font-weight: bolder;
        font-size: 20px;
        transition: 0.4s;
        cursor: pointer;

        &:hover {
          color: #00abb9;
        }
      }
    }
  }

  &__rightBox {
    width: calc(100% - 250px);
    height: 100%;

    &--infoBox {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
      border-bottom: 1px solid black;

      .childrenItem {
        &::after {
          content: "、";
        }
        &:last-child {
          &::after {
            content: "";
          }
        }

        &__active {
          color: #00abb9;
        }
      }

      a {
        font-weight: bolder;
        color: #191970;
        transition: 0.4s;
        cursor: pointer;

        &:hover {
          color: #00abb9;
        }
      }

      .el-col {
        padding: 8px 0;
        display: flex;
        align-items: center;

        strong {
          color: #191970;
          font-size: 20px;
          letter-spacing: 2px;
        }

        p {
          margin: 0;
          font-size: 18px;
          font-weight: bolder;
          letter-spacing: 3px;
        }
      }
    }

    &--contentBox {
      width: 100%;

      .relationBtn {
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        span {
          display: flex;
          align-items: center;
          transition: 0.5s;
          color: #191970;
          cursor: pointer;

          i {
            font-weight: bolder;
            font-size: 20px;
            padding-right: 4px;
          }

          &:hover {
            transform: scale(1.1);
          }
        }
      }

      .relationList {
        width: 100%;
        padding: 16px 0 32px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid black;

        .el-transfer {
          &__buttons {
            display: flex;
            flex-direction: column;
            padding: 0 16px;

            button {
              margin: 0;

              &:last-child {
                margin-top: 16px;
              }
            }
          }

          &-panel {
            width: 45% !important;

            &__body {
              label {
                span:last-child {
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }

          &-panel__empty {
            display: none !important;
          }
        }
      }

      .relationFuncBtn {
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .modal {
    &__title {
      color: white;
      font-size: 20px;
      letter-spacing: 2.5px;
    }
  }

  .searchRelationModal {
    .el-dialog {
      background: white !important;
    }

    &__searchBox {
      width: 100%;
      padding-bottom: 32px;
      border-bottom: 1px solid black;

      .el-col {
        display: flex;
        align-items: center;

        strong {
          min-width: 90px;
          max-width: 90px;
          font-size: 18px;
        }

        .el-select {
          width: 350px !important;
        }

        button {
          margin-left: 16px;
        }

        &:last-child {
          padding: 32px 80px 0 80px;
        }
      }
    }

    &__listBox {
      width: 100%;
      padding-top: 32px;
    }
  }
}
</style>