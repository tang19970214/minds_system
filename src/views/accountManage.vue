<template>
  <div class="accountManage">
    <div class="accountManage__title">
      <strong>帳號管理</strong>
    </div>

    <div class="accountManage__listBox">
      <div class="accountManage__listBox--add" v-if="userList.length > 1">
        <span @click="setAccountFunc('add')">
          <i class="el-icon-plus"></i>
          <a>新增</a>
        </span>
      </div>

      <el-table ref="multipleTable" :data="userList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" empty-text="暫無數據">
        <el-table-column type="index" label="序號" width="50"></el-table-column>
        <el-table-column label="使用者名稱" prop="name" width="200"></el-table-column>
        <el-table-column label="使用者角色" prop="roleName" width="150"></el-table-column>
        <el-table-column label="上次登錄時間">
          <template slot-scope="scope">{{ scope.row.lastLoginTime | moment("YYYY-MM-DD HH:mm:ss") }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <div class="accountManage__listBox--userFunc" v-if="userList.length > 1">
              <el-tooltip effect="dark" content="編輯" placement="bottom">
                <el-button type="text" @click="setAccountFunc('edit', scope.row)">
                  <i class="el-icon-edit"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip effect="dark" content="刪除" placement="bottom">
                <el-button type="text" @click="setAccountFunc('del', scope.row)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-tooltip>
            </div>
            <el-button type="text" size="small" @click.native.prevent="changePWD(scope.$index, scope.row)" v-else>
              變更密碼
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- modal -->
    <!-- 新增或編輯帳號 -->
    <el-dialog :title="setAccountTitle + '帳號'" :visible.sync="setAccount" width="60%" center>
      <el-form :model="userQuery" :rules="rules_setAccount" ref="ruleForm_setAccount" label-width="180px">
        <el-form-item label="使用者名稱" prop="name">
          <el-input v-model="userQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="使用者角色" prop="roleLevel">
          <el-select class="w-full" v-model="userQuery.roleLevel" placeholder="請選擇角色">
            <el-option label="管理者" value="2"></el-option>
            <el-option label="使用者" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用者單位" prop="comDep">
          <el-input v-model="userQuery.comDep"></el-input>
        </el-form-item>
        <el-form-item label="使用者聯絡資訊" prop="contractInfo">
          <el-input v-model="userQuery.contractInfo"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="使用者帳號" prop="email">
          <el-input v-model="userQuery.email" :disabled="setAccountTitle=='編輯'"></el-input>
        </el-form-item>
        <el-form-item label="使用者密碼" prop="pass">
          <el-input v-model="userQuery.pass" show-password :disabled="setAccountTitle=='編輯'"></el-input>
        </el-form-item>
        <el-form-item label="請再次輸入密碼" prop="checkPass">
          <el-input v-model="userQuery.checkPass" show-password :disabled="setAccountTitle=='編輯'"></el-input>
        </el-form-item>
        <el-form-item label="備註" prop="memo">
          <el-input v-model="userQuery.memo" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :disabled="setAccountTitle=='編輯'"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser()">儲存</el-button>
        <el-button type="danger" @click="setAccount = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 變更密碼 -->
    <el-dialog title="變更密碼" :visible.sync="changePWD_func" width="60%" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px">
        <el-form-item label="請輸入舊密碼" prop="oldPWD">
          <el-input v-model="ruleForm.oldPWD" show-password></el-input>
        </el-form-item>
        <el-form-item label="請輸入新密碼" prop="newPWD">
          <el-input v-model="ruleForm.newPWD" show-password></el-input>
        </el-form-item>
        <el-form-item label="請再次輸入新密碼" prop="checkPWD">
          <el-input v-model="ruleForm.checkPWD" show-password></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePWD_func = false">儲存</el-button>
        <el-button type="danger" @click="changePWD_func = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var addValidatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("此為必填欄位"));
      } else if (value !== this.userQuery.pass) {
        callback(new Error("兩次密碼輸入不一致"));
      } else {
        callback();
      }
    };
    var changePWDValidatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("此為必填欄位"));
      } else if (value !== this.ruleForm.newPWD) {
        callback(new Error("兩次密碼輸入不一致"));
      } else {
        callback();
      }
    };
    return {
      getUserRole: "",
      tableData: [],
      userList: [],
      multipleSelection: [],
      setAccount: false,
      setAccountTitle: "",
      /* 新增帳號 */
      userQuery: {
        comId: "",
        comName: "",
        comDep: "",
        email: "",
        memo: "",
        contractInfo: "",
        name: "",
        pass: "",
        checkPass: "",
        retry: 1,
        isActive: 1,
        roleLevel: "",
      },
      rules_setAccount: {
        name: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        roleLevel: [
          { required: true, message: "請選擇使用者角色", trigger: "change" },
        ],
        comDep: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        contractInfo: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
        ],
        email: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        pass: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        checkPass: [
          { required: true, validator: addValidatePass2, trigger: "blur" },
        ],
        memo: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
      },
      /* 變更密碼 */
      changePWD_func: false,
      ruleForm: {
        oldPWD: "",
        newPWD: "",
        checkPWD: "",
      },
      rules: {
        oldPWD: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        newPWD: [{ required: true, message: "此為必填欄位", trigger: "blur" }],
        checkPWD: [
          {
            required: true,
            validator: changePWDValidatePass2,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getUserList() {
      const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      let userData = [];
      await this.$api
        .getUserList({
          ComId: userInfo.comId,
        })
        .then((res) => {
          userData = res.data;
        });

      if (userInfo.roleLevel === 2) {
        this.userList = userData;
      } else {
        this.userList = userData.filter(
          (resp) => resp.name == userInfo.name && resp.email == userInfo.email
        );
      }
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
    setAccountFunc(val, data) {
      switch (val) {
        case "add":
          this.userQuery = {
            comId: "",
            comName: "",
            comDep: "",
            email: "",
            memo: "",
            contractInfo: "",
            name: "",
            pass: "",
            checkPass: "",
            retry: 1,
            isActive: 1,
            roleLevel: "",
          };
          this.setAccountTitle = "新增";
          this.setAccount = true;
          break;
        case "edit":
          this.setAccountTitle = "編輯";
          this.userQuery = data;
          this.setAccount = true;
          break;
        case "del":
          this.$confirm("確定要刪除『" + data.name + "』嗎？", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              //   this.delUser();
            })
            .catch(() => {});
          break;
      }
    },
    changePWD(idx, item) {
      console.log(idx, item);
      this.changePWD_func = true;
    },
    addUser() {
      const vm = this;
      vm.$refs.ruleForm_setAccount.validate((valid) => {
        if (valid) {
          console.log(vm.userQuery);
        }
      });
      //   this.$api.addUser(userQuery).then((res) => {
      //     console.log(res);
      //   });
    },
  },
  mounted() {
    this.getUserList();
    this.tableData = [JSON.parse(window.localStorage.getItem("userInfo"))];
    this.getUserRole = JSON.parse(
      window.localStorage.getItem("userInfo")
    ).roleLevel;
  },
};
</script>

<style lang="scss">
.accountManage {
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;

  &__title {
    width: 100%;
    padding-top: 20px;
    text-align: center;

    strong {
      color: #191972;
      letter-spacing: 2px;
      font-size: 26px;
    }
  }

  &__listBox {
    width: 100%;
    margin-top: 40px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    flex-direction: column;

    &--add {
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

    &--userFunc {
      span {
        font-size: 24px;
        color: #191970;
        i {
          transition: 0.3s;
          &:hover {
            transform: scale(1.2);
          }
        }
      }
    }
  }
}
</style>