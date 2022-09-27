<template>
  <div class="content">
        
        <div class="texts1">
            <div class="text1Sizes">
                404
            </div>
        </div>
        
        <div class="texts2">
            <div class="text2Sizes">
                OOOPS ! PAGE NOT FOUND
            </div>
        </div>
        
        <div class="texts3">
            <div class="text3Sizes">
                Sorry the page you are looking for does not exist.
            </div>

        </div>
        
        <div class="texts4">
            <div class="text4Sizes">
                Please choose the Right Network in the MetaMask
            </div>

            
            <img class = "imageLocations" src="../assets/images/meta.png" alt="">

        </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.content{
    background: white;
    width: 100%;
    height: 100%;
}

.texts1{
    position: absolute;
    /* top: %; */
    width: 100%;
    height: 20%;

}

.text1Sizes{
    font-family: 'Inter';
    font-style: normal;
    left: 50%;
    font-size: 100px;
    text-align: center;
    line-height: 110px;
    background: linear-gradient(267.77deg, #4067FF 1.42%, #4062FF 56.41%, #4072FF 102.43%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.texts2{
    position: absolute;
    width: 100%;
    height: 20%;
    top: 14%;
}

.text2Sizes{
    font-family: 'Inter';
    /* font-style: normal; */
    font-weight: 600;
    font-size: 20px;
    line-height: 100px;
    text-align: center;
    /* left: 47%; */
    color: #000000;
}

.texts3{
    position: absolute;
    width: 100%;
    height: 20%;
    top: 25%;

}

.text3Sizes{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 54px;
    text-align: center;
    color: #000000;
}

.texts4{
    position: absolute;
    width: 100%;
    height: 20%;
    /* left: 76px; */
    top: 35%;
    /* display: flex; */
}

.imageLocations{
    position: absolute;
    width: 10%;
    left: 75%;
    top: -40px;
    background: #E5E5E5;
}

.text4Sizes{
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 25px;
    line-height: 54px;
    text-align: center;
    color: #000000;

}

</style>