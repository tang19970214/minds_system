<template>
  <div class="scheduleSettingPage">
    <div class="scheduleSettingPage__settingPos">

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
          <strong>每日執行</strong>
        </div>
        <div class="enableList__body">
          <div class="enableList__body--hour">
            <label>時：</label>
            <el-select class="w-full" v-model="listQuery.RegularHour" placeholder="請選擇時">
              <el-option v-for="item in 23" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <p>24小時制（00-23）</p>
          </div>

          <div class="enableList__body--min">
            <label>分：</label>
            <el-select class="w-full" v-model="listQuery.RegularMinute" placeholder="請選擇分">
              <el-option v-for="item in 59" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <p>（00-59）</p>
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
export default {
  data() {
    return {
      listQuery: {
        userId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        Type: 1,
        Name: "",
        Enable: "Y",
        RegularHour: "",
        RegularMinute: "",
      },
    };
  },
  methods: {
    add() {
      if (
        this.listQuery.Name == "" ||
        this.listQuery.RegularHour == "" ||
        this.listQuery.RegularMinute == ""
      ) {
        this.$notify({
          title: "警告",
          message: "請確實填寫欄位！",
          type: "warning",
        });
      } else {
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
.scheduleSettingPage {
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
        padding: 16px;
        border: 1px solid #2d2d2d;

        &--hour {
          width: 100%;
          padding-bottom: 16px;
          display: flex;
          align-items: center;

          label {
            min-width: 60px;
            max-width: 60px;
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

        &--min {
          width: 100%;
          display: flex;
          align-items: center;

          label {
            min-width: 60px;
            max-width: 60px;
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