<template>
  <div class="wordManage">
    <div class="wordManage__searchBox">
      <div class="wordManage__searchBox--kindAndSort">
        <div class="kind">
          <label>維護詞庫類別：</label>
          <el-date-picker v-model="wordKind" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期">
          </el-date-picker>
        </div>

        <div class="sort">
          <label>實體詞分類：</label>
          <el-select v-model="wordSort" placeholder="請選擇查詢來源">
            <el-option label="請選擇" value="">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="wordManage__searchBox--searchStr">
        <div class="keyword">
          <label>關鍵字：</label>
          <el-input v-model="searchKeyword"></el-input>
        </div>
        <el-button type="primary">查詢</el-button>
      </div>
    </div>

    <div class="wordManage__listBox">
      <div class="wordManage__listBox--add">
        <span>
          <i class="el-icon-plus"></i>
          <a>新增</a>
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
      wordSort: "",
      wordKind: "",
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
.wordManage {
  width: 100%;
  height: 100vh;

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

    &--kindAndSort {
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

      .kind,
      .sort {
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

      .keyword {
        display: flex;
        align-items: center;
        justify-content: center;

        label {
          min-width: 100px;
          max-width: 100px;
        }

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
  }
}
</style>