<template>
  <div class="wordManage">
    <transition name="moveT">
      <div class="wordManage__searchBox" v-if="openSearchBox">
        <div class="wordManage__searchBox--kindAndSort">
          <div class="kind">
            <div class="kind__title">
              <label>實體詞分類：</label>
            </div>
            <el-select v-model="getCustDefsCatId" @change="getWordClass" placeholder="請選擇詞庫類別" no-data-text="無數據">
              <el-option label="請選擇" :value="0"></el-option>
              <el-option :label="item.name" :value="item.id" v-for="item in wordClassList" :key="item.id"></el-option>
            </el-select>
          </div>

          <div class="sort">
            <div class="sort__title">
              <label>實體名稱：</label>
            </div>
            <el-select v-model="listQuery.EntityTypeId" placeholder="請選擇" no-data-text="無數據" :disabled="entityList.length == 0">
              <el-option label="請選擇" :value="0"></el-option>
              <el-option v-for="item in entityList" :key="item.id" :label="item.custPosName" :value="item.custPos"></el-option>
            </el-select>
          </div>
        </div>

        <div class="wordManage__searchBox--searchStr">
          <div class="keyword">
            <label>關鍵字：</label>
            <el-input v-model="listQuery.Query"></el-input>
          </div>
          <el-button type="primary" @click="searchWord()">查詢</el-button>
        </div>
      </div>
    </transition>

    <div class="wordManage__setting" @click="openSearchBox = !openSearchBox">
      <i class="el-icon-caret-bottom" :class="{'goRound': openSearchBox}"></i>
    </div>

    <div class="wordManage__listBox">
      <div class="wordManage__listBox--add">
        <span @click="openAddWordManageModal()">
          <i class="el-icon-plus"></i>
          <a>新增</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" :cell-style="{padding: '3px', height: '20px'}" tooltip-effect="dark" style="width: 100%" empty-text="暫無數據">
        <el-table-column type="index" label="序號" width="60"></el-table-column>
        <el-table-column label="實體詞分類">
          {{getEntity(listQuery.EntityTypeId)}}
        </el-table-column>
        <el-table-column label="關鍵字" prop="term"></el-table-column>
        <el-table-column label="詞頻" prop="termTypeId"></el-table-column>
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
    <el-dialog class="addWordManageModal" :title="'新增『' + addWordManageTitle + '』'" :visible.sync="openAddWordManage" width="50%" center>
      <el-form :model="addWordManage" :rules="rules_openAddWordManage" ref="ruleForm_openAddWordManage" label-width="130px">
        <el-form-item label="詞庫類別">
          <strong>實體詞</strong>
        </el-form-item>
        <el-form-item label="實體詞分類" prop="Name">
          <el-input v-model="addWordManage.Name"></el-input>
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
          <strong>實體詞</strong>
        </el-form-item>
        <el-form-item :label="editWordManageTitle + '分類'" prop="term">
          <el-input v-model="editWordManage.term"></el-input>
        </el-form-item>
        <el-form-item label="備註" prop="memo">
          <el-input type="textarea" v-model="editWordManage.memo" :autosize="{ minRows: 5, maxRows: 8}"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editEntity()">新增</el-button>
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
        TermTypeId: 3, // 選擇詞庫類別
        EntityTypeId: 0, // 選擇實體詞分類
        sDate: "1990-01-01",
        eDate: "2050-12-30",
        Page: 1,
        PageSize: 10,
      },
      getCustDefsCatId: "",
      wordClassList: [],
      entityList: [],
      tableData: [],

      /* page component */
      listNum: null,

      /* add Modal */
      openAddWordManage: false,
      addWordManage: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        TermTypeId: "",
        Name: "",
        Memo: "",
      },
      addWordManageTitle: "",
      rules_openAddWordManage: {
        Name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
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
  computed: {
    getEntity() {
      return (id) => {
        return this.entityList?.filter((res) => res.entityId == id)[0]
          ?.entityName;
      };
    },
  },
  methods: {
    getKeyClass() {
      this.$api
        .getCatList({
          UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        })
        .then((res) => {
          this.wordClassList = res.data;
        });
    },
    /* 取得實體詞分類 */
    getWordClass(val) {
      if (!!val) {
        this.getEntityTypeList();
      } else {
        this.listQuery.EntityTypeId = 0;
      }
    },
    getEntityTypeList() {
      let custQuery = {
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        catId: this.getCustDefsCatId,
      };
      this.$api.getCustDefsList(custQuery).then((res) => {
        console.log(res);
        this.entityList = res.data;
      });
    },
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
    openAddWordManageModal() {
      if (!this.getCustDefsCatId) {
        this.$notify({
          title: "警告",
          message: "請選擇欲新增之詞庫類別",
          type: "warning",
        });
      } else {
        this.addWordManageTitle = this.wordClassList.filter(
          (res) => res.id == this.getCustDefsCatId
        )[0].name;
        this.openAddWordManage = true;
      }
    },
    addEntity() {
      this.$refs.ruleForm_openAddWordManage.validate((valid) => {
        if (valid) {
          this.$store.dispatch("loadingHandler", true);
          this.addWordManage.TermTypeId = this.getCustDefsCatId;
          this.$api.addCat(this.addWordManage).then((res) => {
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
          this.$api.updateCat(this.editWordManage).then((res) => {
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
          this.$api.deleteCat(delQuery).then((res) => {
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
    this.getKeyClass();
    this.getList();
  },
};
</script>

<style lang="scss">
.wordManage {
  width: 100%;
  height: 100vh;
  position: relative;

  &__setting {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #191970;

    i {
      font-size: 20px;
      padding: 0 16px;
      transition: 0.4s;
      cursor: pointer;

      &.goRound {
        transform: rotate(180deg);
      }

      &:hover {
        color: #00abb9;
      }
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

    &--kindAndSort {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .kind,
      .sort {
        width: 100%;
        display: flex;
        align-items: center;

        &__title {
          min-width: 140px;
          max-width: 140px;
        }
        .el-select {
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