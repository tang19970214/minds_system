<template>
  <div class="scheduleSearchPage">
    <div class="scheduleSearchPage__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="scheduleSearchPage__searchBox" v-if="openSearchBox">
        <div class="scheduleName">
          <label>排程名稱：</label>
          <el-input v-model="listQuery.query"></el-input>
        </div>

        <div class="scheduleType">
          <label>型態：</label>
          <el-select v-model="listQuery.Type" placeholder="請選擇型態" no-data-text="無數據">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="匯入作業" :value="1"></el-option>
            <el-option label="實體辨識" :value="2"></el-option>
            <el-option label="回朔分析" :value="3"></el-option>
          </el-select>
        </div>

        <el-button type="primary" @click="searchSchedule">查詢</el-button>
      </div>
    </transition>

    <div class="scheduleSearchPage__listBox">
      <div class="scheduleSearchPage__listBox--info">
        <div class="work">
          <label>排程作業：</label>
          <p>asdf</p>
        </div>

        <div class="add">
          <span>
            <i class="el-icon-circle-plus-outline"></i>
            <a>新增</a>
          </span>
        </div>
      </div>

      <div class="scheduleSearchPage__listBox--tableData">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" empty-text="暫無數據">
          <el-table-column label="型態" prop="type" width="100">
            <template slot-scope="scope">
              <div>{{ getType(scope.row.type) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="排程名稱" prop="name"></el-table-column>
          <el-table-column label="啟動" width="80">
            <template slot-scope="scope">
              <div>{{ (scope.row.enable == "Y") ? "是" : "否" }}</div>
            </template>
          </el-table-column>
          <el-table-column label="週期" prop="oneTime">
            <template slot-scope="scope">
              <div>{{ scope.row.oneTime | moment("YYYY-MM-DD HH:mm:ss") }}</div>
            </template>
          </el-table-column>
          <el-table-column label="啟動 時:分">
            <template slot-scope="scope">
              <div>{{ scope.row.startTime | moment("YYYY-MM-DD HH:mm:ss") }}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成 時:分">
            <template slot-scope="scope">
              <div>{{ scope.row.endTime | moment("YYYY-MM-DD HH:mm:ss") }}</div>
            </template>
          </el-table-column>
          <el-table-column label="狀態">
            <template slot-scope="scope">
              <div>{{ scope.row.status || "未執行" }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">

              <div class="scheduleSearchPage__listBox--userFunc">
                <el-tooltip effect="dark" content="編輯" placement="bottom">
                  <el-button type="text">
                    <i class="el-icon-edit"></i>
                  </el-button>
                </el-tooltip>

                <el-tooltip effect="dark" content="刪除" placement="bottom">
                  <el-button type="text">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-tooltip>

                {{scope.row.id}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listQuery: {
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        query: "",
        Type: 0,
        page: 1,
        pageSize: 10,
      },
      tableData: [],
      openSearchBox: true,
    };
  },
  computed: {
    getType() {
      return (type) => {
        switch (type) {
          case 0:
            return "全部";
            break;
          case 1:
            return "匯入作業";
            break;
          case 2:
            return "實體辨識";
            break;
          case 3:
            return "回朔分析";
            break;
        }
      };
    },
  },
  methods: {
    searchSchedule() {},
    handleSelectionChange() {},
    getList() {
      this.$api.getScheduleList(this.listQuery).then((res) => {
        console.log(res.data);
        this.tableData = res.data;
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss">
.scheduleSearchPage {
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
    justify-content: space-around;
    border-bottom: 1px solid #191972;

    .scheduleName {
      display: flex;
      align-items: center;

      label {
        font-weight: 600;
        color: #2a2a2a;
        letter-spacing: 2px;
        font-size: 18px;
        white-space: nowrap;
      }

      .el-input {
        min-width: 350px !important;
      }
    }

    .scheduleType {
      display: flex;
      align-items: center;

      label {
        font-weight: 600;
        color: #2a2a2a;
        letter-spacing: 2px;
        font-size: 18px;
      }
    }
  }

  &__listBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    &--info {
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .work {
        display: flex;
        align-items: center;

        label {
          font-weight: 600;
          color: #2a2a2a;
          letter-spacing: 2px;
          font-size: 18px;
          white-space: nowrap;
        }

        p {
          margin: 0;
        }
      }

      .add > span {
        transition: 0.6s;
        cursor: pointer;
        i,
        a {
          padding-left: 4px;
          font-size: 18px;
          font-weight: bold;
          color: #191972;
        }

        &:hover {
          letter-spacing: 2px;
        }
      }
    }

    &--tableData {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &--userFunc {
      i {
        font-size: 20px;
        transition: 0.3s;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }
}
</style>