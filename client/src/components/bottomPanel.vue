<template>
  <section class="bottom">
    <section class="bottomLeft">
      <div class="left">
        <Thunder class="smallThunder" />
        <div>
          <h4>Total Buy</h4>
          <span>in kW⋅h</span>
        </div>
      </div>
      <div>{{ totalBuy }}kW⋅h</div>
    </section>
    <section class="bottomLeft">
      <div class="left">
        <Thunder class="smallThunder" />
        <div>
          <h4>Total Sell</h4>
          <span>in kW⋅h</span>
        </div>
      </div>
      <div>{{ totalSell }}kW⋅h</div>
    </section>
  </section>
</template>

<script setup lang="ts">
import Thunder from './svgs/thunder.vue'
defineProps({
  totalBuy: {
    type: String || Number,
    required: true,
  },
  totalSell: {
    type: String || Number,
    required: true,
  },
})
</script>

<style scoped lang="less">
.bottom {
  display: flex;
  justify-content: space-between;
  width: 635px;
  margin-top: 65px;
  .bottomLeft {
    .hoverShadow ();
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 288px;
    height: 124px;
    background: #ffffff;
    box-shadow: 0px 0px 25px rgba(48, 73, 191, 0.07);
    border-radius: 16px;
    div:nth-child(2) {
      margin-right: 40px;
    }
    .left {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .smallThunder {
        margin-left: 33px;
        margin-right: 18px;
      }
      h4 {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 23px;
        margin: 0 0 15px;
      }
      span {
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 17px;
        color: #919eab;
      }
    }
  }
}
</style>
