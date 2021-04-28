<template>
  <div class="manualExecute">
    <div class="manualExecute__settingPos">

      <div class="scheduleName">
        <label>排程名稱：</label>
        <el-input v-model="listQuery.Name"></el-input>
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
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      listQuery: {
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        Type: 1,
        Name: "",
        Enable: "Y",
        OneTime: null,
      },
    };
  },
  methods: {
    add() {
      if (this.listQuery.Name == "") {
        this.$notify({
          title: "警告",
          message: "尚未輸入『排程名稱』！",
          type: "warning",
        });
      } else {
        this.$store.dispatch("loadingHandler", true);
        if (!!this.listQuery.OneTime) {
          this.listQuery.OneTime = moment(this.listQuery.OneTime).format(
            "YYYY-MM-DDTHH:mm:ss"
          );
        }
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
      this.$confirm("確定要取消本次排程設定？", "提示", {
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
.manualExecute {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__settingPos {
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .scheduleName {
      width: 100%;
      padding-bottom: 16px;
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
        max-width: 500px;
      }
    }

    .enable {
      width: 100%;
      padding-bottom: 16px;
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
}
</style>