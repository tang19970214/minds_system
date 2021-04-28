<template>
  <div class="scheduleSearchPage">
    <div class="scheduleSearchPage__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="scheduleSearchPage__searchBox" v-if="openSearchBox">
        <div class="scheduleName">
          <label>排程名稱：</label>
          <el-input v-model="listQuery.query" clearable></el-input>
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

        <el-button type="primary" @click="searchSchedule()">查詢</el-button>
      </div>
    </transition>

    <div class="scheduleSearchPage__listBox">
      <div class="scheduleSearchPage__listBox--info">
        <div class="work">
          <label>排程作業：</label>
        </div>

        <div class="add">
          <span @click="addScheduleModal = true">
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
          <el-table-column label="週期" prop="oneTime" width="100">
            <template slot-scope="scope">
              <div>{{ (scope.row.oneTime == null) ? '定期' : '一次' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="啟動 時:分" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.startTime | moment("HH:mm") }}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成 時:分" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.endTime | moment("HH:mm") }}</div>
            </template>
          </el-table-column>
          <el-table-column label="狀態">
            <template slot-scope="scope">
              <div>{{ scope.row.status || "未執行" }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <div class="scheduleSearchPage__listBox--userFunc">
                <el-tooltip effect="dark" content="啟動" placement="bottom">
                  <el-button type="text" :disabled="scope.row.enable == 'Y'" @click="operateFunc('play', scope.row)">
                    <font-awesome-icon icon="play-circle" />
                  </el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="停止" placement="bottom">
                  <el-button type="text" :disabled="scope.row.enable == 'N'" @click="operateFunc('stop', scope.row)">
                    <font-awesome-icon icon="stop-circle" />
                  </el-button>
                </el-tooltip>

                <el-tooltip effect="dark" content="刪除" placement="bottom">
                  <el-button type="text" @click="operateFunc('del', scope.row)">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <Page :listNum="listNum" :getPageSize="listQuery.PageSize" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
    </div>

    <!-- modal -->
    <!-- 新增排程 -->
    <el-dialog title="新增排程" :visible.sync="addScheduleModal" width="40%" center>
      <div class="scheduleSearchPage__modal">
        <el-button type="primary">
          <router-link :to="{name: 'scheduleSetting'}">新增排程設定</router-link>
        </el-button>
        <el-button type="primary">
          <router-link :to="{name: 'manualExecute'}">新增手動執行</router-link>
        </el-button>
        <el-button type="primary">
          <router-link :to="{name: 'backtrackAnalysis'}">新增回朔分析</router-link>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Page from "../../components/Page.vue";

export default {
  components: { Page },
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
      listNum: null,
      /* modal */
      addScheduleModal: false,
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
    searchSchedule() {
      this.$store.dispatch("loadingHandler", true);
      this.getList();
    },
    handleSizeChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.listQuery.pageSize = val;
      this.getlList();
    },
    handleCurrentChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.listQuery.page = val;
      this.getlList();
    },
    operateFunc(val, item) {
      switch (val) {
        case "play":
          this.$confirm("確定要啟動此排程嗎？", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.updateSchedule(item, "Y");
            })
            .catch(() => {});
          break;
        case "stop":
          this.$confirm("確定要停止此排程嗎？", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.updateSchedule(item, "N");
            })
            .catch(() => {});
          break;
        case "del":
          this.$confirm("確定要刪除此排程嗎？", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.delSchedule(item.id);
            })
            .catch(() => {});
          break;
      }
    },
    updateSchedule(item, status) {
      item.enable = status;
      this.$api.updateSchedule(item).then((res) => {
        this.$notify({
          title: "成功",
          message: "更新成功！",
          type: "success",
        });
      });
    },
    delSchedule(id) {
      this.$store.dispatch("loadingHandler", true);
      const delInfo = {
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        id: id,
      };
      this.$api.deleteSchedule(delInfo).then((res) => {
        this.$notify({
          title: "成功",
          message: "刪除成功！",
          type: "success",
        });
        this.getList();
      });
    },
    getList() {
      this.$api.getScheduleList(this.listQuery).then((res) => {
        this.tableData = res.data;
        this.listNum = res.data.count;
        this.$store.dispatch("loadingHandler", false);
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
      padding: 0 30px 20px 30px;
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
      i,
      svg {
        font-size: 20px;
        transition: 0.3s;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }

  &__modal {
    width: 100%;
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-flow: wrap;

    button {
      margin-bottom: 16px;
      a {
        color: white;
        font-weight: bold;
        text-decoration: none;
        letter-spacing: 2px;
        font-size: 18px;
      }
    }
  }
}
</style>