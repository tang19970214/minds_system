<template>
  <div class="home">
    <div class="home__searchBox">
      <strong>最近1日新增資料</strong>
      <!-- 長條圖 -->

    </div>

    <div class="home__listBox">
      <div class="home__listBox--joinAnalysis">
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
  name: "Home",
  data() {
    return {
      dayAddNum: "",
      listQuery: {
        //  moment(new Date()).format("YYYY-MM-DD")
        sDate: "2020-01-01",
        eDate: "2021-12-31",
        query: "",
        nSite: "全部",
        nChannel: "全部",
        page: 1,
        pageSize: 10,
      },
      // detailQuery: {},
      staticsQuery: {
        sDate: "2020-01-01",
        eDate: "2021-12-31",
        query: "",
        nSite: "NewsSite",
      },
      tableData: [],
      multipleSelection: [],
    };
  },
  methods: {
    getList() {
      this.$api.getNewsList(this.listQuery).then((res) => {
        this.tableData = res.data;
      });
    },
    // getDetail() {
    //   this.$api.getNewsDetail(this.detailQuery).then((res) => {
    //     console.log("detail", res);
    //   });
    // },
    getStatics() {
      this.$api.getNewsStatics(this.staticsQuery).then((res) => {
        console.log("statics", res);
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
    goProjEdit() {
      let routeUrl = this.$router.resolve({ name: "projEdit" });
      window.open(routeUrl.href, "_blank");
    },
  },
  mounted() {
    this.getList();
    this.getStatics();
  },
};
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100vh;

  &__searchBox {
    padding: 20px;
    border-bottom: 1px solid #191972;

    strong {
      font-size: 24px;
      color: #191972;
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