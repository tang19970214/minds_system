<template>
  <div class="entityManagePage">
    <transition name="moveT">
      <div class="entityManagePage__searchBox" v-if="openSearchBox">
        <div class="entityManagePage__searchBox--sort">
          <label>實體分類：</label>
          <el-select v-model="listQuery.catId" placeholder="請選擇實體分類" no-data-text="無數據" @change="filterCatId">
            <el-option label="全部" :value="0"></el-option>
            <el-option :label="item.name" :value="item.id" v-for="item in entitySortData" :key="item.id"></el-option>
          </el-select>
          <i class="el-icon-edit" @click="openEntityModal('edit')"></i>
          <i class="el-icon-plus" @click="openEntityModal('add')"></i>
          <i class="el-icon-delete-solid" @click="openEntityModal('del')"></i>
        </div>
      </div>
    </transition>

    <div class="entityManagePage__setting" @click="openSearchBox = !openSearchBox">
      <i class="el-icon-caret-bottom" :class="{'goRound': openSearchBox}"></i>
    </div>

    <div class="entityManagePage__listBox">
      <div class="entityManagePage__listBox--addEntity">
        <span @click="entityFunc('add')">
          <i class="el-icon-circle-plus-outline"></i>
          <a>新增實體</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" empty-text="暫無數據">
        <el-table-column label="序號" type="index" width="50"></el-table-column>
        <el-table-column label="實體名稱" prop="custPosName" width="150"></el-table-column>
        <el-table-column label="建立人" prop="createdUser" width="120"></el-table-column>
        <el-table-column label="建立時間" width="180">
          <template slot-scope="scope">
            <div>{{ scope.row.createdTime | moment("YYYY-MM-DD HH:mm:ss") }}</div>
          </template>
        </el-table-column>
        <el-table-column label="建立方式" prop="className" width="200">
          <template slot-scope="scope">
            <div>{{ (scope.row.isReg == 0) ? "自訂詞庫" : "自訂正則表達式" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="啟動" width="60">
          <template slot-scope="scope">
            <div>{{ (scope.row.enable == 1) ? "是" : "否" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="備註" prop="memo"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <div class="entityManagePage__listBox--userFunc">
              <!-- <el-tooltip effect="dark" content="啟動" placement="bottom">
                <el-button type="text" :disabled="scope.row.enable == 1" @click="entityFunc('play', scope.row)">
                  <font-awesome-icon icon="play-circle" />
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="停止" placement="bottom">
                <el-button type="text" :disabled="scope.row.enable == 0" @click="entityFunc('stop', scope.row)">
                  <font-awesome-icon icon="stop-circle" />
                </el-button>
              </el-tooltip> -->
              <el-tooltip effect="dark" content="編輯" placement="bottom">
                <el-button type="text" @click="entityFunc('edit', scope.row)">
                  <i class="el-icon-edit"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="刪除" placement="bottom">
                <el-button type="text" @click="entityFunc('del', scope.row)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- modal -->
    <!-- 新增、編輯實體分類 -->
    <el-dialog :title="entitySortModalTitle + '實體分類'" :visible.sync="entitySortModal" width="40%" center>
      <el-form :model="entitySortList" :rules="entitySortRules" ref="ruleForm_entitySortModal" label-width="120px">
        <el-form-item label="實體分類" prop="Name">
          <el-input v-model="entitySortList.Name"></el-input>
        </el-form-item>
        <el-form-item label="備註" prop="Memo">
          <el-input v-model="entitySortList.Memo"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEntitySort" v-if="entitySortModalTitle == '新增'">儲存</el-button>
        <el-button type="primary" @click="editEntitySort" v-else>修改</el-button>
        <el-button type="danger" @click="entitySortModal = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 新增實體 -->
    <el-dialog :title="custDefsTitle+'實體'" :visible.sync="entityModal" width="50%" center>
      <el-form :model="entityList" :rules="entityRules" ref="ruleForm_entityModal" label-width="120px">
        <!-- 實體分類 -->
        <el-form-item label="實體分類" prop="catId">
          <el-select v-model="entityList.catId" placeholder="請選擇實體分類">
            <el-option label="請選擇" value=""></el-option>
            <el-option :label="item.name" :value="item.id" v-for="item in entitySortData" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 實體名稱 -->
        <el-form-item label="實體名稱" prop="custPosName">
          <el-input v-model="entityList.custPosName"></el-input>
        </el-form-item>
        <!-- 設定方式 -->
        <div class="entityManagePage__entityModal">
          <label>設定方式</label>
          <div class="entityManagePage__entityModal--tab">
            <el-tabs class="w-full" type="border-card" v-model="getTabName">
              <!-- 上傳檔案 -->
              <el-tab-pane label="上傳檔案">
                <div class="uploadFiles">
                  <el-upload ref="imageUpload" class="upload-demo" action="" accept=".png,.jpg,.jpeg,.svg,.pdf" :http-request="customUpload" :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList">
                    <el-button size="small" type="primary">上傳</el-button>
                  </el-upload>
                </div>
              </el-tab-pane>
              <!-- 自訂正則表達式 -->
              <el-tab-pane label="自訂正則表達式">
                <div class="regularExpress">
                  <el-row class="regularExpress__title">
                    <el-col :span="6">
                      <label>正則表達式：</label>
                    </el-col>
                    <el-col :span="12">
                      <el-input v-model="regularText"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-button type="primary" @click="addRegular()">新增</el-button>
                    </el-col>
                  </el-row>

                  <el-row class="regularExpress__content">
                    <el-col :span="18">
                      <div class="regularExpress__content--param">
                        <el-checkbox-group v-model="checkedParam">
                          <el-checkbox v-for="(item, idx) in paramGroup" :label="item" :key="idx">{{item}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <!-- <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 6}" v-model="entityList.Param"></el-input> -->
                    </el-col>
                    <el-col :span="6">
                      <el-button type="primary" @click="removeRegular()">移除</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- 啟動 -->
        <el-form-item label="啟動">
          <el-radio v-model="entityList.enable" :label="1">是</el-radio>
          <el-radio v-model="entityList.enable" :label="0">否</el-radio>
        </el-form-item>
        <!-- 備註 -->
        <el-form-item label="備註">
          <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 6}" v-model="entityList.memo">
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCustDefs()" v-if="custDefsTitle == '新增'">儲存</el-button>
        <el-button type="primary" @click="updateCustDefs()" v-else>儲存</el-button>
        <el-button type="danger" @click="entityModal = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      listQuery: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        catId: 0,
      },
      openSearchBox: true,
      getTabName: "0",

      /* 實體分類 */
      entitySortData: [],
      entitySortModal: false,
      entitySortModalTitle: "",
      entitySortList: {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        Name: "",
        Memo: "",
      },
      entitySortRules: {
        Name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        Memo: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },

      /* 實體 */
      tableData: [],
      entityModal: false,
      custDefsTitle: "",
      entityList: {
        catId: "",
        custPosName: "",
        enable: 1,
        memo: "",
        createdUser: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        fileName: "",
        Param: "",
      },
      entityRules: {
        catId: [{ required: true, message: "此為必填欄位", trigger: "change" }],
        custPosName: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
        ],
      },
      fileList: [],
      regularText: "",
      checkedParam: [],
      paramGroup: [],
    };
  },
  methods: {
    getEntity() {
      this.$api
        .getCatList({
          UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        })
        .then((res) => {
          this.entitySortData = res.data;
        });
    },
    async getList() {
      await this.$api.getCustDefsList(this.listQuery).then((res) => {
        this.tableData = res.data;
        this.$store.dispatch("loadingHandler", false);
      });
    },
    filterCatId(val) {
      this.$store.dispatch("loadingHandler", true);
      this.getList();
    },
    openEntityModal(val) {
      switch (val) {
        case "edit":
          if (!!this.listQuery.catId) {
            this.entitySortModalTitle = "編輯";
            this.entitySortModal = true;

            const getEntity = this.entitySortData.filter(
              (res) => res.id == this.listQuery.catId
            )[0];
            this.entitySortList.Name = getEntity?.name;
            this.entitySortList.Memo = getEntity?.memo;
          } else {
            this.$notify({
              title: "警告",
              message: "請先選擇欲修改之實體分類！",
              type: "warning",
            });
          }
          break;
        case "add":
          this.entitySortList.Name = "";
          this.entitySortList.Memo = "";
          this.entitySortModalTitle = "新增";
          this.entitySortModal = true;
          break;
        case "del":
          if (!!this.listQuery.catId) {
            this.$confirm("確定要刪除嗎？", "提示", {
              confirmButtonText: "確定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delEntitySort();
              })
              .catch(() => {});
          } else {
            this.$notify({
              title: "警告",
              message: "請先選擇欲刪除之實體分類！",
              type: "warning",
            });
          }
          break;
      }
    },
    /* 新增實體分類 */
    addEntitySort() {
      this.$refs.ruleForm_entitySortModal.validate((valid) => {
        if (valid) {
          this.$store.dispatch("loadingHandler", true);
          this.$api.addCat(this.entitySortList).then((res) => {
            this.$notify({
              title: "成功",
              message: "新增成功！",
              type: "success",
            });
            this.getEntity();
            this.entitySortModal = false;
            this.$store.dispatch("loadingHandler", false);
          });
        }
      });
    },
    /* 編輯實體分類 */
    editEntitySort() {
      this.$refs.ruleForm_entitySortModal.validate((valid) => {
        if (valid) {
          this.$store.dispatch("loadingHandler", true);
          const getEntity = this.entitySortData.filter(
            (res) => res.id == this.listQuery.catId
          )[0];
          const editData = {
            UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
            Id: getEntity?.id,
            Name: this.entitySortList.Name,
            Memo: this.entitySortList.Memo,
          };
          this.$api.updateCat(editData).then((res) => {
            this.$notify({
              title: "成功",
              message: "修改成功！",
              type: "success",
            });
            this.getEntity();
            this.entitySortModal = false;
          });
          this.$store.dispatch("loadingHandler", false);
        }
      });
    },
    /* 刪除實體分類 */
    delEntitySort() {
      this.$store.dispatch("loadingHandler", true);
      const delInfo = {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        Id: this.listQuery.catId,
      };
      this.$api.deleteCat(delInfo).then((res) => {
        this.$notify({
          title: "成功",
          message: "刪除成功！",
          type: "success",
        });
        this.getEntity();
        this.listQuery.catId = "";
        this.$store.dispatch("loadingHandler", false);
      });
    },

    entityFunc(val, item) {
      switch (val) {
        case "add":
          this.entityList = {
            catId: "",
            custPosName: "",
            enable: 1,
            memo: "",
            createdUser: JSON.parse(window.localStorage.getItem("userInfo"))
              .userId,
            fileName: "",
            Param: "",
          };
          this.paramGroup = [];
          this.getTabName = "0";
          this.custDefsTitle = "新增";
          this.entityModal = true;
          break;
        case "edit":
          console.log(item);
          if (!!item.param) {
            this.getTabName = "1";
            this.paramGroup = JSON.parse(item.param);
          }
          this.custDefsTitle = "編輯";
          this.entityModal = true;
          this.entityList = item;
          break;
        case "del":
          this.$confirm("確定要刪除此實體嗎？", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.delCustDefs(item.id);
            })
            .catch(() => {});
          break;
      }
    },
    addCustDefs() {
      if (this.getTabName == 0) {
        /* 上傳檔案 */
        this.entityList.Param = "";
      } else {
        /* 自訂正則表達式 */
        this.entityList.fileName = "";
        this.entityList.Param = JSON.stringify(this.paramGroup);
      }
      this.$refs.ruleForm_entityModal.validate((valid) => {
        if (valid) {
          this.$store.dispatch("loadingHandler", true);
          this.$api.addCustDefs(this.entityList).then((res) => {
            if (res.data) {
              this.$notify({
                title: "成功",
                message: "新增成功！",
                type: "success",
              });
            } else {
              this.$notify({
                title: "錯誤",
                message: "未知的錯誤！",
                type: "error",
              });
            }
            this.entityList = {
              custPosName: "",
              enable: 1,
              memo: "",
              fileName: "",
              Param: "",
            };
            this.paramGroup = "";
            this.entityModal = false;
            this.getList();
          });
        }
      });
    },
    updateCustDefs() {
      this.$store.dispatch("loadingHandler", true);
      if (this.getTabName == 0) {
        /* 上傳檔案 */
        this.entityList.Param = "";
      } else {
        /* 自訂正則表達式 */
        this.entityList.fileName = "";
        this.entityList.Param = JSON.stringify(this.paramGroup);
      }
      this.$api.updateCustDefs(this.entityList).then((res) => {
        this.$notify({
          title: "成功",
          message: "修改成功！",
          type: "success",
        });
        this.entityModal = false;
        this.getList();
        this.$store.dispatch("loadingHandler", false);
      });
    },
    delCustDefs(id) {
      this.$store.dispatch("loadingHandler", true);
      const delQuery = {
        UserId: JSON.parse(window.localStorage.getItem("userInfo")).userId,
        Id: id,
      };
      this.$api.deleteCustDefs(delQuery).then((res) => {
        if (res.data) {
          this.$notify({
            title: "成功",
            message: "刪除成功！",
            type: "success",
          });
        } else {
          this.$notify({
            title: "錯誤",
            message: "未知的錯誤！",
            type: "error",
          });
        }
        this.getList();
      });
    },

    handleRemove() {
      this.fileList = [];
    },
    handleExceed() {
      this.$notify({
        title: "警告",
        message: "最多只能上傳1個檔案！",
        type: "warning",
      });
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`確定要移除 ${file.name}？`, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    customUpload(file) {
      const vm = this;
      let formData = new FormData();
      formData.append("files", file.file, file.file.name);
      this.$api
        .upload(formData)
        .then((res) => {
          const fileInfo = {
            name: res.data.dbPath,
            url: "http://msapi.autoware.com.tw/" + res.data.dbPath,
          };
          this.fileList.push(fileInfo);
          this.entityList.fileName = this.fileList[0].url;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addRegular() {
      if (!!this.regularText) {
        const regularArr = [this.regularText];
        this.paramGroup.push(this.regularText);
        this.regularText = "";
      } else {
        this.$notify({
          title: "警告",
          message: "請輸入正則表達式！",
          type: "warning",
        });
      }
    },
    removeRegular() {
      let newArr = this.paramGroup.filter(
        (res) => !this.checkedParam.includes(res)
      );
      this.paramGroup = newArr;
    },
  },
  mounted() {
    this.$store.dispatch("loadingHandler", true);
    this.getEntity();
    this.getList();
  },
};
</script>

<style lang="scss">
.entityManagePage {
  width: 100%;
  height: 100vh;
  position: relative;

  &__setting {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #191970;

    i {
      font-size: 20px;
      padding: 0 16px;
      transition: 0.4s;
      cursor: pointer;

      &.goRound {
        transform: rotate(180deg);
      }

      &:hover {
        color: #00abb9;
      }
    }
  }

  &__searchBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #191972;

    &--sort {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      label {
        font-weight: 600;
        color: #2a2a2a;
        letter-spacing: 2px;
        font-size: 18px;
      }

      .el-select {
        min-width: 300px !important;
      }

      i {
        font-weight: bold;
        font-size: 24px;
        padding: 0 12px;
        transition: 0.6s;
        cursor: pointer;

        &:hover {
          font-size: 28px;
          color: #00abb9;
        }
      }
    }
  }

  &__listBox {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    &--addEntity {
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

        &:hover {
          letter-spacing: 2px;
        }
      }
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

  &__entityModal {
    width: 100%;
    padding-bottom: 16px;
    display: flex;

    label {
      min-width: 108px;
      max-width: 108px;
      font-weight: bold;
      font-size: 18px;
      color: white;
      letter-spacing: 2px;
      text-align: right;
      padding-right: 12px;
      padding-bottom: 8px;
    }

    &--tab {
      width: calc(100% - 120px);
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .el-tabs {
        .is-active {
          color: #191970 !important;
          font-weight: bold;
          letter-spacing: 2px;
        }
      }

      .uploadFiles {
        label {
          color: #2d2d2d;
          padding: 0;
          font-size: 14px;
        }
      }

      .regularExpress {
        &__title {
          width: 100%;
          display: flex;
          align-items: center;
          padding-bottom: 16px;

          label {
            color: #2d2d2d;
            font-size: 16px;
          }

          .el-col:last-child {
            text-align: center;
          }
        }

        &__content {
          width: 100%;
          display: flex;
          align-items: center;

          .el-col:last-child {
            text-align: center;
          }

          &--param {
            width: 100%;
            min-height: 150px;
            max-height: 150px;
            padding: 16px;
            box-sizing: border-box;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            overflow-y: auto;

            .el-checkbox {
              min-width: 100%;
              max-width: 100%;
              margin: 0;
              text-align: left;
              &__label {
                color: #191970;
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }

  .is-checked {
    .el-radio {
      &__inner {
        background: #191970;
      }
      &__label {
        color: #191970;
        font-weight: bold;
      }
    }
  }
}
</style>