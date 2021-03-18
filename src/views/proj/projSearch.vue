<template>
  <div class="projSearch">
    <div class="projSearch__searchBox">
      <div class="projSearch__searchBox--setting">
        <strong>查詢設定</strong>
      </div>

      <div class="projSearch__searchBox--sort">
        <label>專卷分類：</label>
        <el-select v-model="projSort" placeholder="請選擇專卷分類">
          <el-option label="請選擇" value="">
          </el-option>
        </el-select>
      </div>

      <div class="projSearch__searchBox--theme">
        <label>專卷主題：</label>
        <el-select v-model="projTheme" placeholder="請選擇專卷主題">
          <el-option label="請選擇" value="">
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="projSearch__listBox">
      <div class="projSearch__listBox--joinAnalysis">
        <span>
          <i class="el-icon-s-data"></i>
          <a>匯出</a>
        </span>

        <span>
          <i class="el-icon-circle-plus-outline"></i>
          <a>關聯分析</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="日期" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projSort: "",
      projTheme: "",
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
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
.projSearch {
  width: 100%;
  height: 100vh;

  &__searchBox {
    position: relative;
    padding: 20px;
    border-bottom: 1px solid #191972;

    label {
      font-weight: 600;
      color: #2a2a2a;
      letter-spacing: 2px;
      font-size: 18px;
    }

    &--setting {
      position: absolute;
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

    &--sort {
      width: 100%;
    }

    &--theme {
      width: 100%;
      margin-top: 20px;
    }
  }

  &__listBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    &--joinAnalysis {
      width: 100%;
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

        &:first-child {
          margin-right: 16px;
        }

        &:hover {
          letter-spacing: 2px;
        }
      }
    }
  }
}
</style>