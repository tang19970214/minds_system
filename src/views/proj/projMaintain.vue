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
          <el-select v-model="projSort" placeholder="請選擇專卷分類">
            <el-option label="請選擇" value="">
            </el-option>
          </el-select>
          <i class="el-icon-edit" @click="openProjSortModal('edit')"></i>
          <i class="el-icon-plus" @click="openProjSortModal('add')"></i>
          <i class="el-icon-delete-solid" @click="openProjSortModal('del')"></i>
        </div>

        <!-- 專卷主題 -->
        <div class="projMaintain__searchBox--theme">
          <label>專卷主題：</label>
          <el-select v-model="projTheme" placeholder="請選擇專卷主題">
            <el-option label="請選擇" value="">
            </el-option>
          </el-select>
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
            <strong>備註：配合政策發展</strong>
            <strong>建立人：Peter</strong>
            <strong>建立時間：2021/01/20 01:24:00</strong>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="projMaintain__listBox--joinAnalysis">
            <span>
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
        <el-table-column label="建立人" prop="newsTitle" width="100">
        </el-table-column>
        <el-table-column label="建立時間" width="200">
          <template slot-scope="scope">{{ scope.row.createdTime | moment("YYYY-MM-DD HH:mm") }}</template>
        </el-table-column>
        <el-table-column label="專卷內容標題" prop="title">
        </el-table-column>
        <el-table-column label="備註" prop="remark">
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
          <el-input v-model="projThemeList.sort"></el-input>
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
      openSearchBox: true,
      listQuery: {
        UserId: 3,
        TopicId: 16,
        Page: 1,
        PageSize: 10,
      },
      /* 專卷分類 */
      projSort: "",
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

      tableData: [],
      multipleSelection: [],
    };
  },
  methods: {
    getProjSort() {
      const sortList = {};
      this.$api.getUserTopic().then((res) => {
        console.log(res);
      });
    },
    getList() {
      this.$api.getDataByTopicId(this.listQuery).then((res) => {
        this.tableData = res.data;
      });
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
    // 專卷分類
    openProjSortModal(val) {
      switch (val) {
        case "edit":
          if (!!this.projSort) {
            this.projSortModalTitle = "編輯";
            this.projSortModal = true;
          } else {
            this.$message({
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
            this.$confirm("確定要刪除此專卷分類嗎？", "提示", {
              confirmButtonText: "確定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delProjSort();
              })
              .catch(() => {});
          } else {
            this.$message({
              message: "請先選擇欲修改之專卷分類！",
              type: "warning",
            });
          }
          break;
      }
    },
    async addProjSort() {
      const addList = {
        OrgId: 2,
        UserId: 3,
        Name: this.projSortList.name,
        Action: "http://localhost/aaa",
        Memo: "測試",
        SortOrder: 1,
        Pid: null,
        isShare: 0,
        isActive: 1,
      };
      await this.$api.addUserTopic(addList);
      this.projSortModal = false;
      this.$message({
        message: "新增成功！",
        type: "success",
      });
    },
    async editProjSort() {
      const editList = {
        Id: 11,
        OrgId: 2,
        UserId: 3,
        Name: this.projSortList.name,
        Action: "http://localhost/aaa",
        Memo: "測試1",
        SortOrder: 1,
        Pid: null,
        isShare: 0,
        isActive: 1,
      };
      await this.$api.updateUserTopic(editList).then((res) => {
        console.log(res);
      });
    },
    delProjSort() {
      const delList = {
        UserId: 2,
        Ids: [11, 12],
      };
    },
    // 專卷主題
    openProjThemeModal(val) {
      switch (val) {
        case "edit":
          if (!!this.projTheme) {
            this.projThemeModalTitle = "編輯";
            this.projThemeModal = true;
          } else {
            this.$message({
              message: "請先選擇欲修改之專卷主題！",
              type: "warning",
            });
          }
          break;
        case "add":
          this.projThemeModalTitle = "新增";
          this.projThemeModal = true;
          break;
        case "del":
          if (!!this.projTheme) {
            this.$confirm("確定要刪除此專卷主題嗎？", "提示", {
              confirmButtonText: "確定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delProjTheme();
              })
              .catch(() => {});
          } else {
            this.$message({
              message: "請先選擇欲修改之專卷主題！",
              type: "warning",
            });
          }
          break;
      }
    },
    editProjTheme() {},
    addProjTheme() {},
    delProjTheme() {},
  },
  mounted() {
    this.getList();
    // this.getProjSort();
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
}
</style>