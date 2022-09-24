<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="`Create a ${
      props.type === 'buy' ? 'Pruchase' : 'Sell'
    } Response Message`"
    draggable
    @close="resetForm(ruleFormRef)"
  >
    <el-form :model="form" ref="ruleFormRef" :rules="rules">
      <el-form-item
        :label="`Amount to ${props.type === 'buy' ? 'sell' : 'buy'}:`"
        :label-width="formLabelWidth"
        prop="amount"
      >
        <el-input v-model="form.amount" autocomplete="off" type="number">
          <template #append>kW⋅h</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="Quotation in Wei:"
        :label-width="formLabelWidth"
        prop="quotationInWei"
      >
        <el-input
          v-model="form.quotationInWei"
          autocomplete="off"
          type="number"
        >
          <template #append>Wei</template>
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
import { createPurchasePostRes, createSellPostRes } from '@/api/mainSys'
import { useETHStore, useUserStore } from '@/store'
import { Contract } from 'web3-eth-contract'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
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
  amount: '0',
  quotationInWei: '0',
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  quotationInWei: [
    {
      validator: validatePrice,
      trigger: 'blur',
    },
  ],
  amount: [
    {
      validator: validateAmount,
      trigger: 'blur',
    },
  ],
})
//submit form
const ETHStore = useETHStore()
const UserStore = useUserStore()
const contract = ETHStore.contract as Contract
const address = ETHStore.accounts ? ETHStore.accounts[0] : ''
const isLoading = ref(false)
const submitForm = async (formEl: FormInstance | undefined) => {
  isLoading.value = true
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (props.type === 'buy') {
        try {
          const res = await createPurchasePostRes(
            contract,
            address,
            Number(form.quotationInWei),
            Number(form.amount),
            Number(props.postId)
          )
          console.log(res)
          await UserStore.setWei()
          isLoading.value = false
          ElMessage({
            message: 'Success. The purchase response message has been post.',
            type: 'success',
          })
        } catch (err: any) {
          isLoading.value = false
          if (err.code === 4001) {
            ElMessage.error('User denied transaction signature.')
          } else if (err.code === -32603) {
            ElMessage.error('You cannot reply to your own purchase post.')
          } else {
            ElMessage.error('Error happend, please reload the page')
          }
        }
      } else if (props.type === 'sell') {
        try {
          const res = await createSellPostRes(
            contract,
            address,
            Number(form.quotationInWei),
            Number(form.amount),
            Number(props.postId)
          )
          console.log(res)
          await UserStore.setWei()
          isLoading.value = false
          ElMessage({
            message: 'Success. The sell response message has been post.',
            type: 'success',
          })
        } catch (err: any) {
          isLoading.value = false
          if (err.code === 4001) {
            ElMessage.error('User denied transaction signature.')
          } else if (err.code === -32603) {
            ElMessage.error('You cannot reply to your own sell post.')
          } else {
            ElMessage.error('Error happend, please reload the page')
          }
        }
      }

      dialogFormVisible.value = false
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
