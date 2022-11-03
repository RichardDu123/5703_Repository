<template>
  <div class="statContainer">
    <div class="s1">
      <div class="buyWeek">
        <Thunder class="thunder" />
        <h3 class="tb">TotalBuy</h3>

        <span class="s">{{ buy }}kW.h</span>
        <h5 class="inWeek">in week</h5>
      </div>

      <div class="sellWeek">
        <Thunder class="thunder" />
        <h3 class="ts">TotalSell</h3>
        <span class="s">{{ sell }}kW.h</span>

        <h5 class="SellInWeek">in week</h5>
      </div>
    </div>

    <div class="s2">
      <div class="buyStatic">
        <div class="img1">
          <img src="../../assets/images/Activity.png" alt="" />
        </div>
        <div class="s22" ref="charRef"></div>

        <div class="contentB">WeeklyBuy</div>
      </div>
    </div>

    <div class="s3">
      <div class="sellStatic">
        <div class="img2">
          <img src="../../assets/images/Activity.png" alt="" />
        </div>
        <div class="s33" ref="charRefSell"></div>

        <div class="contentS">WeeklySell</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Thunder from '../../components/svgs/thunder.vue'
import { onMounted, reactive, ref } from 'vue'
import { useETHStore } from '../../store'
import { Contract } from 'web3-eth-contract'

import {
  returnWeeklyTotalBuyAndSell,
  returnWeeklyBuyStatistics,
  returnWeeklySellStatistics,
} from '../../api/mainSys'
import * as echarts from 'echarts'
const ETHStore = useETHStore()

const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
const contract = ETHStore.contract as Contract
const amount = 0
let sell = ref('')
let buy = ref('')
let charRef = ref<HTMLElement>()
let myChart = ref()
let charRefSell = ref<HTMLElement>()
let myChartSell = ref()
let sellStatic = reactive({
  sellData: [],
})
let buyStatic = reactive({
  buyData: [],
})

returnWeeklyTotalBuyAndSell(contract, address, amount).then((value) => {
  sell.value = value[1]
  console.log(sell.value)
})

returnWeeklyTotalBuyAndSell(contract, address, amount).then((value) => {
  buy.value = value[0]
  console.log(buy.value)
})

onMounted(() => {
  myChart.value = echarts.init(charRef.value)
  myChartSell.value = echarts.init(charRefSell.value)
  returnWeeklySellStatistics(contract, address, amount).then((value) => {
    sellStatic.sellData = value
    let testSell = sellStatic.sellData
    testSell = testSell.map(Number)
    console.log(testSell)
    let optionSell = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: testSell,
          type: 'line',
        },
      ],
    }
    myChartSell.value.setOption(optionSell)
  })
  returnWeeklyBuyStatistics(contract, address, amount).then((value) => {
    // buyStatic.data = value
    buyStatic.buyData = value
    let testBuy = buyStatic.buyData
    testBuy = testBuy.map(Number)

    let optionBuy = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: testBuy,
          type: 'line',
        },
      ],
    }
    myChart.value.setOption(optionBuy)
  })
})
</script>

<style scoped lang="less">
.s1 {
  position: absolute;
  width: 80%;
  left: 5%;
  height: 10%;
  top: 5%;
  /* left: 0%; */
  display: inline-block;
}

.s2 {
  position: absolute;
  top: 20%;
}

.s22 {
  position: absolute;
  width: 90%;
  height: 90%;
  top: 20%;
  left: 5%;
}

.s3 {
  position: absolute;
  top: 50%;
}

.s33 {
  position: absolute;
  width: 90%;
  height: 90%;
  top: 20%;
  left: 5%;
}
.chart {
  height: 400px;
}

.sellWeek {
  .hoverShadow ();
  position: absolute;
  font-family: 'Abel';
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 328px;
  height: 93px;
  left: 50%;
  top: 10%;
  background: #ffffff;
  box-shadow: 0px 0px 25px rgba(48, 73, 191, 0.07);
  border-radius: 16px;
}

.tb {
  position: relative;
  right: 10%;
  top: -8%;
}

.inWeek {
  position: relative;
  /* bottom: 2px; */
  /* right: 2px; */
  right: 70%;
  bottom: -10%;
  color: #919eab;
}

.buyWeek {
  .hoverShadow ();
  position: absolute;
  font-family: 'Abel';
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 328px;
  height: 93px;
  left: 20%;
  top: 10%;
  background: #ffffff;
  box-shadow: 0px 0px 25px rgba(48, 73, 191, 0.07);
  border-radius: 16px;
}

.SellInWeek {
  color: #919eab;
  position: relative;
  left: -70%;
  bottom: -11%;
}

.ts {
  position: relative;
  left: -10%;
  top: -5%;
}

.buyStatic {
  .hoverShadow ();
  position: relative;
  font-family: 'Abel';
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 719px;
  height: 320px;
  left: 200px;
  top: 80px;
  background: #ffffff;
  box-shadow: 0px 0px 25px rgba(48, 73, 191, 0.07);
  border-radius: 16px;
}

.view {
  position: relative;
  width: 150px;
  height: 150px;
}

.sellStatic {
  .hoverShadow ();
  position: relative;
  font-family: 'Abel';
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 719px;
  height: 320px;
  left: 200px;
  top: 160px;
  background: #ffffff;
  box-shadow: 0px 0px 25px rgba(48, 73, 191, 0.07);
  border-radius: 16px;
}

.contentS {
  position: relative;
  left: -80%;
  top: -30%;
  font-family: Abel;
  font-style: Regular;
  font-size: 20px;
  line-height: 25px;
  line-height: 100%;
}

.contentB {
  position: relative;
  left: -80%;
  top: -30%;
  font-family: Abel;
  font-style: Regular;
  font-size: 20px;
  line-height: 25px;
  line-height: 100%;
}

.img1 {
  position: relative;
  top: -20%;
  left: 5%;
}

.img2 {
  position: relative;
  top: -20%;
  left: 5%;
}
</style>
