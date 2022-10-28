<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="Create a Purchase Post"
    draggable
    @close="resetForm(ruleFormRef)"
  >
    <el-form :model="form" ref="ruleFormRef" :rules="rules">
      <el-form-item
        label="Price To Buy:"
        :label-width="formLabelWidth"
        prop="priceToBuy"
      >
        <el-input v-model="form.priceToBuy" autocomplete="off" type="number">
          <template #append>Wei</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="Amount To Buy:"
        :label-width="formLabelWidth"
        prop="amountToBuy"
      >
        <el-input v-model="form.amountToBuy" autocomplete="off" type="number">
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
import { createPurchasePost } from '@/api/mainSys'
import { useBuyerStore, useETHStore, useUserStore } from '@/store'
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
  priceToBuy: '0',
  amountToBuy: '0',
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  priceToBuy: [
    {
      validator: validatePrice,
      trigger: 'blur',
    },
  ],
  amountToBuy: [
    {
      validator: validateAmount,
      trigger: 'blur',
    },
  ],
})
//submit form
const ETHStore = useETHStore()
const UserStore = useUserStore()
const BuyerStore = useBuyerStore()
const contract = ETHStore.contract as Contract
const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
const isLoading = ref(false)
const submitForm = async (formEl: FormInstance | undefined) => {
  isLoading.value = true
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await createPurchasePost(
          contract,
          address,
          form.priceToBuy,
          form.amountToBuy
        )
        await UserStore.setWei()
        await BuyerStore.setBuyerList()
        ElMessage({
          message: 'Success. The purchase request has been post.',
          type: 'success',
        })
      } catch (error) {
        ElMessage.error('Oops, the transaction is rejected.')
      } finally {
        isLoading.value = false
        dialogFormVisible.value = false
      }
    } else {
      isLoading.value = false
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
