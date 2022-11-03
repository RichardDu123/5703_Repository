<template>
  <div class="adminContainer">
    <div class="admin">
      Admin
    </div>

    <div class="adminInfo">

        <div class="d1">
            <div class="icon">
                <el-icon><User /></el-icon>
            </div>
        </div>

         <div class="userNameAdmin">
          {{nickName}}
        </div>

    </div>

    <div class="d2">
        Add Electricity to a user account
    </div>

    <div class="d3">
        <div class="address">
            User Address:
        </div>

        <div class="address_input">
            <el-input v-model="a_put" placeholder="Address" clearable />
        </div>

    </div>

    <div class="d4">
        <div class="how_many">
            Electricity Unit + '(KW)'
        </div>

        <div class="Elec_input">
            <el-input v-model="e_put" placeholder="Electricity" clearable />
        </div>
    </div>

    <div class="d5">
        <div class="yes">
            <el-button @click="handleSubmit" round>Comfirm</el-button>
        </div>

        <div class="no">
            <el-button  @click="gotoMain">Cancel</el-button>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import { computed, onMounted, reactive, ref, watchEffect, onBeforeMount,onUpdated,onBeforeUpdate} from 'vue'
import { useETHStore } from '../../store'
import { Contract } from 'web3-eth-contract'
import { setMapStoreSuffix } from 'pinia'
import Web3 from 'web3'
import {
  getUsernameByAddress,
  setUsername,
  addAvailableElecUnits,
  getElecByAddress
} from '../../api/mainSys'
// import { setMapStoreSuffix } from 'pinia'

const router = useRouter()
const ETHStore = useETHStore()
const web3 = ETHStore.web3 as Web3
const address1 = ETHStore.accounts ? ETHStore.accounts[0] : ''
const contract = ETHStore.contract as Contract

let mask = ref('')
let nickName = ref('')
let e_put = ref('')
let a_put = ref('')
let ad_data = reactive({
    address:'',
    unit:''
})

const iniName = getUsernameByAddress(contract,address1).then((value)=>{
  nickName.value = value 
})


function handleSubmit(){ 
    let address = a_put.value
    let amount = e_put.value
    addAvailableElecUnits(contract,address,address1,amount).then((value)=>{
        if(a_put.value.length>= 15 && e_put.value.length>= 0 ){
        ad_data.address = a_put.value
        ad_data.unit = e_put.value
        console.log(ad_data)
        alert('You have add ' + ad_data.unit + ' in ' + ad_data.address)
     }else{
        alert ('Address is not match')
  }
        
    })
  
  
}

function gotoMain(){
  router.push('/')
}




</script>

<style>
.adminContainer{
 
}

.adminInfo{

}

.admin{
    position: absolute;
    left: 20%;
    top: 5%;
}

.d1{
    position: absolute;
    left: 28%;
    top: 20%;
}

.userNameAdmin{
    position: absolute;
    left: 30%;
    top: 20%;
}

.d2{
    position: absolute;
    top: 25%;
    left: 28%;
}

.d3{
    position: absolute;
    top: 30%;
    left: 28%;
    width: 30%;
    display: flex;

}

.address{
    position: absolute;
}

.address_input{
    position: absolute;
    width: 80%;
    left: 50%;
    top: -5%;
}


.d4{
    position: absolute;
    top: 35%;
    left: 28%;
    display: inline-block;
    width: 30%;
}

.how_many{
    position: absolute;
}

.Elec_input{
    position: absolute;
    width: 80%;
    left: 50%;
    top: -5%;
}

.d5{
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 30%;
    width: 30%;
}

.yes{
    position: absolute;
}

.no{
    position: absolute;
    left: 30%;
} 
</style>