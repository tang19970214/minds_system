<template>
  <div class="wordManage">
    <div class="wordManage__setting" @click="openSearchBox = !openSearchBox">
      <strong>查詢設定</strong>
    </div>

    <transition name="moveR">
      <div class="wordManage__searchBox" v-if="openSearchBox">
        <div class="wordManage__searchBox--kindAndSort">
          <div class="kind">
            <label>維護詞庫類別：</label>
            <el-select v-model="wordQuery.TermTypeId" placeholder="請選擇詞庫類別" no-data-text="無數據">
              <el-option label="請選擇" value=""></el-option>
              <el-option :label="item.termName" :value="item.termName" v-for="item in wordClassList" :key="item.id"></el-option>
            </el-select>
          </div>

          <div class="sort">
            <label>實體詞分類：</label>
            <el-select v-model="wordQuery.EntityTypeId" placeholder="請選擇實體詞分類" no-data-text="無數據" :disabled="wordQuery.TermTypeId !== '實體詞'">
              <el-option label="請選擇" value="">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="wordManage__searchBox--searchStr">
          <div class="keyword">
            <label>關鍵字：</label>
            <el-input v-model="wordQuery.query"></el-input>
          </div>
          <el-button type="primary" @click="searchWord()">查詢</el-button>
        </div>
      </div>
    </transition>

    <div class="wordManage__listBox">
      <div class="wordManage__listBox--add">
        <span>
          <i class="el-icon-plus"></i>
          <a>新增</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" empty-text="暫無數據">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序號" width="60">
        </el-table-column>
        <el-table-column prop="keyWord" label="關鍵字" width="150">
        </el-table-column>
        <el-table-column prop="tf" label="詞頻" width="60">
        </el-table-column>
        <el-table-column label="關聯關鍵字">
          <template slot-scope="scope">
            <div class="wordManage__listBox--tableKeyword" v-for="(item, index) in scope.row.rels" :key="index">
              {{item}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="備註">
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
      wordQuery: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        OrgId: 1,
        Query: "", // keyword
        TermTypeId: "", // 選擇詞庫類別
        EntityTypeId: "", // 選擇實體詞分類
      },
      listQuery: {
        UserId: 3,
        sDate: "2020-01-01",
        eDate: "2021-12-31",
        TopCount: 3,
      },
      wordClassList: [],
      entityList: [],

      tableData: [],
      multipleSelection: [],
    };
  },
  methods: {
    getKeyClass() {
      this.$api.getTermTypeList(this.wordQuery).then((res) => {
        this.wordClassList = res.data;
      });
    },
    getEntityTypeList() {
      this.$api.getEntityTypeList().then((res) => {
        console.log(res);
      });
    },
    async getList() {
      await this.$api.getKeyWord(this.listQuery).then((res) => {
        // console.log(res.data);
        this.tableData = res.data;
        this.$store.dispatch("loadingHandler", false);
      });
    },
    searchWord() {
      console.log(this.wordQuery);
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
    this.$store.dispatch("loadingHandler", true);
    this.getKeyClass();
    // this.getEntityTypeList();
    this.getList();
  },
};
</script>

<style lang="scss">
.wordManage {
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
        i {
          padding-right: 4px;
        }

        &:hover {
          letter-spacing: 2px;
        }
      }
    }

    &--tableKeyword {
      display: inline;
      align-items: center;
      &::after {
        content: "、";
      }

      &:last-child {
        &::after {
          content: "";
        }
      }
    }
  }
}
</style>