<template>
  <div class="profileContainer">
    <div class="navi">My Profile</div>

    <div class="userInfo">
      <div class="p1">
        <div class="icon">
          <el-icon><User /></el-icon>
        </div>

        <div class="userName">
          {{ name }}
        </div>
      </div>

      <div class="p2">
        <div class="hint">Please fill your new nickname:</div>

        <div class="newNike">
          <text class="newSize"> New nickname: </text>

          <div class="editor">
            <el-input v-model="input" placeholder="Please input" clearable />
          </div>
        </div>
        <div class="noMore">No more than 10 charaters</div>
      </div>

      <div class="p3">
        <div class="confirm">
          <el-button @click="handleSubmit" round>Comfirm</el-button>
        </div>

        <div class="cancel">
          <el-button type="success" round @click="input = ''">Cancel</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useETHStore } from '../../store'
import { Contract } from 'web3-eth-contract'
import { getUsernameByAddress, setUsername } from '../../api/mainSys'

const ETHStore = useETHStore()
const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
const contract = ETHStore.contract as Contract
let input = ref('')
let name = ref('')
let getName = ref('')
console.log(address)

getUsernameByAddress(contract, address).then((value) => {
  console.log(value)
  getName.value = value
  console.log(getName.value)
  if (getName.value.length == null) {
    console.log('1111111')
    name.value = 'Tony'
  } else {
    console.log('222222')
    name.value = getName.value
  }
})

function handleSubmit() {
  let memory = input.value
  setUsername(contract, address, memory).then((value) => {
    if (input.value.length >= 10) {
      alert('Cannot greater than 10 ')
    } else {
      name.value = input.value
      console.log('1111')
    }
  })
}
</script>

<style scoped lang="less">
.profileContainer {
  overflow: hidden;
}

.userInfo {
}

.navi {
  position: absolute;
  font-family: Abel;
  font-style: Regular;
  font-size: 24px;
}

.p1 {
  position: absolute;
  width: 100%;
  top: 20%;
}

.icon {
  position: absolute;
  left: 10%;
}

.userName {
  position: absolute;
  left: 12%;
  font-weight: bold;
}

.p2 {
  position: absolute;
  width: 100%;
  height: 7%;
  top: 25%;
}

.hint {
  position: absolute;
  left: 10%;
  font-family: Abel;
  font-size: 22px;
}

.newNike {
  position: absolute;
  top: 100%;
  left: 10%;
  width: 100%;
  height: 50%;
  display: flex;
}

.newSize {
  position: absolute;
  top: 30%;
  font-size: 22px;
}

.editor {
  position: absolute;
  left: 10%;
  width: 20%;
  top: 20%;
}

.noMore {
  position: absolute;
  color: #b8bed9;
  left: 20%;
  top: 200%;
}

.p3 {
  position: absolute;
  width: 100%;
  top: 45%;
  /* left: 30%; */
  display: flex;
}

.confirm {
  position: absolute;
  left: 10%;
}

.cancel {
  position: absolute;
  /* right: 0%; */
  left: 20%;
}
</style>
