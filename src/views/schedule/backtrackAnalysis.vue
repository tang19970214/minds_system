<template>
  <div class="backtrackAnalysis">
    <div class="backtrackAnalysis__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="backtrackAnalysis__searchBox" v-if="openSearchBox">
        <div class="backtrackAnalysis__searchBox--datetime">
          <label>分析日期：</label>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期">
          </el-date-picker>
        </div>

        <div class="backtrackAnalysis__searchBox--fromAndBtn">
          <div class="analysisFrom">
            <label>分析來源：</label>
            <el-select v-model="analysisFrom" placeholder="請選擇查詢來源" no-data-text="無數據">
              <el-option label="請選擇" value="">
              </el-option>
            </el-select>
          </div>

          <div class="analysisBtn">
            <el-button type="primary">分析</el-button>
          </div>
        </div>
      </div>
    </transition>

    <div class="backtrackAnalysis__listBox">
      <div class="backtrackAnalysis__listBox--title">
        <strong>新詞代表</strong>
      </div>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" empty-text="暫無數據">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="序號" type="index" width="50"></el-table-column>
        <el-table-column label="資料來源" prop="name" width="150"></el-table-column>
        <el-table-column label="新詞名稱" prop="name" width="150"></el-table-column>
        <el-table-column label="選擇詞庫類型">
          <!-- <template slot-scope="scope"> -->
          <el-select v-model="wordType" placeholder="請選擇詞庫類型">
            <el-option label="請選擇" value=""></el-option>
            <!-- <el-option :label="scope.row.date" :value="scope.row.date"></el-option> -->
          </el-select>
          <!-- </template> -->
        </el-table-column>
        <el-table-column label="選擇實體分類">
          <!-- <template slot-scope="scope"> -->
          <el-select v-model="wordType" placeholder="請選擇實體分類">
            <el-option label="請選擇" value=""></el-option>
            <!-- <el-option :label="scope.row.date" :value="scope.row.date"></el-option> -->
          </el-select>
          <!-- </template> -->
        </el-table-column>
        <el-table-column label="備註" prop="remark"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      openSearchBox: true,
      dateRange: "",
      analysisFrom: "",
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          remark: "",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          remark: "",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          remark: "",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          remark: "",
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          remark: "",
        },
      ],
      wordType: "",
      multipleSelection: [],
    };
  },
  methods: {
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
};
</script>

<style lang="scss">
.backtrackAnalysis {
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

    &--fromAndBtn {
      width: 100%;
      margin-top: 20px;
      padding-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .analysisFrom {
        width: 100%;
      }

      .analysisBtn {
        width: 100%;
        text-align: center;
      }
    }
  }

  &__listBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    &--title {
      width: 100%;
      text-align: center;
      color: #191972;
      letter-spacing: 2px;
      font-size: 26px;
    }
  }
}
</style>