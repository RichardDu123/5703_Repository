<template>
  <div class="profileContainer">
    <div class="navi">
      My Profile
    </div>


  <div class="userInfo">

    
    <div class="p1">
        <div class="icon">
          <el-icon><User /></el-icon>
        </div>

        <div class="userName">
          {{name}}
        </div>
    </div>

    <div class="p2">
        <div class="hint">
          
            Please fill your new nickname:
          
        </div>

        <div class="newNike">
          <text class="newSize">
            New nikename:
          </text>

          <div class="editor">
          <el-input v-model="input" placeholder="Please input" clearable />
          </div>

          
        </div>
        <div class="noMore">
            No more than 10 charaters
          </div>

        
    </div>

    <div class="p3">
        <div class="confirm">
            <el-button @click="handleSubmit" round>Comfirm</el-button>
        </div>

        <div class="cancel">
            <el-button type="success" round>Cancel</el-button>
        </div>
    </div>

  </div>
</div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
let input = ref('')
let name = ref('Tony')
function handleSubmit(){
  if(input.value.length>= 10){
    alert('Cannot greater than 10 ')
  }else{
    name.value = input.value
  }
  
}

// function handleCancel(){
  
// }
</script>

<style scoped lang="less">

.profileContainer{

}

.userInfo{

}

.navi{
  position: absolute;
  font-family: Abel;
  font-style: Regular;
  font-size: 24px;
}

.p1{
  position: absolute;
  width: 100%;
  top: 20%;
  

}

.icon{
  position: absolute;
  left: 10%;
}

.userName{
  position: absolute;
  left: 12%;
  font-weight: bold;
}

.p2{
  position: absolute;
  width: 100%;
  height: 7%;
  top: 25%;
}

.hint{
  position: absolute;
  left: 10%;
  font-family: Abel;
  font-size: 22px;
}



.newNike{
 position: absolute;
    top: 100%;
    left: 10%;
    width: 100%;
    height: 50%;
    display: flex;
    
}

.newSize{
  position: absolute;
  top: 30%;
  font-size: 22px;
}

.editor{
  position: absolute;
    left: 10%;
    width: 20%;
    top: 20%;
}

.noMore{
  position: absolute;
  color: #B8BED9;
  left: 20%;
  top: 200%;
}

.p3{
  position: absolute;
    width: 100%;
    top: 45%;
    /* left: 30%; */
    display: flex;
}

.confirm{
  position: absolute;
    left: 10%;
}
  


.cancel{
  position: absolute;
    /* right: 0%; */
    left: 20%;
}

</style>
