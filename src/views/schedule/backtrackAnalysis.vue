<template>
  <div class="backtrackAnalysis">

    <div class="analysisDate">
      <label>分析日期：</label>
      <el-date-picker v-model="getDateRange" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期">
      </el-date-picker>
    </div>

    <div class="analysisFrom">
      <label>分析來源：</label>
      <el-select v-model="listQuery.Source">
        <el-option label="全部" value="0"></el-option>
        <el-option label="新聞" value="1"></el-option>
      </el-select>
    </div>

    <div class="backtrackName">
      <label>回朔名稱：</label>
      <el-input v-model="listQuery.Name">
      </el-input>
    </div>

    <div class="enable">
      <label>啟動：</label>
      <el-radio v-model="listQuery.Enable" label="Y">Y</el-radio>
      <el-radio v-model="listQuery.Enable" label="N">N</el-radio>
    </div>

    <div class="enableList">
      <div class="enableList__tab">
        <strong>執行一次</strong>
      </div>
      <div class="enableList__body">
        <div class="enableList__body--datetime">
          <label>YYYY/MM/DD HH:mm:ss</label>
          <el-date-picker class="w-full" v-model="listQuery.OneTime" type="datetime" placeholder="請選擇日期時間">
          </el-date-picker>
          <p>24小時制（00-23）</p>
        </div>
      </div>
    </div>

    <div class="func">
      <el-button type="primary" @click="add()">新增</el-button>
      <el-button type="info" @click="cancel()">取消</el-button>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      listQuery: {
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        Type: 3,
        Name: "",
        Enable: "Y",
        OneTime: null,
        sDate: "",
        eDate: "",
        Source: "0",
      },
      getDateRange: "",
    };
  },
  methods: {
    add() {
      if (!this.getDateRange) {
        this.$notify({
          title: "警告",
          message: "尚未選擇『分析日期』！",
          type: "warning",
        });
      } else if (this.listQuery.Name == "") {
        this.$notify({
          title: "警告",
          message: "尚未輸入『回朔名稱』！",
          type: "warning",
        });
      } else {
        this.listQuery.sDate = moment(this.getDateRange[0]).format(
          "YYYY-MM-DD"
        );
        this.listQuery.eDate = moment(this.getDateRange[1]).format(
          "YYYY-MM-DD"
        );
        if (!!this.listQuery.OneTime) {
          this.listQuery.OneTime = moment(this.listQuery.OneTime).format(
            "YYYY-MM-DDTHH:mm:ss"
          );
        }
        this.$store.dispatch("loadingHandler", true);
        this.$api.addSchedule(this.listQuery).then((res) => {
          if (res.data) {
            this.$notify({
              title: "成功",
              message: "新增成功",
              type: "success",
            });
            this.$router.push("scheduleSearch");
          }
        });
      }
    },
    cancel() {
      this.$confirm("確定要取消新增？", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push("scheduleSearch");
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss">
.backtrackAnalysis {
  width: 100%;
  height: 100vh;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  label {
    font-weight: 600;
    color: #2a2a2a;
    letter-spacing: 2px;
    font-size: 18px;
    min-width: 120px;
    white-space: nowrap;
  }

  .analysisDate {
    width: 100%;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
  }

  .analysisFrom {
    width: 100%;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
  }

  .backtrackName {
    width: 100%;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
    .el-input {
      max-width: 500px;
    }
  }

  .enable {
    width: 100%;
    padding-bottom: 16px;
    display: flex;
    align-items: center;

    label {
      &:nth-child(2) {
        min-width: 30px;
        max-width: 30px;
      }
      &:nth-child(3) {
        min-width: 30px;
        max-width: 30px;
      }
    }
  }

  .enableList {
    width: 100%;
    padding-top: 24px;

    &__tab {
      padding: 4px 8px;
      display: inline;
      font-size: 18px;
      border: 1px solid #2d2d2d;
      border-bottom: none;
    }

    &__body {
      margin-top: 4px;
      padding: 24px 16px;
      border: 1px solid #2d2d2d;

      &--datetime {
        width: 100%;
        display: flex;
        align-items: center;

        label {
          font-size: 16px;
          min-width: 250px;
          max-width: 250px;
          font-weight: 600;
          color: #2a2a2a;
          letter-spacing: 2px;
        }

        p {
          margin: 0 0 0 16px;
          min-width: 200px;
          max-width: 200px;
          text-align: left;
        }
      }
    }
  }

  .func {
    width: 100%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      &:first-child {
        margin-right: 16px;
      }
      &:last-child {
        margin-left: 16px;
      }
    }
  }
}
</style>