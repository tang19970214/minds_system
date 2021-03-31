<template>
  <div class="home">
    <div class="home__searchBox">
      <strong>最近1日新增資料</strong>
      <!-- 長條圖 -->
      <!-- <svg id="d3Chart"></svg> -->
      <div id="d3Chart"></div>
      {{sampleData}}
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
import * as d3 from "d3";

export default {
  name: "Home",
  data() {
    return {
      dayAddNum: "",
      listQuery: {
        sDate: "2020-01-01",
        eDate: "2021-12-31",
        query: "",
        nSite: "全部",
        nChannel: "全部",
        page: 1,
        pageSize: 10,
      },
      staticsQuery: {
        sDate: "2020-01-01",
        eDate: "2021-12-31",
      },
      tableData: [],
      multipleSelection: [],
      sampleData: [],
    };
  },
  methods: {
    getList() {
      this.$api.getNewsList(this.listQuery).then((res) => {
        this.tableData = res.data;
      });
    },
    async getStatics() {
      await this.$api.getNewsStatics(this.staticsQuery).then((res) => {
        // console.log("statics", res.data);
        this.sampleData = res.data.map((item) => item.value);
        // console.log(this.sampleData);
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
    draw() {
      let data = this.sampleData;
      let bar_height = 30;
      let bar_padding = 10;
      let svg_height = (bar_height + bar_padding) * data.length;
      let svg_width = window.innerWidth - 300;

      let scale = d3
        .scaleLinear()
        .domain([0, d3.max(data)])
        .range([0, svg_width]);

      let svg = d3
        .select("#d3Chart")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

      let bar = svg
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(0," + i * (bar_height + bar_padding) + ")";
        });

      bar
        .append("rect")
        .transition()
        .duration(1500)
        .attr("width", (d) => scale(d))
        .attr("height", bar_height)
        .style("fill", "#00abb9");

      bar
        .append("text")
        .text((d) => Math.round(scale(d)) / 10 + "%")
        /* x, y 設定文字位置，text-anchor 將文字定位在尾端 */
        .attr("x", (d) => Math.round(scale(d)) - 10)
        .attr("y", bar_height / 1.5)
        .attr("text-anchor", "end")
        .style("fill", "#FFF");

      svg
        .on("mouseover", (d) => {
          console.log(d);
          bar
            .append("rect")
            .style("fill", "#FFF")
            .style("border", "1px solid black");
          // bar
          //   .append("text")
          //   .text(d)
          //   .attr(
          //     "x",
          //     parseFloat(d3.select(this).attr("x")) +
          //       parseFloat(d3.select(this).attr("width") / 2) -
          //       11
          //   )
          //   .attr("y", parseFloat(d3.select(this).attr("y")) + 20)
          //   .attr("fill", "#fff")
          // .attr("id", "tooltip");
        })
        .on("mouseout", (d) => {
          console.log(d3.select("#tooltip"), d);
          d3.select("#tooltip").remove();
        });
    },
    draw1() {
      let dataset = this.sampleData;
      // let maxdata = Math.max(dataset);
      // console.log(maxdata);
      console.log(this.sampleData);
      // return;
      // console.log(window);
      // 定義svg圖形寬高，以及柱狀圖間距
      let svgWidth = 500,
        svgHeight = 300,
        barPadding = 5;
      // 通過圖形計算每個柱狀寬度
      let barWidth = svgHeight / dataset.length;
      // 繪製圖形
      let svg = d3
        .select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
      // rect，長方形
      // 文檔：http://www.w3school.com.cn/svg/svg_rect.asp
      svg
        .selectAll("rect")
        .data(dataset) //綁定數組
        .enter() // 指定選擇集的enter部分
        .append("rect") // 添加足夠數量的矩形
        .attr("y", (d, idx) => (idx + 1) * 50) //每個數據間的距離
        .attr("height", 30) // 設定高度
        .attr("width", (d) => {
          // console.log(maxdata);
          // console.log(dataset.map((n) => Math.max(n)));
          // console.log(Math.max(dataset));
          return d;
        }) // 設定寬度
        .style("fill", "steelblue") // 設定數據條顏色
        .style("cursor", "pointer");
    },
  },
  async mounted() {
    this.getList();
    await this.getStatics();
    this.draw();
  },
  created() {
    d3.select("#d3Chart").append("svg").attr("width", 500).attr("height", 500);
  },
  watch: {
    // sampleData: function () {
    //   this.draw(this.sampleData);
    // },
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

    svg {
      width: 100%;
      // background: pink;
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