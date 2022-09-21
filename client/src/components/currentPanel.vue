<template>
  <section class="big">
    <div class="bigLeft">
      <Thunder class="thunder" />
      <div>
        <h3>Current</h3>
        <span>kW⋅h</span>
      </div>
    </div>
    <div class="bigRight">{{ UserStore.currElec }}kW⋅h</div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
import Thunder from './svgs/thunder.vue'
const UserStore = useUserStore()
UserStore.setElec()
</script>

<style scoped lang="less">
.big {
  .hoverShadow ();
  font-family: 'Abel';
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 635px;
  height: 173px;
  background: #ffffff;
  box-shadow: 0px 0px 25px rgba(48, 73, 191, 0.07);
  border-radius: 16px;
  .bigLeft {
    margin-left: 39px;
    .thunder {
      margin-right: 28px;
    }
    h3 {
      font-style: normal;
      font-weight: 400;
      font-size: 24px;
      line-height: 31px;
      margin: 0 0 9px;
    }
    span {
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 19px;
      color: #919eab;
    }
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bigRight {
    margin-right: 67px;
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 31px;
  }
}
</style>
