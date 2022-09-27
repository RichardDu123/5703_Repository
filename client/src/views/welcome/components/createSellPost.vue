<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="Create a Sell Post"
    draggable
    @close="resetForm(ruleFormRef)"
  >
    <el-form :model="form" ref="ruleFormRef" :rules="rules">
      <el-form-item
        label="Price To Sell:"
        :label-width="formLabelWidth"
        prop="priceToSell"
      >
        <el-input v-model="form.priceToSell" autocomplete="off" type="number">
          <template #append>Wei</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="Amount To Sell:"
        :label-width="formLabelWidth"
        prop="amountToSell"
      >
        <el-input v-model="form.amountToSell" autocomplete="off" type="number">
          <template #append>kW⋅h</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">Cancel</el-button>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          :loading="isLoading"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { validatePrice, validateAmount } from '@/utils/validate'
import { createSellPost } from '@/api/mainSys'
import { useSellerStore, useETHStore, useUserStore } from '@/store'
import { Contract } from 'web3-eth-contract'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const dialogFormVisible = ref(false)
watch(
  () => props.modelValue,
  (newVal) => {
    dialogFormVisible.value = newVal
  }
)
watch(dialogFormVisible, (newVal) => {
  emit('update:modelValue', newVal)
})
const formLabelWidth = '140px'
const form = reactive({
  priceToSell: '0',
  amountToSell: '0',
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  priceToSell: [
    {
      validator: validatePrice,
      trigger: 'blur',
    },
  ],
  amountToSell: [
    {
      validator: validateAmount,
      trigger: 'blur',
    },
  ],
})
//submit form
const ETHStore = useETHStore()
const UserStore = useUserStore()
const SellerStore = useSellerStore()
const contract = ETHStore.contract as Contract
const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
const isLoading = ref(false)
const submitForm = async (formEl: FormInstance | undefined) => {
  isLoading.value = true
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await createSellPost(
          contract,
          address,
          form.priceToSell,
          form.amountToSell
        )
        await UserStore.setWei()
        await SellerStore.setSellerList()
        ElMessage({
          message: 'Success. The sell request has been post.',
          type: 'success',
        })
      } catch (error) {
        ElMessage.error('Oops, the transaction is rejected.')
      } finally {
        isLoading.value = false
        dialogFormVisible.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogFormVisible.value = false
}
</script>

<style scoped lang="less"></style>
