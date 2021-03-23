<template>
  <div class="projEdit">
    <div class="projEdit__leftBox">

      <div class="projEdit__leftBox--projSort">
        <strong>專卷分類：</strong>
        <el-select v-model="searchSort" placeholder="請選擇">
          <el-option label="請選擇" value=""></el-option>
          <el-option :label="item.name" :value="item.name" v-for="item in projSortList" :key="item.id"></el-option>
        </el-select>
        <el-tooltip effect="dark" content="新增專卷分類" placement="bottom">
          <i class="el-icon-plus" @click="openAddProjSort = true"></i>
        </el-tooltip>
      </div>

      <div class="projEdit__leftBox--addTheme">
        <span @click="checkSort()">
          <i class="el-icon-circle-plus-outline"></i>
          <a>新增主題</a>
        </span>
      </div>

      <div class="projEdit__leftBox--projTheme">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="id" label="序號" width="60px"></el-table-column>
          <el-table-column prop="name" label="專卷主題"></el-table-column>
        </el-table>
      </div>
    </div>

    <div class="projEdit__rightBox">
      右邊
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchSort: "",
      projSortList: [],
      tableData: [],
      openAddProjSort: false,
      addProjSort: {
        name: "",
      },
      rules_addProjSort: {
        name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },

      openAddProjTheme: false,
      addProjTheme: {
        name: "",
        remark: "",
      },
      rules_addProjTheme: {
        name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        remark: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },
    };
  },
  methods: {
    getProjSortList() {
      this.$api.getUserTopic({ UserId: 3 }).then((res) => {
        this.projSortList = res.data;
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
    },
  },
  mounted() {
    this.getProjSortList();
  },
};
</script>

<style lang="scss">
.projEdit {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  &__leftBox {
    width: 25%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    border: 1px solid black;

    &--projSort {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: #191970;

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

    &--addTheme {
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

    &--projTheme {
      width: 100%;
      padding-top: 32px;
    }
  }

  &__rightBox {
    width: 75%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }

  .modal {
    &__title {
      color: white;
      font-size: 20px;
      letter-spacing: 2.5px;
    }
  }
}
</style>