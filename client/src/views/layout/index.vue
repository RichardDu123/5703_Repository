<template>
  <div class="container" v-if="isETHLoaded">
    <div class="main">
      <router-view></router-view>
    </div>
    <transition name="left">
      <div class="left" v-show="showLeft">
        <h2>name</h2>
        <nav>
          <ul @click="handleClick">
            <li id="dashboard">
              <div class="navItem" :class="{ active: currentNav === '/' }">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.13478 18.7733V15.7156C7.13478 14.9351 7.77217 14.3023 8.55844 14.3023H11.4326C11.8102 14.3023 12.1723 14.4512 12.4393 14.7163C12.7063 14.9813 12.8563 15.3408 12.8563 15.7156V18.7733C12.8539 19.0978 12.9821 19.4099 13.2124 19.6402C13.4427 19.8705 13.7561 20 14.0829 20H16.0438C16.9596 20.0023 17.8388 19.6428 18.4872 19.0008C19.1356 18.3588 19.5 17.487 19.5 16.5778V7.86686C19.5 7.13246 19.1721 6.43584 18.6046 5.96467L11.934 0.675869C10.7737 -0.251438 9.11111 -0.221498 7.98539 0.746979L1.46701 5.96467C0.872741 6.42195 0.517552 7.12064 0.5 7.86686V16.5689C0.5 18.4639 2.04738 20 3.95617 20H5.87229C6.55123 20 7.103 19.4562 7.10792 18.7822L7.13478 18.7733Z"
                    fill="#B8BED9"
                  />
                </svg>
                <span>Dashboard</span>
              </div>
            </li>
            <li id="buy">
              <div class="navItem" :class="{ active: currentNav === '/buy' }">
                <svg
                  width="12"
                  height="18"
                  viewBox="0 0 12 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.3607 10.1634L6.00661 10.165C4.53497 10.165 3.19332 10.0788 2.31871 9.94897L1.77483 9.83524C1.48678 9.77197 1.1588 9.68879 0.991371 9.60207C0.378924 9.28461 0 8.66389 0 7.99954V7.94172C0.0143198 7.50864 0.394346 6.59883 0.407564 6.59883C1.02183 5.13485 2.87572 2.31046 4.19739 1.006L4.59419 0.626929C4.70173 0.527664 4.82901 0.41614 4.92822 0.346905C5.23444 0.115635 5.61337 0 5.99229 0C6.41527 0 6.80852 0.129817 7.13016 0.375268L7.55047 0.764728L7.64017 0.85199C8.92344 2.03561 11.0218 5.12612 11.664 6.74283L11.7576 6.98692C11.8629 7.28064 11.9884 7.69218 12 7.94172C12 8.25917 11.9262 8.56244 11.7808 8.85153C11.577 9.21262 11.2554 9.50061 10.8764 9.65988C10.6143 9.76134 9.82669 9.92061 9.81237 9.92061C9.01826 10.0666 7.76518 10.1513 6.3607 10.1634ZM5.99956 18C5.1613 18 4.48166 17.3269 4.48166 16.4967L4.80881 12.7975C4.80881 12.1463 5.34195 11.6183 5.99956 11.6183C6.65827 11.6183 7.19031 12.1463 7.19031 12.7975L7.51746 16.4967C7.51746 17.3269 6.83782 18 5.99956 18Z"
                  />
                </svg>
                <span>Buy</span>
              </div>
            </li>
            <li id="sell">
              <div class="navItem" :class="{ active: currentNav === '/sell' }">
                <svg
                  width="12"
                  height="18"
                  viewBox="0 0 12 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.99339 7.83503C7.46503 7.83503 8.80668 7.92121 9.68129 8.05103C9.6835 8.05305 9.70532 8.05804 9.7421 8.06561L9.99273 8.11578C10.3127 8.18079 10.7934 8.28643 11.0086 8.39793C11.6211 8.71539 12 9.33611 12 10.0005V10.0583C11.9857 10.4914 11.6057 11.4012 11.5924 11.4012C10.9502 12.9317 8.95319 15.9491 7.62585 17.1622L7.58042 17.207C7.48045 17.3048 7.23713 17.5377 7.07178 17.6531C6.76556 17.8844 6.38663 18 6.00771 18C5.58473 18 5.19148 17.8702 4.86984 17.6247C4.81146 17.5669 4.56471 17.3509 4.35983 17.148C3.07656 15.9644 0.978153 12.8739 0.335965 11.2572C0.233523 11.0117 0.0154213 10.391 0 10.0583C0 9.74083 0.0738021 9.43756 0.219203 9.14847C0.422985 8.78738 0.74463 8.49939 1.12355 8.34012C1.38572 8.23866 2.17331 8.07939 2.18763 8.07939C3.04792 7.92121 4.44685 7.83503 5.99339 7.83503ZM6.00044 0C6.8387 0 7.51834 0.673083 7.51834 1.50325L7.19119 5.20248C7.19119 5.85375 6.65805 6.38174 6.00044 6.38174C5.34173 6.38174 4.80969 5.85375 4.80969 5.20248L4.48254 1.50325C4.48254 0.673083 5.16218 0 6.00044 0Z"
                  />
                </svg>
                <span>Sell</span>
              </div>
            </li>
            <li id="statistics">
              <div
                class="navItem"
                :class="{ active: currentNav === '/statistics' }"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.4498 1.7803C13.4098 2.0303 13.3898 2.2803 13.3898 2.5303C13.3898 4.7803 15.2098 6.5993 17.4498 6.5993C17.6998 6.5993 17.9398 6.5703 18.1898 6.5303V14.5993C18.1898 17.9903 16.1898 20.0003 12.7898 20.0003H5.40076C1.99976 20.0003 -0.000244141 17.9903 -0.000244141 14.5993V7.2003C-0.000244141 3.8003 1.99976 1.7803 5.40076 1.7803H13.4498ZM13.6508 7.8603C13.3798 7.8303 13.1108 7.9503 12.9498 8.1703L10.5308 11.3003L7.75976 9.1203C7.58976 8.9903 7.38976 8.9393 7.18975 8.9603C6.99076 8.9903 6.81076 9.0993 6.68975 9.2593L3.73076 13.1103L3.66976 13.2003C3.49976 13.5193 3.57976 13.9293 3.87976 14.1503C4.01976 14.2403 4.16976 14.3003 4.33976 14.3003C4.57076 14.3103 4.78976 14.1893 4.92976 14.0003L7.43975 10.7693L10.2898 12.9103L10.3798 12.9693C10.6998 13.1393 11.0998 13.0603 11.3298 12.7593L14.2198 9.0303L14.1798 9.0503C14.3398 8.8303 14.3698 8.5503 14.2598 8.3003C14.1508 8.0503 13.9098 7.8803 13.6508 7.8603ZM17.5899 0C18.9199 0 19.9999 1.08 19.9999 2.41C19.9999 3.74 18.9199 4.82 17.5899 4.82C16.2599 4.82 15.1799 3.74 15.1799 2.41C15.1799 1.08 16.2599 0 17.5899 0Z"
                  />
                </svg>
                <span>Statistics</span>
              </div>
            </li>
            <li id="profile">
              <div
                class="navItem"
                :class="{ active: currentNav === '/profile' }"
              >
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 13.1739C12.3386 13.1739 16 13.8789 16 16.599C16 19.32 12.3146 20 8 20C3.66237 20 0 19.295 0 16.575C0 13.8539 3.68538 13.1739 8 13.1739ZM8 0C10.9391 0 13.294 2.35402 13.294 5.29105C13.294 8.22808 10.9391 10.5831 8 10.5831C5.0619 10.5831 2.70601 8.22808 2.70601 5.29105C2.70601 2.35402 5.0619 0 8 0Z"
                  />
                </svg>
                <span>Profile</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </transition>
    <transition name="right">
      <div class="right" v-show="showRight">
        <account />
        <recent-transac />
      </div>
    </transition>
  </div>
  <div v-else><wrong/></div>
</template>

<script setup lang="ts">
//handle navbar change
import { useETHStore } from '@/store'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Account from './right/account.vue'
import RecentTransac from './right/recentTransac.vue'
import wrong from "../../components/erro.vue"
const router = useRouter()
const route = useRoute()
const currentNav = ref(route.path)
const handleClick = (e: Event) => {
  let target = e.target as HTMLElement
  while (target.tagName != 'ul') {
    if (target.tagName.toLowerCase() == 'li') {
      currentNav.value = target.id === 'dashboard' ? '/' : '/' + target.id
      router.push({
        name: `${target.id}`,
      })
      break
    }
    target = target.parentElement as HTMLElement
  }
}
//left animation
const showLeft = ref(false)
onMounted(() => {
  setTimeout(() => {
    showLeft.value = true
  }, 0)
})
//right animation
const showRight = ref(false)
onMounted(() => {
  setTimeout(() => {
    showRight.value = true
  })
})
//detect network
const store = useETHStore()
const isETHLoaded = store.isWeb3Load
</script>

<style scoped lang="less">
.left-enter-from {
  transform: translateX(-100%);
}
.left-enter-active {
  transition: all 0.3s ease;
}
.left-enter-to {
  transform: none;
}
.right-enter-from {
  transform: translateY(-100%);
}
.right-enter-active {
  transition: all 1s ease;
}
.right-enter-to {
  transform: none;
}
.container {
  display: flex;
  background-color: #f1f8ff;
  .main {
    height: 100vh;
    min-height: 968px;
    background-color: #fff;
    flex: 1;
  }
  .left {
    height: 100vh;
    min-height: 968px;
    width: 280px;
    background-color: #f1f8ff;
    order: -1;
    flex-shrink: 0;
    h2 {
      text-align: left;
      margin-left: 32px;
    }
    nav {
      margin-top: 93px;
      ul {
        li {
          padding-bottom: 10px;
          .navItem {
            position: relative;
            text-align: left;
            line-height: 64px;
            width: 207px;
            height: 64px;
            color: #b8bed9;
            border-radius: 16px;
            &:hover {
              color: rgb(68, 102, 251);
              cursor: pointer;
              path {
                fill: rgb(68, 102, 251);
                transition: all 0.5s;
              }
            }
            &.active {
              background-color: rgb(68, 102, 251);
              color: white;
              transition: all 0.2s;
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
              path {
                fill: white;
              }
            }
            svg {
              margin-left: 27px;
              path {
                fill: #b8bed9;
              }
            }
            span {
              position: absolute;
              left: 72px;
            }
          }
        }
      }
    }
  }
  .right {
    height: 100vh;
    min-height: 968px;
    width: 324px;
    background-color: #fff;
    margin-left: 15px;
    margin-right: 15px;
    flex-shrink: 0;
  }
}
</style>
