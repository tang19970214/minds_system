<template>
  <div class="projSearch">
    <div class="projSearch__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="projSearch__searchBox" v-if="openSearchBox">
        <div class="projSearch__searchBox--sort">
          <label>專卷分類：</label>
          <el-select v-model="projSort" placeholder="請選擇專卷分類" no-data-text="無數據">
            <el-option label="請選擇" value=""></el-option>
            <el-option :label="item.name" :value="item.name" v-for="item in sortList" :key="item.id"></el-option>
          </el-select>
        </div>

        <div class="projSearch__searchBox--theme">
          <label>專卷主題：</label>
          <el-select v-model="projTheme" placeholder="請選擇專卷主題" :disabled="!projSort" v-if="getChild(themeList).length > 0" no-data-text="無數據">
            <el-option :label="item.name" :value="item.name" v-for="item in getChild(themeList)[0].children" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="projTheme" placeholder="請選擇專卷主題" v-else>
            <el-option label="請選擇" value=""></el-option>
          </el-select>
        </div>
      </div>
    </transition>

    <div class="projSearch__listBox">
      <div class="projSearch__listBox--joinAnalysis">
        <span>
          <i class="el-icon-s-data"></i>
          <a>匯出</a>
        </span>

        <span @click="openRelationAnalysis()">
          <i class="el-icon-circle-plus-outline"></i>
          <a>關聯分析</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" empty-text="暫無數據">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column label="序號" type="index" width="50">
        </el-table-column>
        <el-table-column label="新聞標題" prop="newsTitle">
        </el-table-column>
        <el-table-column label="新聞時間" width="150">
          <!-- <template slot-scope="scope">{{ scope.row.newsTime | moment("YYYY-MM-DD HH:mm") }}</template> -->
        </el-table-column>
        <el-table-column label="新聞網站" prop="newsUrl">
        </el-table-column>
        <el-table-column label="新聞頻道" prop="newsChannel" width="100">
        </el-table-column>
        <el-table-column label="情緒指標" prop="sentiment" width="100">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      openSearchBox: true,
      //   listQuery: {
      //     UserId: 3,
      //     TopicId: 16,
      //     Page: 1,
      //     PageSize: 10,
      //   },
      projSort: "",
      projTheme: "",
      sortList: [],
      themeList: [],
      tableData: [],
      multipleSelection: [],
    };
  },
  computed: {
    getChild() {
      return (data) => {
        const getChildItem =
          data.filter((res) => res.name == this.projSort) || [];
        return getChildItem;
      };
    },
  },
  methods: {
    // getList() {
    //   this.$api.getDataByTopicId(this.listQuery).then((res) => {
    //     console.log(res.data);
    //     this.tableData = res.data;
    //   });
    // },
    /* 獲取專卷資料 */
    getList() {
      this.$api.getUserTopic({ UserId: 3 }).then((res) => {
        this.sortList = res.data.filter((resp) => resp.pid == null);
        const childrenList = res.data.filter((sup) => sup.pid !== null);
        this.themeList = this.sortList.map((p) => {
          p.children = childrenList.filter((c) => {
            return c.pid === p.id;
          });
          return p;
        });
      });
    },
    openRelationAnalysis() {
      let routeUrl = this.$router.resolve({ name: "relationAnalysis" });
      window.open(routeUrl.href, "_blank");
    },
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
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss">
.projSearch {
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
    padding: 20px;
    border-bottom: 1px solid #191972;

    label {
      font-weight: 600;
      color: #2a2a2a;
      letter-spacing: 2px;
      font-size: 18px;
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
      padding: 0 30px;
      box-sizing: border-box;
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