<template>
  <div class="projEdit">

    <div class="projEdit__leftBox" :style="checkLeftBoxWidth.leftBox">
      <transition name="moveB">
        <div class="body" v-if="openLeftBox">
          <div class="body__searchDateRange">
            <strong>查詢日期：</strong>
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期">
            </el-date-picker>
          </div>

          <div class="body__checkBox">
            <el-checkbox-group v-model="checkBoxList">
              <el-checkbox label="實體一"></el-checkbox>
              <el-checkbox label="實體二"></el-checkbox>
              <el-checkbox label="實體三"></el-checkbox>
            </el-checkbox-group>
          </div>

          <div class="body__analysisBtn">
            <el-button type="info">分析</el-button>
          </div>

          <div class="body__closeBtn">
            <el-button type="primary" @click="closePage()">關 閉</el-button>
          </div>
        </div>
      </transition>

      <div class="projEdit__leftBox--shrinkLeftBox" :style="checkLeftBoxWidth.shrink">
        <i class="el-icon-caret-left" @click="openLeftBox = false" v-if="openLeftBox"></i>
        <i class="el-icon-caret-right" @click="openLeftBox = true" v-else></i>
      </div>
    </div>

    <div class="projEdit__rightBox" :style="checkLeftBoxWidth.rightBox">
      <!-- 圖表 chart -->
      <div class="projEdit__rightBox--chartBox">
        圖表
      </div>

      <div class="projEdit__rightBox--tableBox">
        <el-table :data="tableData" style="width: 100%" border empty-text="暫無數據">
          <el-table-column prop="date" label="日期" width="200"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      openLeftBox: true,
      searchSort: "",
      dateRange: "",
      checkBoxList: [],
      tableData: [
        {
          date: "2016-05-02",
          name: "王ＯＯ",
        },
        {
          date: "2016-05-04",
          name: "王ＯＯ",
        },
        {
          date: "2016-05-01",
          name: "王ＯＯ",
        },
        {
          date: "2016-05-03",
          name: "王ＯＯ",
        },
      ],
    };
  },
  computed: {
    checkLeftBoxWidth() {
      return {
        leftBox: this.openLeftBox ? "" : "width: 1.5%",
        shrink: this.openLeftBox ? "" : "width: 100%",
        rightBox: this.openLeftBox ? "" : "width: 98.5%",
      };
    },
  },
  methods: {
    closePage() {
      this.$confirm("確定要關閉此頁面嗎？", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.close();
        })
        .catch(() => {});
    },
    sideBarList() {
      this.$api.getTopology().then((res) => {
        console.log(res);
      });
    },
  },
  mounted() {
    // this.sideBarList();
  },
};
</script>

<style lang="scss">
.projEdit {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  position: relative;

  &__leftBox {
    width: 20%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    border-right: 1px solid black;

    .body {
      position: relative;
      width: 95%;
      min-height: 100vh;
      padding: 12px;
      box-sizing: border-box;
      border-right: 1px solid black;

      &__searchDateRange {
        width: 100%;
        display: flex;
        flex-direction: column;
        color: #191970;

        .el-date-editor {
          margin-top: 8px;
          width: 100% !important;
        }
      }

      &__checkBox {
        width: 100%;
        padding: 16px 0;

        label {
          width: 100%;
          padding: 4px 8px;
          box-sizing: border-box;
          border-radius: 10px;
          margin: 4px 0;
          transition: 0.5s;

          &:hover {
            background: #c3eff3;
          }
        }
      }

      &__analysisBtn {
        width: 100%;
        padding: 16px 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__closeBtn {
        position: absolute;
        background: white;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 24px;
        box-sizing: border-box;
        border-top: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;

        button {
          padding: 16px 30px;
          font-size: 18px;
          font-weight: bolder;
        }
      }
    }

    &--shrinkLeftBox {
      width: 5%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        padding: 8px 0;
        font-weight: bolder;
        font-size: 24px;
        cursor: pointer;

        &:hover {
          color: #00abb9;
        }
      }
    }
  }

  &__rightBox {
    width: 80%;
    height: 100%;

    &--chartBox {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
    }

    &--tableBox {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
    }
  }
}
</style>