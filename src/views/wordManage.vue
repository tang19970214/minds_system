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
            <el-select v-model="listQuery.TermTypeId" @change="getWordClass" placeholder="請選擇詞庫類別" no-data-text="無數據">
              <el-option label="請選擇" value=""></el-option>
              <el-option :label="item.termName" :value="item.id" v-for="item in wordClassList" :key="item.id"></el-option>
            </el-select>
          </div>

          <div class="sort">
            <label>實體詞分類：</label>
            <el-select v-model="listQuery.EntityTypeId" placeholder="請選擇實體詞分類" no-data-text="無數據" :disabled="listQuery.TermTypeId !== '實體詞'">
              <el-option label="請選擇" value=""></el-option>
              <el-option v-for="item in entityList" :key="item.id" :label="item.entityName" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>

        <div class="wordManage__searchBox--searchStr">
          <div class="keyword">
            <label>關鍵字：</label>
            <el-input v-model="listQuery.query"></el-input>
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序號" width="60"></el-table-column>
        <el-table-column label="監控詞">
          <template slot-scope="scope">
            {{scope.row}}}
          </template>
        </el-table-column>
        <el-table-column label="過濾詞">
          <template slot-scope="scope">
            {{scope.row}}}
          </template>
        </el-table-column>
        <el-table-column label="實體詞">
          <template slot-scope="scope">
            {{scope.row}}}
          </template>
        </el-table-column>
        <el-table-column label="同義詞">
          <template slot-scope="scope">
            {{scope.row}}}
          </template>
        </el-table-column>
        <el-table-column label="新詞">
          <template slot-scope="scope">
            {{scope.row}}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <div>
              <el-tooltip effect="dark" content="編輯" placement="bottom">
                <el-button type="text" @click="editWordManage(scope.row)">
                  <i class="el-icon-edit"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip effect="dark" content="刪除" placement="bottom">
                <el-button type="text" @click="delWordManage(scope.row)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-tooltip>
            </div>
          </template>
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
      listQuery: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        Query: "", // keyword
        TermTypeId: 3, // 選擇詞庫類別
        EntityTypeId: 1, // 選擇實體詞分類
      },
      wordClassList: [],
      entityList: [],

      tableData: [],
      multipleSelection: [],
    };
  },
  methods: {
    getKeyClass() {
      this.$api
        .getTermTypeList({
          UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        })
        .then((res) => {
          this.wordClassList = res.data;
        });
    },
    getEntityTypeList() {
      this.$api
        .getEntityTypeList({
          UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        })
        .then((res) => {
          this.entityList = res.data;
        });
    },
    /* 取得所選詞庫類別 */
    getWordClass(val) {
      if (val == "實體詞") {
        this.getEntityTypeList();
      } else {
        this.listQuery.EntityTypeId = "";
      }
    },
    async getList() {
      await this.$api.getTermInfoList(this.listQuery).then((res) => {
        this.tableData = res.data;
        this.$store.dispatch("loadingHandler", false);
      });
    },
    searchWord() {
      console.log(this.listQuery);
    },
    editWordManage(data) {},
    delWordManage(data) {},
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