<template>
  <div class="itemContainer">
    <div class="left">
      <div class="iconSell" v-if="type === 'sell'">
        <svg
          width="15"
          height="20"
          viewBox="0 0 15 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.24999 17.5V19.375C4.24999 19.582 4.41799 19.75 4.62499 19.75H6.12499C6.22445 19.75 6.31983 19.7105 6.39016 19.6402C6.46048 19.5698 6.49999 19.4745 6.49999 19.375V17.5H7.24999V19.375C7.24999 19.582 7.41799 19.75 7.62499 19.75H9.12499C9.22445 19.75 9.31983 19.7105 9.39016 19.6402C9.46048 19.5698 9.49999 19.4745 9.49999 19.375V17.5H9.62599C12.614 17.5 14.75 15.9505 14.75 13.27C14.75 11.017 13.2395 9.7855 11.471 9.61V9.478C12.926 9.115 13.9955 8.017 13.9955 6.193C13.9955 3.895 12.2705 2.5 9.63799 2.5H9.49999V0.625C9.49999 0.525544 9.46048 0.430161 9.39016 0.359835C9.31983 0.289509 9.22445 0.25 9.12499 0.25H7.62499C7.52553 0.25 7.43015 0.289509 7.35983 0.359835C7.2895 0.430161 7.24999 0.525544 7.24999 0.625V2.5H6.39049V0.625C6.39049 0.525544 6.35098 0.430161 6.28066 0.359835C6.21033 0.289509 6.11495 0.25 6.01549 0.25H4.62499C4.52553 0.25 4.43015 0.289509 4.35983 0.359835C4.2895 0.430161 4.24999 0.525544 4.24999 0.625V2.5L1.25299 2.5165C1.15353 2.5165 1.05815 2.55601 0.987825 2.62633C0.917499 2.69666 0.877991 2.79204 0.877991 2.8915V4.375C0.877991 4.5805 1.04299 4.75 1.24999 4.75L2.38249 4.7425C2.67956 4.74448 2.96378 4.86388 3.17314 5.07464C3.3825 5.28541 3.5 5.57043 3.49999 5.8675V14.125C3.49999 14.4234 3.38146 14.7095 3.17049 14.9205C2.95951 15.1315 2.67336 15.25 2.37499 15.25L1.25299 15.2665C1.15353 15.2665 1.05815 15.306 0.987825 15.3763C0.917499 15.4467 0.877991 15.542 0.877991 15.6415V17.1415C0.877991 17.3485 1.04599 17.5165 1.25299 17.5165L4.24999 17.5ZM6.39049 4.7305H8.96899C10.328 4.7305 11.126 5.4775 11.126 6.6985C11.126 8.005 10.2635 8.7415 8.31049 8.7415H6.39049V4.7305ZM6.39049 10.807H9.15049C10.856 10.807 11.7845 11.677 11.7845 13.093C11.7845 14.5225 10.8455 15.268 8.54749 15.268H6.39049V10.8085V10.807Z"
            fill="white"
          />
        </svg>
      </div>
      <div class="iconBuy" v-else>
        <svg
          width="18"
          height="22"
          viewBox="0 0 18 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.357 9.27332L6.30217 21.0612C5.98813 21.3961 5.44945 21.0244 5.65102 20.612L9.58346 12.5653C9.71332 12.2996 9.51985 11.9897 9.22408 11.9897H0.93291C0.581295 11.9897 0.400753 11.5686 0.643163 11.3139L10.8994 0.537741C11.2043 0.217408 11.7268 0.555597 11.5594 0.964917L8.62013 8.15218C8.51168 8.41738 8.70903 8.70725 8.99552 8.70356L17.06 8.59973C17.4127 8.59519 17.5982 9.01608 17.357 9.27332Z"
            fill="white"
          />
        </svg>
      </div>
      <div class="spec">
        <div>
          {{ type === 'sell' ? 'Electricity Sell' : 'Electricity Buy' }}
        </div>
        <div>time</div>
      </div>
    </div>
    <div :class="type === 'sell' ? 'green' : 'red'">
      {{ `${type === 'sell' ? '+' : '-'} ${amount} ETH` }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
})
</script>

<style scoped lang="less">
.itemContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
    .iconSell {
      display: inline-block;
      width: 48px;
      height: 48px;
      background-color: #f0b90b;
      border-radius: 16px;
      position: relative;
      svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .iconBuy {
      display: inline-block;
      width: 48px;
      height: 48px;
      background-color: #636890;
      border-radius: 16px;
      position: relative;
      svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .spec {
      text-align: left;
      display: inline-block;
      width: 123px;
      margin-left: 16px;
      div:first-child {
        font-size: 14px;
      }
      div:last-child {
        font-size: 12px;
        color: #919eab;
      }
    }
  }
  .green {
    color: #6dd64d;
  }
  .red {
    color: #ff4842;
  }
}
</style>
