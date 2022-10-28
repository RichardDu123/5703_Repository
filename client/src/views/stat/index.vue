<template>
  <div class="statContainer">
    <div class="s1">
      <div class="sellWeek">
        <Thunder class="thunder" />
        <h3 class="tb">TotalBuy</h3>

        <span class="s">K</span>
        <h5 class="inWeek">in week</h5>
      </div>

      <div class="buyWeek">
        <Thunder class="thunder" />
        <h3 class="ts">TotalSell</h3>

        <span class="s">K</span>

        <h5 class="SellInWeek">in week</h5>
      </div>
    </div>

    <div class="s2">
      <div class="buyStatic">
        <div class="img1">
          <img src="../../assets/images/Activity.png" alt="" />
        </div>

        <!-- <div class="view">
          <div id="myEcharts" :style="{ width: '900px', height: '300px' }"></div>
        </div> -->

        <div class="contentB">WeeklyBuy</div>
      </div>
    </div>

    <div class="s3">
      <div class="sellStatic">
        <div class="img2">
          <img src="../../assets/images/Activity.png" alt="" />
        </div>

        <!-- <div class="view">
          <div id="myEcharts" :style="{ width: '900px', height: '300px' }"></div>
        </div> -->

        <div class="contentS">WeeklySell</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Thunder from '../../components/svgs/thunder.vue'
// import * as echarts from "echarts";
// export default {
//   name: "echartsBox",
//   setup() {
//     /// 声明定义一下echart
//     let echart = echarts;

//     onMounted(() => {
//       initChart();
//     });

//     onUnmounted(() => {
//       echart.dispose;
//     });

//     // 基础配置一下Echarts
//     function initChart() {
//       let chart = echart.init(document.getElementById("myEcharts"), "dark");
//       // 把配置和数据放这里
//       chart.setOption({
//         xAxis: {
//           type: "category",
//           data: [
//             "一月",
//             "二月",
//             "三月",
//             "四月",
//             "五月",
//             "六月",
//             "七月",
//             "八月",
//             "九月",
//             "十月",
//             "十一月",
//             "十二月"
//           ]
//         },
//         tooltip: {
//           trigger: "axis"
//         },
//         yAxis: {
//           type: "value"
//         },
//         series: [
//           {
//             data: [
//               820,
//               932,
//               901,
//               934,
//               1290,
//               1330,
//               1320,
//               801,
//               102,
//               230,
//               4321,
//               4129
//             ],
//             type: "line",
//             smooth: true
//           }
//         ]
//       });
//       window.onresize = function() {
//         //自适应大小
//         chart.resize();
//       };
//     }

//     return { initChart };
//   }
// };
</script>

<style scoped lang="less">
.s1 {
  position: relative;
}

.s2 {
  position: relative;
}

.s3 {
  position: relative;
}
.chart {
  height: 400px;
}

.sellWeek {
  .hoverShadow ();
  position: relative;
  font-family: 'Abel';
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 328px;
  height: 93px;
  left: 200px;
  top: 125px;
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
  position: relative;
  font-family: 'Abel';
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 328px;
  height: 93px;
  left: 624px;
  top: 30px;
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
