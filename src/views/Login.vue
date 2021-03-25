<template>
  <div id="login">
    <div class="loginCard">
      <div class="loginCard__title">
        <img src="@/assets/images/logo.png" alt="logo" width="180px">
        <strong>MS智能語意分析系統</strong>
      </div>

      <div class="loginCard__form">
        <div class="loginCard__form--infoCard">
          <div class="flex align-center justify-center">
            <label>帳號：</label>
            <input type="text" v-model="userInfo.account" placeholder="請輸入帳號">
          </div>
          <div class="flex align-center justify-center">
            <label>密碼：</label>
            <input type="password" v-model="userInfo.password" placeholder="請輸入密碼">
          </div>
          <button @click="login">登入</button>
        </div>
      </div>
    </div>

    <div class="loginCard__footer">
      <p>Copyright © 2020 minds Corporation.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        account: "Patrick",
        password: "abc1234",
      },
    };
  },
  methods: {
    login() {
      const info = {
        name: this.userInfo.account,
        pass: this.userInfo.password,
        SessionId: "",
        SourceIP: "",
      };
      this.$api.login(info).then((res) => {
        if (res.data.message == null) {
          this.setUserInfo(res.data);
          this.setUniMenu();
          this.$message({
            type: "success",
            message: "登入成功!",
          });
          this.$router.push("/Home");
        } else {
          this.$message.error(res.data.message);
          this.userInfo = {};
        }
      });
    },
    setUserInfo(data) {
      window.localStorage.userInfo = JSON.stringify(data);
    },
    async setUniMenu() {
      // 設置使用者菜單
      await this.$api.getMenu().then((res) => {
        let mainMenu = res.data.filter((main) => main.pid === 0);
        const childrenMenu = res.data.filter((children) => children.pid !== 0);
        const menuList = mainMenu.map((p) => {
          p.children = childrenMenu.filter((c) => {
            return c.pid === p.id;
          });
          return p;
        });
        window.localStorage.menu = JSON.stringify(menuList);
      });
    },
  },
};
</script>

<style lang="scss">
#login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(-45deg, transparent 55%, #191972 0) right,
    linear-gradient(45deg, transparent 15px, #00abb9 0) left;

  .loginCard {
    width: 100%;
    height: 100%;

    &__title {
      width: 100%;
      padding: 40px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      strong {
        font-size: 36px;
        letter-spacing: 5px;
        color: white;
      }
    }

    &__form {
      width: 100%;
      padding: 40px 200px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      &--infoCard {
        width: 400px;
        background: transparent;

        div {
          margin-bottom: 30px;

          label {
            min-width: 100px;
            max-width: 100px;
            font-size: 20px;
            color: white;
            letter-spacing: 10px;
          }

          input {
            width: 300px;
            border: none;
            padding: 8px;
            font-size: 16px;
            letter-spacing: 0.2rem;
          }
        }

        button {
          width: 100%;
          background: #191972;
          padding: 4px;
          border-radius: 8px;
          font-size: 20px;
          color: white;
          font-weight: bold;
          letter-spacing: 5px;
          transition: 0.6s;
          cursor: pointer;

          &:hover {
            background: #dfdff5;
            border: 3px solid #191972;
            color: #191972;
          }
        }
      }
    }

    &__footer {
      position: absolute;
      bottom: 1rem;
      width: 100%;
      text-align: center;

      p {
        margin-bottom: 0;
        font-size: 18px;
        color: white;
        letter-spacing: 2.5px;
      }
    }
  }
}
</style>