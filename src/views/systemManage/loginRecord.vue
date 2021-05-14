<template>
  <div class="loginRecordPage">
    <div class="loginRecordPage__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="loginRecordPage__searchBox" v-if="openSearchBox">
        <div class="loginRecordPage__searchBox--dateAndFunc">
          <div class="dateTime">
            <label>查詢日期：</label>
            <el-date-picker v-model="getDateRange" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>

          <div class="func">
            <el-button type="primary" @click="searchLog()">查詢</el-button>
          </div>
        </div>
      </div>
    </transition>

    <div class="loginRecordPage__listBox">
      <div class="loginRecordPage__listBox--title">
        <strong>系統登入紀錄表</strong>
      </div>

      <div class="loginRecordPage__listBox--content">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" empty-text="暫無數據">
          <el-table-column label="序號" type="index" width="80"></el-table-column>
          <el-table-column label="使用者" prop="userName" width="150"></el-table-column>
          <el-table-column label="登入來源" prop="sessionId" width="250"></el-table-column>
          <el-table-column label="登入時間">
            <template slot-scope="scope">
              <div>{{ scope.row.loginTime | moment("YYYY-MM-DD HH:mm:ss") }}</div>
            </template>
          </el-table-column>
          <el-table-column label="登出時間">
            <template slot-scope="scope">
              <div>{{ scope.row.logoutTime | moment("YYYY-MM-DD HH:mm:ss") }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <Page :listNum="listNum" :getPageSize="listQuery.PageSize" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />

    </div>
  </div>
</template>

<script>
import moment from "moment";

import Page from "../../components/Page.vue";

export default {
  components: { Page },
  data() {
    return {
      openSearchBox: true,
      getDateRange: [
        moment().add(-7, "days").format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD"),
      ],
      tableData: [],
      listQuery: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        StartDate: moment().add(-7, "days").format("YYYY-MM-DD"),
        EndDate: moment().add(1, "days").format("YYYY-MM-DD"),
        Page: 1,
        PageSize: 10,
      },
      listNum: null,
    };
  },
  methods: {
    searchLog() {
      console.log(this.getDateRange);
      return;
      this.$store.dispatch("loadingHandler", true);
      this.listQuery.StartDate = this.getDateRange[0];
      this.listQuery.EndDate = this.getDateRange[1];
      this.getList();
    },
    handleSizeChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.listQuery.PageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.$store.dispatch("loadingHandler", true);
      this.listQuery.Page = val;
      this.getList();
    },
    async getList() {
      await this.$api.getUserLogin(this.listQuery).then((res) => {
        this.tableData = res.data.data;
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
.loginRecordPage {
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

    &--dateAndFunc {
      width: 100%;
      padding: 20px 20px 0 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;

      label {
        font-weight: 600;
        color: #2a2a2a;
        letter-spacing: 2px;
        font-size: 18px;
      }

      .dateTime {
        width: 100%;
      }

      .func {
        width: 100%;
      }
    }
  }

  &__listBox {
    width: 100%;
    padding-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &--title {
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      text-align: center;

      strong {
        color: #191970;
        font-size: 24px;
        letter-spacing: 2.4px;
      }
    }

    &--content {
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>