<template>
  <div class="login">
    <div class="login__header">
      <div class="login__header--title">
        <img src="@/assets/images/logo.png" alt="logo" width="180px">
        <strong>MS智能語意分析系統</strong>
      </div>
    </div>

    <div class="login__func">
      <div class="login__func--infoCard">
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

    <div class="footer">
      <p>Copyright © 2020 minds Corporation.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        account: "patrick@gmail.com",
        password: "abc1234",
      },
    };
  },
  methods: {
    async login() {
      this.$store.dispatch("loadingHandler", true);
      const info = {
        name: this.userInfo.account,
        pass: this.userInfo.password,
        SessionId: "",
        SourceIP: "",
      };
      await this.$api.login(info).then((res) => {
        if (res.data.message == null) {
          this.setUserInfo(res.data);
          this.setUniMenu();
          this.$message({
            showClose: true,
            type: "success",
            message: "登入成功!",
          });
          this.$store.dispatch("loadingHandler", false);
          this.$router.push("/Home");
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.data.message,
          });
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
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  background: linear-gradient(-45deg, transparent 55%, #191972 0) right,
    linear-gradient(45deg, transparent 15px, #00abb9 0) left;

  @media (min-width: 1024px) {
    flex-direction: row;
  }

  &__header {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    &--title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      strong {
        font-size: 36px;
        letter-spacing: 5px;
        color: white;
      }
    }
  }

  &__func {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    @media (min-width: 450px) {
      align-items: center;
    }

    &--infoCard {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      div {
        margin-bottom: 30px;
        display: flex;
        flex-direction: column;

        @media (min-width: 450px) {
          flex-direction: row;
        }

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
        width: calc(100% - 20px);
        max-width: 400px;
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

  .footer {
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
</style>