<template>
  <div class="projEdit">

    <div class="projEdit__leftBox" :style="checkLeftBoxWidth.leftBox">
      <transition name="moveL">
        <div class="body" v-if="openLeftBox">
          <div class="body__projSort">
            <strong>專卷分類：</strong>
            <el-select v-model="searchSort" placeholder="請選擇">
              <el-option label="請選擇" value=""></el-option>
              <el-option :label="item.name" :value="item.name" v-for="item in projSortList" :key="item.id"></el-option>
            </el-select>
            <el-tooltip effect="dark" content="新增專卷分類" placement="bottom">
              <i class="el-icon-plus" @click="openAddProjSort = true"></i>
            </el-tooltip>
          </div>

          <div class="body__addTheme">
            <span @click="checkSort()">
              <i class="el-icon-circle-plus-outline"></i>
              <a>新增主題</a>
            </span>
          </div>

          <div class="body__projTheme">
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="id" label="序號" width="60px"></el-table-column>
              <el-table-column prop="name" label="專卷主題"></el-table-column>
            </el-table>
          </div>
        </div>
      </transition>

      <div class="projEdit__leftBox--shrinkLeftBox" :style="checkLeftBoxWidth.shrink">
        <i class="el-icon-caret-left" @click="openLeftBox = false" v-if="openLeftBox"></i>
        <i class="el-icon-caret-right" @click="openLeftBox = true" v-else></i>
      </div>
    </div>

    <div class="projEdit__rightBox" :style="checkLeftBoxWidth.rightBox">
      <div class="projEdit__rightBox--infoBox">
        <el-row>
          <el-col :span="12">
            <strong>專卷分類：</strong>
            <p>{{searchSort}}</p>
          </el-col>
          <el-col :span="12">
            <strong>備註：</strong>
          </el-col>
          <el-col :span="12">
            <strong>專卷主題：</strong>
          </el-col>
        </el-row>
      </div>

      <div class="projEdit__rightBox--contentBox">
        <div class="relationBtn">
          <span @click="openSearchRelation = true">
            <i class="el-icon-search"></i>
            <strong>搜尋關聯分析內容</strong>
          </span>
        </div>

        <!-- 關聯分析 -->
        <el-transfer class="relationList" v-model="relationValue" :data="relationList" :titles="['現有分析內容', '候選關聯新聞']"></el-transfer>

        <div class="relationFuncBtn">
          <el-button type="primary">儲存</el-button>
          <el-button type="danger">取消</el-button>
        </div>
      </div>
    </div>

    <!-- modal -->
    <!-- add projSort -->
    <el-dialog title="新增專卷分類" :visible.sync="openAddProjSort" width="50%" center>
      <el-form :model="addProjSort" :rules="rules_addProjSort" ref="ruleForm_addProjSort" label-width="110px">
        <el-form-item label="專卷分類" prop="name">
          <el-input v-model="addProjSort.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSort()">新增</el-button>
        <el-button type="danger" @click="openAddProjSort = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- add projTheme -->
    <el-dialog title="新增專卷主題" :visible.sync="openAddProjTheme" width="50%" center>
      <el-form :model="addProjTheme" :rules="rules_addProjTheme" ref="ruleForm_addProjTheme" label-width="110px">
        <el-form-item label="專卷分類">
          <strong class="modal__title">{{searchSort}}</strong>
        </el-form-item>
        <el-form-item label="專卷主題" prop="name">
          <el-input v-model="addProjTheme.name"></el-input>
        </el-form-item>
        <el-form-item label="備註" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="addProjTheme.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTheme()">新增</el-button>
        <el-button type="danger" @click="openAddProjTheme = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- search relation -->
    <el-dialog class="searchRelationModal" title="" :visible.sync="openSearchRelation" width="70%" center>
      <div class="searchRelationModal__searchBox">
        <el-row>
          <el-col :span="12">
            <strong>搜尋日期：</strong>
            <el-date-picker v-model="searchRelation.dateRange" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="12">
            <strong>搜尋來源：</strong>
            <el-select v-model="searchRelation.searchFrom" placeholder="請選擇">
              <el-option label="選項待補" value=""></el-option>
            </el-select>
          </el-col>
          <el-col :span="24">
            <el-input type="text" v-model="searchRelation.keyword"></el-input>
            <el-button type="primary">搜尋</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="searchRelationModal__listBox">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="新聞標題" prop="newsTitle">
          </el-table-column>
          <el-table-column label="新聞時間" width="150">
            <template slot-scope="scope">{{ scope.row.newsTime | moment("YYYY-MM-DD HH:mm") }}</template>
          </el-table-column>
          <el-table-column label="新聞網站" prop="newsUrl">
          </el-table-column>
          <el-table-column label="新聞頻道" prop="newsChannel" width="100">
          </el-table-column>
          <el-table-column label="情緒指標" prop="sentiment" width="100">
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="join()">加入</el-button>
        <el-button type="danger" @click="openSearchRelation = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      openLeftBox: true,
      searchSort: "",
      projSortList: [],
      tableData: [],
      //   專卷分類modal
      openAddProjSort: false,
      addProjSort: {
        name: "",
      },
      rules_addProjSort: {
        name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },
      // 專卷主題modal
      openAddProjTheme: false,
      addProjTheme: {
        name: "",
        remark: "",
      },
      rules_addProjTheme: {
        name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        remark: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },
      // 關聯分析modal
      openSearchRelation: false,
      searchRelation: {
        dateRange: "",
        searchFrom: "",
        keyword: "",
      },
      tableData: [],
      multipleSelection: [],

      relationValue: [],
      relationList: [],
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
    getProjSortList() {
      this.$api.getUserTopic({ UserId: 3 }).then((res) => {
        this.projSortList = res.data;
        this.tableData = res.data;
      });
    },
    async getRelationList() {
      const listQuery = {
        UserId: 3,
        TopicId: 16,
        Page: 1,
        PageSize: 10,
      };
      await this.$api.getDataByTopicId(listQuery).then((res) => {
        const newData = [];
        res.data.forEach((element) => {
          newData.push({
            key: element.id,
            label: element.newsId.toString(),
          });
        });
        console.log(newData);
        this.relationList = newData;
      });
    },
    getNewsList() {
      const newsListQuery = {
        userId: 1,
        sDate: "2021-01-01",
        eDate: "2021-12-31",
        query: "",
        nSite: "全部",
        nChannel: "全部",
        page: 1,
        pageSize: 10,
      };
      this.$api.getNewsList(newsListQuery).then((res) => {
        console.log(res);
        this.tableData = res.data;
      });
    },
    addSort() {
      this.$refs.ruleForm_addProjSort.validate((valid) => {
        if (valid) {
          const sortQuery = {
            OrgId: 2,
            UserId: 3,
            Name: this.addProjSort.name,
            Action: "http://localhost/aaa",
            Memo: "",
            SortOrder: 1,
            Pid: null,
            isShare: 0,
            isActive: 1,
          };
          this.$api.addUserTopic(sortQuery).then((res) => {
            if (res.data) {
              this.$message({
                message: "新增成功！",
                type: "success",
              });
              this.getProjSortList();
              this.openAddProjSort = false;
            }
          });
        }
      });
    },
    checkSort() {
      if (!!this.searchSort) {
        this.openAddProjTheme = true;
      } else {
        this.$message({
          message: "請先選擇『專卷分類』！",
          type: "warning",
        });
      }
    },
    addTheme() {
      this.$refs.ruleForm_addProjTheme.validate((valid) => {
        if (valid) {
          const sortQuery = {
            OrgId: 2,
            UserId: 3,
            Name: this.addProjSort.name,
            Action: "http://localhost/aaa",
            Memo: this.addProjTheme.remark,
            SortOrder: 1,
            Pid: null,
            isShare: 0,
            isActive: 1,
          };
          this.$api.addUserTopic(sortQuery).then((res) => {
            if (res.data) {
              this.$message({
                message: "新增成功！",
                type: "success",
              });
              this.getProjSortList();
              this.openAddProjTheme = false;
            }
          });
        }
      });
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
    this.getProjSortList();
    this.getRelationList();
    this.getNewsList();
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
    width: 25%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    border-right: 1px solid black;

    .body {
      width: 95%;
      min-height: 100vh;
      padding: 12px;
      box-sizing: border-box;
      border-right: 1px solid black;

      &__projSort {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #191970;

        .el-select {
          width: 150px !important;
        }

        i {
          font-weight: bolder;
          font-size: 24px;
          transition: 0.5s;
          cursor: pointer;

          &:hover {
            transform: scale(1.2);
          }
        }
      }

      &__addTheme {
        width: 100%;
        padding-top: 36px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        span {
          transition: 0.6s;
          cursor: pointer;
          i,
          a {
            padding: 0 2px;
            font-size: 18px;
            font-weight: bold;
            color: #191972;
          }

          &:hover {
            letter-spacing: 2px;
          }
        }
      }

      &__projTheme {
        width: 100%;
        padding-top: 32px;
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
    width: 75%;
    height: 100%;

    &--infoBox {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
      border-bottom: 1px solid black;

      .el-col {
        padding: 8px 0;
        display: flex;
        align-items: center;

        strong {
          color: #191970;
          font-size: 20px;
          letter-spacing: 2px;
        }

        p {
          margin: 0;
          font-size: 18px;
          font-weight: bolder;
          letter-spacing: 3px;
        }
      }
    }

    &--contentBox {
      width: 100%;

      .relationBtn {
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        span {
          display: flex;
          align-items: center;
          transition: 0.5s;
          color: #191970;
          cursor: pointer;

          i {
            font-weight: bolder;
            font-size: 20px;
            padding-right: 4px;
          }

          &:hover {
            transform: scale(1.1);
          }
        }
      }

      .relationList {
        width: 100%;
        padding: 16px 0 32px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid black;

        .el-transfer {
          &-panel {
            width: 40% !important;
          }
          &-panel__empty {
            display: none !important;
          }
        }
      }

      .relationFuncBtn {
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .modal {
    &__title {
      color: white;
      font-size: 20px;
      letter-spacing: 2.5px;
    }
  }

  .searchRelationModal {
    .el-dialog {
      background: white !important;
    }

    &__searchBox {
      width: 100%;
      padding-bottom: 32px;
      border-bottom: 1px solid black;

      .el-col {
        display: flex;
        align-items: center;

        strong {
          min-width: 90px;
          max-width: 90px;
          font-size: 18px;
        }

        .el-select {
          width: 350px !important;
        }

        button {
          margin-left: 16px;
        }

        &:last-child {
          padding: 32px 80px 0 80px;
        }
      }
    }

    &__listBox {
      width: 100%;
      padding-top: 32px;
    }
  }
}
</style>