<template>
  <div class="contents">
    <div class="text1">
        <div class="text1Size">
            Hello,Welcome !
        </div>
        <img class = "imgLocation1" src="../../components/static/group_301.png" alt="">

    </div>

    <div class="text2">
        <div class="text2Size">
            Easy transcation of electricity for everyone.
        </div>
    </div>

    <div class="text3">
        <div class="text3Size">
            Please use the MetaMask to connect and start the Electricity Transaction.
        </div>
        <img class = "imgLocation2" src="../../components/static/meta.png" alt="">
    </div>

  </div>
</template>

<script>
export default {

}
</script>

<style>
.contents{
    width: 100%;
    height: 100%;
    background-color: #fff;
}

.text1{
    position: absolute;
    width: 100%;
    height: 20%;
    display: flex;

}

.text1Size{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 50px;
    line-height: 106px;
    align-content: center;
    margin-left: 30%;
    /* left: 50%; */
    /* position: relative; */
    color: #000000;
}

.text2{
    position: absolute;
    width: 100%;
    height: 20%;
    top: 14%;
}

.text2Size{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 36px;
    text-align: center;
    margin-left: -10%;
    color: #7E7E7E;
}

.text3{
    position: absolute;
    width: 100%;
    height: 20%;
    /* display: flex; */
    top: 20%;;

}

.text3Size{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 25px;
    line-height: 58px;
    text-align: center;
    color: #000000;
    margin-left: -10%;
}

.imgLocation1{
    position: relative;
    height: 50%;
    top: -5px;
}

.imgLocation2{
    position: relative;
    height: 50%;
    /* text-align: center; */
    top: 0px;
    margin-left: 40%;
}

</style>