<template>
	<div style="width:100%;">
		<a-form
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 12 }"
		>
			<a-form-item label="ERC20 Tokens">
				<Tokens @onTokenChanged="handleChange" />
			</a-form-item>
			<a-form-item label="Spender">
				<a-input v-model="spender" />
			</a-form-item>
			<a-form-item label="Value">
				<a-input v-model="value" />
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 12, offset: 5 }">
				<a-button
					type="primary"
					html-type="submit"
					@click="approve"
				>
					Approve
				</a-button>
				<div>Spender Allowance: {{ allowance }}</div>
				<div>My Balance: {{ balance }}</div>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BigNumber } from 'ethers'
import { toToken, formatToken } from '@/utils'
import { call, sendTransaction, getAccounts, Deployment } from '@/utils/eth'
import Tokens from '@/components/tokens.vue'
import Payment from '@/abi/Payment.json'

@Component({
	components: {
		Tokens
	}
})
export default class Approve extends Vue {
	erc20Deployment: Deployment = { address: '', abi: [] }

	// AB -> DT -> EVER -> USDT
	spender = Payment.address
	value = '0'
	allowance = '0'
	balance = '0'

	async created() {
		await this.getAllowance()
		await this.getBalance()
	}

	async handleChange(value: any) {
		this.erc20Deployment = value
		await this.getAllowance()
		await this.getBalance()
	}

	async approve() {
		const v = toToken(this.value)
		await sendTransaction(this.erc20Deployment, 'approve', [this.spender, v])
	}

	async getAllowance() {
		const accounts = await getAccounts()
		const result = await call(this.erc20Deployment, 'allowance', [
			accounts[0],
			this.spender
		])
		this.allowance = formatToken(BigNumber.from(result.toString()))
	}

	async getBalance() {
		const accounts = await getAccounts()
		const result = await call(this.erc20Deployment, 'balanceOf', [accounts[0]])
		this.balance = formatToken(BigNumber.from(result.toString()))
	}
}
</script>
