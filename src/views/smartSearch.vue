<template>
  <div class="smartSearchPage">
    <div class="smartSearchPage__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="smartSearchPage__searchBox" v-if="openSearchBox">
        <div class="smartSearchPage__searchBox--dateAndFrom">
          <div class="datetime">
            <label>查詢日期：</label>
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期">
            </el-date-picker>
          </div>

          <div class="searchFrom">
            <label>查詢來源：</label>
            <el-select v-model="searchFrom" placeholder="請選擇查詢來源" no-data-text="無數據">
              <el-option label="請選擇" value=""></el-option>
              <el-option v-for="item in searchList" :key="item.id" :label="item.gKey" :value="item.gKey"></el-option>
            </el-select>
          </div>
        </div>

        <div class="smartSearchPage__searchBox--searchStr">
          <el-input v-model="searchKeyword"></el-input>
          <el-button type="primary" @click="searchNews">搜尋</el-button>
        </div>
      </div>
    </transition>

    <div class="smartSearchPage__listBox">
      <div class="smartSearchPage__listBox--joinAnalysis">
        <span @click="goProjEdit()">
          <i class="el-icon-circle-plus-outline"></i>
          <a>加入專卷分析</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" empty-text="暫無數據">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column label="序號" type="index" width="50">
        </el-table-column>
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
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      listQuery: {
        userId: 1,
        sDate: "2021-01-01",
        eDate: "2021-12-31",
        query: "",
        nSite: "全部",
        nChannel: "全部",
        page: 1,
        pageSize: 10,
      },
      openSearchBox: true,
      dateRange: "",
      searchFrom: "",
      searchKeyword: "",
      searchList: [],
      tableData: [],
      multipleSelection: [],
    };
  },
  methods: {
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

    /* 取得表格資料 */
    async getList() {
      await this.$api.getNewsList(this.listQuery).then((res) => {
        this.tableData = res.data.data;
        this.$store.dispatch("loadingHandler", false);
      });
    },
    searchNews() {
      if (!this.dateRange && !this.searchFrom && !this.searchKeyword) {
        this.listQuery = {
          userId: 1,
          sDate: "2021-01-01",
          eDate: "2021-12-31",
          query: "",
          nSite: "全部",
          nChannel: "全部",
          page: 1,
          pageSize: 10,
        };
        this.getList();
      } else {
        this.listQuery = {
          userId: 1,
          sDate: this.dateRange
            ? moment(this.dateRange[0]).format("YYYY-MM-DD")
            : "2020-01-01",
          eDate: this.dateRange
            ? moment(this.dateRange[1]).format("YYYY-MM-DD")
            : "2021-12-31",
          query: this.searchKeyword,
          nSite: this.searchFrom,
          nChannel: "全部",
          page: 1,
          pageSize: 10,
        };
      }
      this.getList();
    },

    goProjEdit() {
      let routeUrl = this.$router.resolve({ name: "projEdit" });
      window.open(routeUrl.href, "_blank");
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
    this.getSearchList();
    this.getList();
  },
};
</script>

<style lang="scss">
.smartSearchPage {
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
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-bottom: 1px solid #191972;

    &--dateAndFrom {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      label {
        font-weight: 600;
        color: #2a2a2a;
        letter-spacing: 2px;
        font-size: 18px;
      }

      .searchFrom {
        .el-select {
          min-width: 350px !important;
        }
      }
    }

    &--searchStr {
      width: 100%;
      padding-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      .el-input {
        max-width: 500px;
        margin-right: 8px;
      }
    }
  }

  &__listBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

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