<template>
  <div class="projMaintain">
    <div class="projMaintain__searchBox">
      <div class="projMaintain__searchBox--sort">
        <label>專卷分類：</label>
        <el-select v-model="projSort" placeholder="請選擇專卷分類">
          <el-option label="請選擇" value="">
          </el-option>
        </el-select>
        <i class="el-icon-edit"></i>
        <i class="el-icon-plus"></i>
        <i class="el-icon-delete-solid"></i>
      </div>

      <div class="projMaintain__searchBox--theme">
        <label>專卷主題：</label>
        <el-select v-model="projTheme" placeholder="請選擇專卷主題">
          <el-option label="請選擇" value="">
          </el-option>
        </el-select>
        <i class="el-icon-edit"></i>
        <i class="el-icon-plus"></i>
        <i class="el-icon-delete-solid"></i>
      </div>
    </div>

    <div class="projMaintain__listBox">
      <el-row>
        <el-col :span="16">
          <div class="projMaintain__listBox--info">
            <strong>備註：配合政策發展</strong>
            <strong>建立人：Peter</strong>
            <strong>建立時間：2021/01/20 01:24:00</strong>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="projMaintain__listBox--joinAnalysis">
            <span>
              <i class="el-icon-circle-plus-outline"></i>
              <a>編輯分析專卷</a>
            </span>
          </div>
        </el-col>
      </el-row>

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
.projMaintain {
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

    i {
      font-weight: bold;
      font-size: 24px;
      padding: 0 12px;
      transition: 0.6s;
      cursor: pointer;

      &:hover {
        font-size: 28px;
        color: #00abb9;
      }
    }

    &--sort {
      width: 100%;
      display: flex;
      align-items: center;
    }

    &--theme {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: 20px;
    }
  }

  &__listBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    .el-row {
      padding-bottom: 20px !important;
    }

    &--info {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;

      strong {
        color: #2a2a2a;
        letter-spacing: 2px;
        line-height: 28px;
        font-size: 18px;
      }
    }

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

        &:hover {
          letter-spacing: 2px;
        }
      }
    }
  }
}
</style>