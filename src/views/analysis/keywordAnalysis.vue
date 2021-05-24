<template>
  <div class="keywordAnalysis">
    <transition name="moveT">
      <div class="keywordAnalysis__searchBox" v-if="openSearchBox">
        <div class="keywordAnalysis__searchBox--dateRange">
          <div class="sDate">
            <div class="sDate__title">
              <label>分析來源：</label>
            </div>
            <el-select v-model="listQuery.TermTypeId" placeholder="請選擇詞庫類別" no-data-text="無數據">
              <el-option label="請選擇" :value="0"></el-option>
              <el-option label="新聞" value="新聞"></el-option>
            </el-select>
          </div>
          <div class="eDate">
            <div class="eDate__title">
              <label>關鍵字搜尋：</label>
            </div>
            <el-input v-model="listQuery.Query"> </el-input>
          </div>
        </div>

        <div class="keywordAnalysis__searchBox--kindAndSort">
          <div class="kind">
            <div class="kind__title">
              <label>分析日期：</label>
            </div>
            <el-date-picker v-model="daterange" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期">
            </el-date-picker>
          </div>

          <div class="func">
            <el-button type="primary" @click="searchWord()">分析</el-button>
          </div>
        </div>

      </div>
    </transition>

    <div class="keywordAnalysis__setting" @click="openSearchBox = !openSearchBox">
      <i class="el-icon-caret-bottom" :class="{'goRound': openSearchBox}"></i>
    </div>

    <div class="keywordAnalysis__listBox">
      <div class="keywordAnalysis__listBox--add">
        <span v-if="multipleSelection.length == 0" @click="cannotCSV()">
          <i class="el-icon-s-data"></i>
          <a>匯出</a>
        </span>
        <span v-else>
          <download-csv :data="multipleSelection" :name="'關鍵字分析.csv'">
            <i class="el-icon-s-data"></i>
            <a>匯出</a>
          </download-csv>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" empty-text="暫無數據">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序號" width="60"></el-table-column>
        <el-table-column label="關鍵字" prop="term"></el-table-column>
        <el-table-column label="詞頻" prop="termTypeId"></el-table-column>
        <el-table-column label="關聯關鍵字" prop="memo"></el-table-column>
      </el-table>
    </div>
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
        Page: 1,
        PageSize: 10,
      },
      daterange: null,
      entityList: [],
      tableData: [],
      multipleSelection: [],
      // openAddkeywordAnalysis: false,
      // addkeywordAnalysis: {
      //   UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
      //   OrgId: 1,
      //   Term: "",
      //   POS: 128,
      //   Freq: 20000,
      //   TermTypeId: 3,
      //   EntityTypeId: "",
      //   memo: "",
      // },
      // rules_openAddkeywordAnalysis: {
      //   Term: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      //   memo: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      // },
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
    getEntityTypeList() {
      this.$api
        .getEntityTypeList({
          UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        })
        .then((res) => {
          this.entityList = res.data;
        });
    },
    async getList() {
      await this.$api.getTermInfoList(this.listQuery).then((res) => {
        console.log(res);
        this.tableData = res.data;
        this.$store.dispatch("loadingHandler", false);
      });
    },
    searchWord() {
      this.listQuery.sDate = this.daterange
        ? moment(this.daterange[0]).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");
      this.listQuery.eDate = this.daterange
        ? moment(this.daterange[1]).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");
      this.$store.dispatch("loadingHandler", true);
      this.getList();
    },
    // addEntity() {
    //   console.log(this.addkeywordAnalysis);
    // },
    editkeywordAnalysis(data) {},
    delkeywordAnalysis(data) {},
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
      console.log(val);
    },
    cannotCSV() {
      this.$notify.error({
        title: "錯誤",
        message: "請選擇欲匯出之項目",
      });
    },
  },
  mounted() {
    this.$store.dispatch("loadingHandler", true);
    this.getList();
  },
};
</script>

<style lang="scss">
.keywordAnalysis {
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

    &--dateRange {
      width: 100%;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

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
          max-width: 350px !important;
        }
      }
    }

    &--kindAndSort {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .kind,
      .func {
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

  // .addkeywordAnalysisModal {
  //   .el-dialog {
  //     &__body {
  //       strong {
  //         font-size: 20px;
  //         text-decoration: underline;
  //         letter-spacing: 2px;
  //       }
  //     }
  //   }
  // }
}
</style>