<template>
  <div id="loadingPage" v-if="$store.state.loading">
    <div class="BG"></div>
    <div class="Icon">
      <div class="Icon__circle"></div>
    </div>
  </div>
</template>

<style lang="scss">
#loadingPage {
  .BG {
    z-index: 9999;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba($color: #eeeeee, $alpha: 0.8);
    opacity: 0.8;
  }

  .Icon {
    z-index: 10000;
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    &__circle {
      border: 10px solid #ddd;
      border-right: 10px solid #191970;
      height: 150px;
      width: 150px;
      border-radius: 50%;
      animation: loading 1s infinite linear;
      @keyframes loading {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
  }
}
</style>