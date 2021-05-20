<template>
  <div class="filterManage">
    <div class="filterManage__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="filterManage__searchBox" v-if="openSearchBox">
        <div class="filterManage__searchBox--dateRange">
          <div class="sDate">
            <div class="sDate__title">
              <label>開始日期：</label>
            </div>
            <el-date-picker v-model="listQuery.sDate" type="date" placeholder="請選擇開始日期" format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="eDate">
            <div class="eDate__title">
              <label>結束日期：</label>
            </div>
            <el-date-picker v-model="listQuery.eDate" type="date" placeholder="請選擇開始日期">
            </el-date-picker>
          </div>
        </div>

        <div class="filterManage__searchBox--searchStr">
          <div class="keyword">
            <label>關鍵字：</label>
            <el-input v-model="listQuery.Query"></el-input>
          </div>
          <el-button type="primary" @click="searchWord()">查詢</el-button>
        </div>
      </div>
    </transition>

    <div class="filterManage__listBox">
      <div class="filterManage__listBox--add">
        <span @click="openAddWordManage = true">
          <i class="el-icon-plus"></i>
          <a>新增</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" :cell-style="{padding: '3px', height: '20px'}" tooltip-effect="dark" style="width: 100%" empty-text="暫無數據">
        <el-table-column type="index" label="序號" width="60"></el-table-column>
        <el-table-column label="關鍵字" prop="term"></el-table-column>
        <el-table-column label="詞頻" prop="termTypeId" width="100"></el-table-column>
        <el-table-column label="備註" prop="memo"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <div>
              <el-tooltip effect="dark" content="編輯" placement="bottom">
                <el-button type="text" @click="editWordManageModal(scope.row)">
                  <i class="el-icon-edit"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip effect="dark" content="刪除" placement="bottom">
                <el-button type="text" @click="delWordManage(scope.row)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <Page :listNum="listNum" :getPageSize="listQuery.PageSize" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
    </div>

    <!-- modal -->
    <el-dialog class="addWordManageModal" :title="'新增『過濾詞』'" :visible.sync="openAddWordManage" width="50%" center>
      <el-form :model="addWordManage" :rules="rules_openAddWordManage" ref="ruleForm_openAddWordManage" label-width="130px">
        <el-form-item label="詞庫類別">
          <strong>過濾詞</strong>
        </el-form-item>
        <el-form-item label="過濾詞" prop="Term">
          <el-input v-model="addWordManage.Term"></el-input>
        </el-form-item>
        <el-form-item label="備註">
          <el-input type="textarea" v-model="addWordManage.Memo" :autosize="{ minRows: 5, maxRows: 8}"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEntity()">新增</el-button>
        <el-button type="danger" @click="openAddWordManage = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog class="editWordManageModal" title="編輯詞庫" :visible.sync="openEditWordManage" width="50%" center>
      <el-form :model="editWordManage" :rules="rules_openEditWordManage" ref="ruleForm_openEditWordManage" label-width="130px">
        <el-form-item label="詞庫類別">
          <strong>過濾詞</strong>
        </el-form-item>
        <el-form-item :label="editWordManageTitle + '分類'" prop="term">
          <el-input v-model="editWordManage.term"></el-input>
        </el-form-item>
        <el-form-item label="備註" prop="memo">
          <el-input type="textarea" v-model="editWordManage.memo" :autosize="{ minRows: 5, maxRows: 8}"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editEntity()">確認</el-button>
        <el-button type="danger" @click="openEditWordManage = false">取消</el-button>
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
      openSearchBox: true,
      listQuery: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        OrgId: 1,
        Query: "", // keyword
        TermTypeId: 2, // 選擇詞庫類別
        EntityTypeId: 0, // 選擇實體詞分類
        sDate: moment().format("YYYY-MM-DD"),
        eDate: moment().add(1, "day").format("YYYY-MM-DD"),
        Page: 1,
        PageSize: 10,
      },
      wordClassList: [],
      tableData: [],

      /* page component */
      listNum: null,

      /* add Modal */
      openAddWordManage: false,
      addWordManage: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        OrgId: 1,
        Term: "",
        Pos: 1,
        Freq: 10000,
        TermTypeId: 2,
        EntityTypeId: 0,
        Memo: "",
        BatchNo: "",
      },
      rules_openAddWordManage: {
        Term: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },

      /* edit Modal */
      openEditWordManage: false,
      editWordManage: {},
      editWordManageTitle: "",
      rules_openEditWordManage: {
        term: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        memo: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },
    };
  },
  methods: {
    async getList() {
      await this.$api.getTermInfoList(this.listQuery).then((res) => {
        this.tableData = res.data.data;
        this.listNum = res.data.count;
        this.$store.dispatch("loadingHandler", false);
      });
    },
    searchWord() {
      this.listQuery.sDate = moment(this.listQuery.sDate).format("YYYY-MM-DD");
      this.listQuery.eDate = moment(this.listQuery.eDate).format("YYYY-MM-DD");
      this.$store.dispatch("loadingHandler", true);
      this.getList();
    },
    /* 開啟新增詞庫類別modal */
    addEntity() {
      this.$refs.ruleForm_openAddWordManage.validate((valid) => {
        if (valid) {
          this.$store.dispatch("loadingHandler", true);
          this.$api.addTermInfo(this.addWordManage).then((res) => {
            if (res.data) {
              this.$notify({
                title: "成功",
                message: "新增成功",
                type: "success",
              });
            } else {
              this.$notify({
                title: "錯誤",
                message: "未知的錯誤",
                type: "error",
              });
            }
            this.openAddWordManage = false;
            this.getList();
          });
        }
      });
    },
    /* 編輯列表modal */
    editWordManageModal(data) {
      console.log(data);
      this.editWordManage = data;
      this.openEditWordManage = true;
    },
    editEntity() {
      this.$refs.ruleForm_openEditWordManage.validate((valid) => {
        if (valid) {
          this.$store.dispatch("loadingHandler", true);
          this.$api.updateTermInfo(this.editWordManage).then((res) => {
            if (res.data) {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
              });
            } else {
              this.$notify({
                title: "錯誤",
                message: "未知的錯誤",
                type: "error",
              });
            }
            this.openEditWordManage = false;
            this.getList();
          });
        }
      });
    },
    delWordManage(item) {
      this.$confirm("確定要刪除『" + item.term + "』嗎?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("loadingHandler", true);
          const delQuery = {
            UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
            Id: item.id,
          };
          this.$api.deleteTermInfo(delQuery).then((res) => {
            if (res.data) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$notify({
                title: "錯誤",
                message: "未知的錯誤",
                type: "error",
              });
            }
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
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
    /* 換頁鈕 */
    handleSizeChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.listQuery.PageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.listQuery.Page = val;
      this.getList();
    },
  },
  mounted() {
    this.$store.dispatch("loadingHandler", true);
    this.getList();
  },
};
</script>

<style lang="scss">
.filterManage {
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
      min-width: 140px;
      max-width: 140px;
      font-weight: 600;
      color: #2a2a2a;
      letter-spacing: 2px;
      font-size: 18px;
    }

    &--dateRange {
      width: 100%;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .sDate,
      .eDate {
        width: 100%;
        display: flex;
        align-items: center;

        &__title {
          min-width: 140px;
          max-width: 140px;
        }

        .el-input {
          min-width: 350px !important;
        }
      }
    }

    &--searchStr {
      width: 100%;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      .keyword {
        display: flex;
        align-items: center;
        justify-content: center;

        .el-input {
          min-width: 350px;
          max-width: 350px;
          margin-right: 8px;
        }
      }
    }
  }

  &__listBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    &--add {
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
        i {
          padding-right: 4px;
        }

        &:hover {
          letter-spacing: 2px;
        }
      }
    }

    &--tableKeyword {
      display: inline;
      align-items: center;
      &::after {
        content: "、";
      }

      &:last-child {
        &::after {
          content: "";
        }
      }
    }

    .el-table {
      i {
        font-size: 20px;
      }
    }
  }

  .addWordManageModal,
  .editWordManageModal {
    .el-dialog {
      &__body {
        strong {
          font-size: 20px;
          text-decoration: underline;
          letter-spacing: 2px;
        }
      }
    }
  }
}
</style>