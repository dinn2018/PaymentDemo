<template>
	<div style="width:100%;">
		<a-form>
			<a-form-item label="ERC20 Tokens">
				<Tokens @onTokenChanged="handleChange" />
			</a-form-item>
			<a-form-item label="Spender">
				<a-input v-model="spender" />
			</a-form-item>
			<a-form-item label="Value">
				<a-input v-model="value" />
			</a-form-item>
			<a-form-item>
				<a-button
					type="primary"
					html-type="submit"
					@click="approve"
				>
					Approve
				</a-button>
				<a-card>
					<div
						class="calculation-card"
						style="height:100px;"
					>
						<div>Spender Allowance: {{ allowance }}</div>
						<div>My Balance: {{ balance }}</div>
					</div>
				</a-card>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BigNumber } from 'ethers'
import { toToken, formatToken } from '@/utils'
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
		await this.sendTransaction(this.erc20Deployment, 'approve', [
			this.spender,
			v
		])
	}

	async getAllowance() {
		const account = await this.getAccount()
		const result = await this.call(this.erc20Deployment, 'allowance', [
			account,
			this.spender
		])
		this.allowance = formatToken(BigNumber.from(result.toString()))
	}

	async getBalance() {
		const account = await this.getAccount()
		const result = await this.call(this.erc20Deployment, 'balanceOf', [account])
		this.balance = formatToken(BigNumber.from(result.toString()))
	}
}
</script>
