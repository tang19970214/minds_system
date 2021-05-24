<template>
  <div class="wordManage">
    <transition name="moveT">
      <div class="wordManage__searchBox" v-if="openSearchBox">
        <div class="wordManage__searchBox--dateRange">
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

        <div class="wordManage__searchBox--kindAndSort">
          <div class="kind">
            <div class="kind__title">
              <label>維護詞庫類別：</label>
            </div>
            <el-select v-model="listQuery.TermTypeId" @change="getWordClass" placeholder="請選擇詞庫類別" no-data-text="無數據">
              <el-option label="請選擇" :value="0"></el-option>
              <el-option :label="item.termName" :value="item.id" v-for="item in wordClassList" :key="item.id"></el-option>
            </el-select>
          </div>

          <div class="sort">
            <div class="sort__title">
              <label>實體詞分類：</label>
            </div>
            <el-select v-model="listQuery.EntityTypeId" placeholder="請選擇" no-data-text="無數據" :disabled="listQuery.TermTypeId !== 3">
              <el-option label="請選擇" :value="0"></el-option>
              <el-option v-for="item in entityList" :key="item.id" :label="item.entityName" :value="item.entityId"></el-option>
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
        <span @click="openAddWordManage = true">
          <i class="el-icon-plus"></i>
          <a>新增</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" empty-text="暫無數據">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序號" width="60"></el-table-column>
        <el-table-column label="實體詞分類">
          {{getEntity(listQuery.EntityTypeId)}}
        </el-table-column>
        <el-table-column label="實體詞名稱" prop="term"></el-table-column>
        <el-table-column label="備註" prop="memo"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <div>
              <el-tooltip effect="dark" content="編輯" placement="bottom">
                <el-button type="text" @click="editWordManage(scope.row)">
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
    </div>

    <!-- modal -->
    <el-dialog class="addWordManageModal" title="新增實體詞" :visible.sync="openAddWordManage" width="50%" center>
      <el-form :model="addWordManage" :rules="rules_openAddWordManage" ref="ruleForm_openAddWordManage" label-width="130px">
        <el-form-item label="詞庫類別">
          <strong>實體詞</strong>
        </el-form-item>
        <el-form-item label="實體詞分類" prop="Term">
          <el-input v-model="addWordManage.Term"></el-input>
        </el-form-item>
        <el-form-item label="備註" prop="memo">
          <el-input type="textarea" v-model="addWordManage.memo" :autosize="{ minRows: 5, maxRows: 8}"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEntity()">新增</el-button>
        <el-button type="danger" @click="openAddWordManage = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      openSearchBox: true,
      listQuery: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        OrgId: 1,
        Query: "", // keyword
        TermTypeId: 0, // 選擇詞庫類別
        EntityTypeId: 0, // 選擇實體詞分類
        sDate: moment().add(-1, "y").format("YYYY-MM-DD"),
        eDate: moment().format("YYYY-MM-DD"),
      },
      wordClassList: [],
      entityList: [],

      tableData: [],
      multipleSelection: [],

      openAddWordManage: false,
      addWordManage: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        OrgId: 1,
        Term: "",
        POS: 128,
        Freq: 20000,
        TermTypeId: 3,
        EntityTypeId: "",
        memo: "",
      },
      rules_openAddWordManage: {
        Term: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
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
        .getTermTypeList({
          UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        })
        .then((res) => {
          this.wordClassList = res.data;
        });
    },
    getEntityTypeList() {
      this.$api
        .getEntityTypeList({
          UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        })
        .then((res) => {
          this.entityList = res.data;
        });
    },
    /* 取得所選詞庫類別 */
    getWordClass(val) {
      if (val == 3) {
        this.getEntityTypeList();
      } else {
        this.listQuery.EntityTypeId = 0;
      }
    },
    async getList() {
      await this.$api.getTermInfoList(this.listQuery).then((res) => {
        console.log(res);
        this.tableData = res.data;
        this.$store.dispatch("loadingHandler", false);
      });
    },
    searchWord() {
      this.listQuery.sDate = moment(this.listQuery.sDate).format("YYYY-MM-DD");
      this.listQuery.eDate = moment(this.listQuery.eDate).format("YYYY-MM-DD");
      this.$store.dispatch("loadingHandler", true);
      this.getList();
    },
    addEntity() {
      console.log(this.addWordManage);
    },
    editWordManage(data) {},
    delWordManage(data) {},
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

  .addWordManageModal {
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