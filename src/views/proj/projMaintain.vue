<template>
  <div class="projMaintain">
    <div class="projMaintain__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="projMaintain__searchBox" v-if="openSearchBox">
        <!-- 專卷分類 -->
        <div class="projMaintain__searchBox--sort">
          <label>專卷分類：</label>
          <el-select v-model="projSort" placeholder="請選擇專卷分類" no-data-text="無數據" @change="clearTheme">
            <el-option label="請選擇" value=""></el-option>
            <el-option :label="item.name" :value="item.name" v-for="item in sortList" :key="item.id"></el-option>
          </el-select>
          <i class="el-icon-edit" @click="openProjSortModal('edit')"></i>
          <i class="el-icon-plus" @click="openProjSortModal('add')"></i>
          <i class="el-icon-delete-solid" @click="openProjSortModal('del')"></i>
        </div>

        <!-- 專卷主題 -->
        <div class="projMaintain__searchBox--theme">
          <label>專卷主題：</label>
          <el-select v-model="projTheme" placeholder="請選擇專卷主題" v-if="getChild(themeList).length > 0" no-data-text="無數據" @change="getThemeItem">
            <el-option :label="item.name" :value="item.name" v-for="item in getChild(themeList)[0].children" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="projTheme" placeholder="請先選擇專卷分類" :disabled="!projSort" v-else></el-select>
          <i class="el-icon-edit" @click="openProjThemeModal('edit')"></i>
          <i class="el-icon-plus" @click="openProjThemeModal('add')"></i>
          <i class="el-icon-delete-solid" @click="openProjThemeModal('del')"></i>
        </div>
      </div>
    </transition>

    <div class="projMaintain__listBox">
      <el-row>
        <el-col :span="16">
          <div class="projMaintain__listBox--info">
            <strong>備註：{{projThemeInfo.memo}}</strong>
            <strong>建立人：{{getCreateUser(projThemeInfo.userId)}}</strong>
            <strong>建立時間：{{projThemeInfo.createdTime | moment("YYYY-MM-DD HH:mm:ss")}}</strong>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="projMaintain__listBox--joinAnalysis">
            <span @click="editProjEdit()">
              <i class="el-icon-circle-plus-outline"></i>
              <a>編輯分析專卷</a>
            </span>
          </div>
        </el-col>
      </el-row>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" empty-text="暫無數據">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column label="序號" type="index" width="50">
        </el-table-column>
        <el-table-column label="新聞標題" prop="newsTitle">
        </el-table-column>
        <el-table-column label="建立時間" width="200">
          <template slot-scope="scope">{{ scope.row.createdTime | moment("YYYY-MM-DD HH:mm") }}</template>
        </el-table-column>
      </el-table>
    </div>

    <!-- modal -->
    <!-- 專卷分類 -->
    <el-dialog :title="projSortModalTitle + '專卷分類'" :visible.sync="projSortModal" width="60%" center>
      <el-form :model="projSortList" :rules="rules_projSortModal" ref="ruleForm_projSortModal" label-width="150px">
        <el-form-item label="專卷名稱" prop="name">
          <el-input v-model="projSortList.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProjSort" v-if="projSortModalTitle == '新增'">儲存</el-button>
        <el-button type="primary" @click="editProjSort" v-else>修改</el-button>
        <el-button type="danger" @click="projSortModal = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 專卷主題 -->
    <el-dialog :title="projThemeModalTitle + '專卷主題'" :visible.sync="projThemeModal" width="60%" center>
      <el-form :model="projThemeList" :rules="rules_projThemeModal" ref="ruleForm_projThemeModal" label-width="150px">
        <el-form-item label="專卷分類">
          <strong class="themeModal">{{projSort}}</strong>
        </el-form-item>
        <el-form-item label="專卷主題" prop="theme">
          <el-input v-model="projThemeList.theme"></el-input>
        </el-form-item>
        <el-form-item label="備註" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="projThemeList.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProjTheme" v-if="projThemeModalTitle == '新增'">儲存</el-button>
        <el-button type="primary" @click="editProjTheme" v-else>修改</el-button>
        <el-button type="danger" @click="projThemeModal = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allUserList: [],
      openSearchBox: true,
      tableData: [],
      multipleSelection: [],
      /* 專卷分類 */
      projSort: "",
      sortList: [],
      projSortModal: false,
      projSortModalTitle: "",
      projSortList: {
        name: "",
      },
      rules_projSortModal: {
        name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },
      /* 專卷主題 */
      projTheme: "",
      themeList: [],
      projThemeModal: false,
      projThemeModalTitle: "",
      projThemeList: {
        sort: "",
        theme: "",
        remark: "",
      },
      rules_projThemeModal: {
        theme: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        remark: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },
      /* 專卷主題資訊 */
      projThemeInfo: {},
    };
  },
  computed: {
    getChild() {
      return (data) => {
        const getChildItem =
          data.filter((res) => res.name == this.projSort) || [];
        return getChildItem;
      };
    },
    getCreateUser() {
      return (id) => {
        const userInfo = this.allUserList.filter((res) => res.id == id)[0];
        return userInfo?.name;
      };
    },
  },
  methods: {
    /* 獲取comId下所有使用者(用於篩選建立人ID) */
    async getUser() {
      await this.$api
        .getUserList({
          ComId: JSON.parse(window.localStorage.getItem("userInfo")).comId,
        })
        .then((res) => {
          this.allUserList = res.data;
          this.$store.dispatch("loadingHandler", false);
        });
    },
    /* 獲取專卷資料 */
    getProjSort() {
      this.$api
        .getUserTopic({
          UserId: JSON.parse(window.localStorage.getItem("userInfo"))?.userId,
        })
        .then((res) => {
          this.sortList = res.data.filter((resp) => resp.pid == null);
          const childrenList = res.data.filter((sup) => sup.pid !== null);
          this.themeList = this.sortList.map((p) => {
            p.children = childrenList.filter((c) => {
              return c.pid === p.id;
            });
            return p;
          });
        });
    },
    /* 獲取表格資料 */
    async getList(topicId) {
      const listQuery = {
        UserId: JSON.parse(window.localStorage.getItem("userInfo"))?.userId,
        TopicId: topicId,
        Page: 1,
        PageSize: 99999,
      };
      await this.$api.getDataByTopicId(listQuery).then((res) => {
        this.tableData = res.data;
        this.$store.dispatch("loadingHandler", false);
      });
    },

    /* ============================================ */
    // 專卷分類
    openProjSortModal(val) {
      switch (val) {
        case "edit":
          if (!!this.projSort) {
            this.projSortModalTitle = "編輯";
            this.projSortModal = true;
            this.projSortList.name = this.projSort;
          } else {
            this.$notify({
              title: "警告",
              message: "請先選擇欲修改之專卷分類！",
              type: "warning",
            });
          }
          break;
        case "add":
          this.projSortModalTitle = "新增";
          this.projSortModal = true;
          break;
        case "del":
          if (!!this.projSort) {
            this.$confirm(
              "確定要刪除專卷分類：『" + this.projSort + "』嗎？",
              "提示",
              {
                confirmButtonText: "確定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                this.delProjSort();
              })
              .catch(() => {});
          } else {
            this.$notify({
              title: "警告",
              message: "請先選擇欲刪除之專卷分類！",
              type: "warning",
            });
          }
          break;
      }
    },
    /* 新增-專卷分類 */
    addProjSort() {
      this.$refs.ruleForm_projSortModal.validate((valid) => {
        if (valid) {
          const addList = {
            OrgId: 2,
            UserId: JSON.parse(window.localStorage.getItem("userInfo"))?.userId,
            Name: this.projSortList.name,
            Action: "",
            Memo: "",
            SortOrder: 1,
            Pid: null,
            isShare: 0,
            isActive: 1,
          };
          this.$api.addUserTopic(addList).then((res) => {
            this.projSortModal = false;
            this.projSort = "";
            this.getProjSort();
            this.$notify({
              title: "成功",
              message: "新增成功！",
              type: "success",
            });
          });
        }
      });
    },
    /* 編輯-專卷分類 */
    editProjSort() {
      this.$refs.ruleForm_projSortModal.validate((valid) => {
        if (valid) {
          const getData = this.sortList.filter(
            (res) => res.name == this.projSort
          )[0];
          const editList = {
            Id: getData.id,
            OrgId: getData.orgId,
            UserId: getData.userId,
            Name: this.projSortList.name,
            Action: getData.action,
            Memo: getData.memo,
            SortOrder: getData.sortOrder,
            Pid: getData.pid,
            isShare: getData.isShare,
            isActive: getData.isActive,
          };
          this.$api.updateUserTopic(editList).then((res) => {
            if (res.data) {
              this.$notify({
                title: "成功",
                message: "修改成功！",
                type: "success",
              });
              this.projSortModal = false;
              this.projSort = "";
              this.getProjSort();
            }
          });
        }
      });
    },
    /* 刪除-專卷分類 */
    async delProjSort() {
      const getData = this.sortList.filter(
        (res) => res.name == this.projSort
      )[0];
      const getID = [getData.id];
      if (getData.children.length > 0) {
        getData.children.map((res) => {
          getID.push(res.id);
        });
      }
      const delList = {
        UserId: getData.userId,
        Ids: getID,
      };
      await this.$api.deleteUserTopic(delList).then((res) => {
        if (res.data) {
          this.$notify({
            title: "成功",
            message: "已成功刪除！",
            type: "success",
          });
          this.projSort = "";
          this.getProjSort();
        }
      });
    },
    /* ---------------------------------- */
    // 專卷主題
    openProjThemeModal(val) {
      switch (val) {
        case "edit":
          if (!!this.projTheme) {
            this.projThemeModalTitle = "編輯";
            this.projThemeModal = true;
            // 撈取子層資料帶入modal輸入框
            const getFather = this.sortList.filter(
              (res) => res.name == this.projSort
            )[0];
            const getChild = getFather.children.filter(
              (resp) => resp.name == this.projTheme
            )[0];
            this.projThemeList = {
              theme: getChild.name,
              remark: getChild.memo,
            };
          } else {
            this.$notify({
              title: "警告",
              message: "請先選擇欲修改之專卷主題！",
              type: "warning",
            });
          }
          break;
        case "add":
          if (!!this.projSort) {
            this.projThemeList = {};
            this.projThemeModalTitle = "新增";
            this.projThemeModal = true;
          } else {
            this.$notify({
              title: "警告",
              message: "請先選擇專卷分類！",
              type: "warning",
            });
          }
          break;
        case "del":
          if (!!this.projTheme) {
            this.$confirm(
              "確定要刪除專卷主題：『" + this.projTheme + "』嗎？",
              "提示",
              {
                confirmButtonText: "確定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                this.delProjTheme();
              })
              .catch(() => {});
          } else {
            this.$notify({
              title: "警告",
              message: "請先選擇欲刪除之專卷主題！",
              type: "warning",
            });
          }
          break;
      }
    },
    /* 新增-專卷主題 */
    addProjTheme() {
      this.$refs.ruleForm_projThemeModal.validate((valid) => {
        if (valid) {
          const getData = this.sortList.filter(
            (res) => res.name == this.projSort
          )[0];
          const addList = {
            OrgId: getData.orgId,
            UserId: getData.userId,
            Name: this.projThemeList.theme,
            Action: getData.action,
            Memo: this.projThemeList.remark,
            SortOrder: getData.sortOrder,
            Pid: getData.id,
            isShare: getData.isShare,
            isActive: getData.isActive,
          };
          this.$api.addUserTopic(addList).then((res) => {
            if (res.data) {
              this.projThemeModal = false;
              this.projTheme = "";
              this.getProjSort();
              this.$notify({
                title: "成功",
                message: "新增成功！",
                type: "success",
              });
            }
          });
        }
      });
    },
    /* 編輯-專卷主題 */
    editProjTheme() {
      this.$refs.ruleForm_projThemeModal.validate((valid) => {
        if (valid) {
          // 撈取子層資料帶入modal輸入框
          const getFather = this.sortList.filter(
            (res) => res.name == this.projSort
          )[0];
          const getChild = getFather.children.filter(
            (resp) => resp.name == this.projTheme
          )[0];
          const editList = {
            Id: getChild.id,
            OrgId: getChild.orgId,
            UserId: getChild.userId,
            Name: this.projThemeList.theme,
            Action: getChild.action,
            Memo: this.projThemeList.remark,
            SortOrder: getChild.sortOrder,
            Pid: getChild.pid,
            isShare: getChild.isShare,
            isActive: getChild.isActive,
          };
          this.$api.updateUserTopic(editList).then((res) => {
            if (res.data) {
              this.projThemeModal = false;
              this.projTheme = "";
              this.getProjSort();
              this.$notify({
                title: "成功",
                message: "修改成功！",
                type: "success",
              });
            }
          });
        }
      });
    },
    /* 刪除-專卷主題 */
    async delProjTheme() {
      // 撈取子層資料帶入modal輸入框
      const getFather = this.sortList.filter(
        (res) => res.name == this.projSort
      )[0];
      const getChild = getFather.children.filter(
        (resp) => resp.name == this.projTheme
      )[0];
      const delList = {
        UserId: getChild.userId,
        Ids: [getChild.id],
      };
      await this.$api.deleteUserTopic(delList).then((res) => {
        if (res.data) {
          this.$notify({
            title: "成功",
            message: "修改成功！",
            type: "success",
          });
          this.projTheme = "";
          this.getProjSort();
        }
      });
    },
    /* =========================================== */

    // 清除專卷主題選項
    clearTheme() {
      this.projTheme = "";
      this.projThemeInfo = {};
    },
    // 獲取所選專卷主題之資料
    getThemeItem(val) {
      this.$store.dispatch("loadingHandler", true);
      // 撈取子層資料帶入modal輸入框
      const getFather = this.sortList.filter(
        (res) => res.name == this.projSort
      )[0];
      this.projThemeInfo = getFather.children.filter(
        (resp) => resp.name == this.projTheme
      )[0];
      this.getList(this.projThemeInfo.id);
    },

    // 編輯分析專卷
    editProjEdit() {
      if (this.multipleSelection.length > 0) {
        const dataID = [];
        this.multipleSelection.forEach((element) => {
          dataID.push(element.newsId);
        });
        let routeUrl = this.$router.resolve({
          name: "projEdit",
          query: { chooseID: JSON.stringify(dataID) },
        });
        window.open(routeUrl.href, "_blank");
      } else {
        this.$notify.error({
          title: "錯誤",
          message: "請選擇至少一項項目！",
        });
      }
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  mounted() {
    this.$store.dispatch("loadingHandler", true);
    this.getUser();
    this.getProjSort();
  },
};
</script>

<style lang="scss">
.projMaintain {
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

    label {
      font-weight: 600;
      color: #2a2a2a;
      letter-spacing: 2px;
      font-size: 18px;
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

    &--sort {
      width: 100%;
      display: flex;
      align-items: center;
    }

    &--theme {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: 20px;
    }
  }

  &__listBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    .el-row {
      padding-bottom: 20px !important;
    }

    &--info {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;

      strong {
        color: #2a2a2a;
        letter-spacing: 2px;
        line-height: 28px;
        font-size: 18px;
      }
    }

    &--joinAnalysis {
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      text-align: right;

      span {
        transition: 0.6s;
        cursor: pointer;
        i,
        a {
          font-size: 18px;
          font-weight: bold;
          color: #191972;
        }

        &:hover {
          letter-spacing: 2px;
        }
      }
    }
  }

  .themeModal {
    font-size: 24px;
    color: white;
    text-decoration: underline;
  }
}
</style>