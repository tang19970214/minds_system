<template>
  <div class="home">
    <div class="home__searchBox">
      <strong>最近1日新增資料</strong>

      <el-tabs tab-position="left">
        <el-tab-pane label="新聞">
          <!-- 長條圖 -->
          <div id="d3Chart" v-if="sampleData.length > 0"></div>
          <div class="home__searchBox--noData" v-else>
            <label>本日無新增資料</label>
          </div>
        </el-tab-pane>
        <el-tab-pane label="判決書">尚無</el-tab-pane>
      </el-tabs>
    </div>

    <div class="home__listBox" id="contentBody">
      <div class="home__listBox--searchKeyboard">
        <strong>搜尋類型：</strong>
        <span>{{listQuery.nSite}}</span>
        <div v-if="listQuery.nSite !== '全部'">
          <i class="el-icon-circle-close" @click="searchAllNews()"></i>
        </div>
      </div>

      <div class="home__listBox--joinAnalysis">
        <span @click="goProjEdit()">
          <i class="el-icon-circle-plus-outline"></i>
          <a>加入專卷分析</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" :cell-style="{padding: '3px', height: '20px'}" style="width: 100%" @selection-change="handleSelectionChange" empty-text="暫無數據">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="序號" type="index" width="50"></el-table-column>
        <el-table-column label="類型" prop="source" width="100"></el-table-column>
        <el-table-column label="新聞標題">
          <template slot-scope="scope">
            <a class="home__listBox--goDetailPage" @click="goDetailPage(scope.row)">{{ scope.row.newsTitle }}</a>
          </template>
        </el-table-column>
        <el-table-column label="新聞時間" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.newsTime | moment("YYYY-MM-DD") }}</div>
            <!--<div>{{ scope.row.newsTime | moment("HH:mm") }}</div>-->
          </template>
        </el-table-column>
        <el-table-column label="新聞網站" prop="newsSite" width="100"></el-table-column>
        <el-table-column label="新聞頻道" prop="newsChannel" width="100"></el-table-column>
        <el-table-column label="情緒指標" prop="sentiment" width="100"></el-table-column>
      </el-table>

      <Page :listNum="listNum" :getPageSize="listQuery.pageSize" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import * as d3 from "d3";
import d3Tip from "d3-tip";

import Page from "../components/Page.vue";

export default {
  name: "Home",
  components: { Page },
  data() {
    return {
      dayAddNum: "",
      listQuery: {
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        sDate: "2020-01-01",
        eDate: "2021-12-31",
        query: "",
        nSite: "全部",
        nChannel: "全部",
        page: 1,
        pageSize: 10,
      },
      listNum: null,
      staticsQuery: {
        sDate: "2021-02-01",
        eDate: "2021-12-31",
      },
      tableData: [],
      selectData: [],
      selectionIds: [],
      sampleData: [],
    };
  },
  methods: {
    getList() {
      this.$api.getNewsList(this.listQuery).then((res) => {
        this.tableData = res.data.data;
        this.listNum = res.data.count;
        // 設置已勾選狀態
        if (this.selectData[this.listQuery.page - 1] !== undefined) {
          var selectUserList = this.selectData[this.listQuery.page - 1];
          this.$nextTick(() => {
            this.tableData.forEach((item) => {
              selectUserList.forEach((items) => {
                if (item.id === items.id) {
                  this.$refs.multipleTable.toggleRowSelection(item, true);
                }
              });
            });
          });
        }
        this.$store.dispatch("loadingHandler", false);
      });
    },
    async getStatics() {
      await this.$api.getNewsStatics(this.staticsQuery).then((res) => {
        this.sampleData = res.data;
      });
    },
    /* 取消搜尋條件 */
    searchAllNews() {
      this.listQuery.nSite = "全部";
      this.getList();
    },
    handleSelectionChange(val) {
      if (val.length !== 0) {
        this.selectData[this.listQuery.page - 1] = val;
      }
      // let reSetelet = [];
      // if (val.length > 0) {
      //   let valIds = val.map((item) => item.id);
      //   let thisTimeSelect = valIds[valIds.length - 1];
      //   if (this.selectionIds.includes(thisTimeSelect)) {
      //     reSetelet = this.selectionIds.filter((id) => id !== thisTimeSelect);
      //   } else {
      //     reSetelet = [...this.selectionIds, thisTimeSelect];
      //   }
      //   console.log(reSetelet);
      //   this.selectionIds = reSetelet;
      // }
      // let restoreData = this.tableData
      //   .map((item, index) => {
      //     return reSetelet.includes(item.id) ? item : false;
      //   })
      //   .filter((item) => item !== false);
      // this.multipleSelection = restoreData;
    },
    /* 換頁鈕 */
    handleSizeChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.listQuery.pageSize = val;
      this.selectData = [];
      this.getList();
    },
    handleCurrentChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.listQuery.page = val;
      this.getList();
    },
    /* 加入專卷分析 */
    goProjEdit() {
      if (this.selectData.length > 0) {
        let routeUrl = this.$router.resolve({
          name: "projEdit",
          query: {
            chooseID: JSON.stringify(this.selectData),
            pageSize: this.listQuery.pageSize,
          },
        });
        window.open(routeUrl.href, "_blank");
      } else {
        this.$notify({
          title: "警告",
          message: "請至少選擇一筆資料",
          type: "warning",
        });
      }
    },
    goDetailPage(data) {
      let routeUrl = this.$router.resolve({
        name: "infoDetail",
        params: { id: data.id },
      });
      window.open(routeUrl.href, "_blank");
    },
    draw() {
      let data = this.sampleData;
      let svgWidth = window.innerWidth - 300;
      let svgHeight = 30 * data.length;
      let barSize = 20;
      let barPadding = 10;

      let getValue = [];
      data.forEach((element) => {
        getValue.push(element.value);
      });

      let scale = d3
        .scaleLinear()
        .domain([0, d3.max(getValue)])
        .range([0, svgWidth]);

      let svg = d3
        .select("#d3Chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      let pie = d3
        .pie()
        .sort(null)
        .value((d) => d.value);

      let title = svg
        .selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .text((d) => d.data.gKey)
        .attr("x", 0)
        .attr("y", barSize / 1.5)
        .attr("transform", (d, i) => {
          return "translate(0," + i * (barSize + barPadding) + ")";
        });

      let bar = svg
        .selectAll("g")
        .data(pie(data))
        .enter()
        .append("g")
        .style("cursor", "pointer")
        .attr("transform", (d, i) => {
          return "translate(0," + i * (barSize + barPadding) + ")";
        });

      bar
        .append("rect")
        .transition()
        .duration(1000)
        .attr("x", 100)
        .attr("width", (d) => scale(d.value))
        .attr("height", barSize)
        .style("fill", "#00abb9");

      // bar
      //   .append("text")
      //   .text((d) => d.value)
      //   /* x, y 設定文字位置，text-anchor 將文字定位在尾端 */
      //   .attr("x", (d) => d.value)
      //   .attr("y", barSize / 1.5)
      //   .attr("text-anchor", "end")
      //   .style("fill", "#FFF");

      /* 設定tooltip */
      const tooltip = this.setTooltip();
      bar.call(tooltip);
      bar
        .on("mouseover", tooltip.show)
        .on("mouseout", tooltip.hide)
        .on("click", (event, item) => {
          this.$store.dispatch("loadingHandler", true);
          const getKeyData = this.sampleData.filter(
            (res) => res.gKey == item.data.gKey
          );
          console.log(getKeyData[0]);
          this.listQuery.nSite = getKeyData[0].gKey;
          this.getList();
        });
    },
    setTooltip() {
      // 初始化 tooltip function
      const tooltip = d3Tip().attr("class", "d3-tip").offset([-10, 0]);

      // 設定 tooltip 內容
      tooltip.html(
        (event, item) =>
          `<div class="d3-tip__title">${item.data.gKey}</div>
          <div class="d3-tip__value">${item.data.value}</div>`
      );

      // 回傳 tooltip function
      return tooltip;
    },
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    this.getList();
    await this.getStatics();
    this.draw();
  },
  // updated() {
  //   console.log(this.selectionIds);
  //   this.$refs.multipleTable.clearSelection();
  //   let restoreData = this.tableData
  //     .map((item, index) => {
  //       return this.selectionIds.includes(item.id) ? index : false;
  //     })
  //     .filter((item) => item !== false);
  //   restoreData.forEach((item) => {
  //     this.$refs.multipleTable.toggleRowSelection(this.tableData[item], true);
  //   });
  // },
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

    svg {
      width: 100%;
      margin-top: 16px;

      g:hover {
        opacity: 0.8;
      }
    }

    &--noData {
      padding-top: 20px;
      font-size: 18px;
      color: red;
      font-weight: bolder;
      // text-decoration: underline;
    }

    .el-tabs {
      &__active-bar {
        background-color: #191970;
      }

      .is-active {
        font-weight: bold;
        color: #191970;
      }
    }
  }

  &__listBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    &--searchKeyboard {
      width: 100%;
      text-align: left;
      display: flex;
      align-items: center;

      strong {
        font-size: 18px;
      }

      span {
        padding: 4px 12px;
        background: rgba($color: #00abb9, $alpha: 0.3);
        border-radius: 12px;
        // color: white;
      }

      i {
        margin-left: 4px;
        transition: 0.5s;
        font-size: 18px;
        cursor: pointer;

        &:hover {
          color: red;
        }
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

    &--goDetailPage {
      color: #0645ad;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>