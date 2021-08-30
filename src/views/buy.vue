<template>
	<div>
		<a-form
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 18 }"
		>
			<a-form-item label="Resource">
				<Resources @onResourceChanged="onResourceChanged" />
			</a-form-item>
			<a-form-item label="Pre path">
				<a-input v-model="prePath" />
			</a-form-item>
			<div class="buy">
				<a-form-item label="Value In">
					<a-input v-model="valueIn" />
				</a-form-item>
				<a-form-item label="Amount min out">
					<a-input v-model="amountOutMin" />
					<a-button
						type="primary"
						html-type="submit"
						@click="buyWithExactValue"
					>
						Buy with exact value
					</a-button>
				</a-form-item>
			</div>
			<div class="buy">
				<a-form-item label="Amount Out">
					<a-input v-model="amountOut" />
				</a-form-item>
				<a-form-item label="ValueIn Max">
					<a-input v-model="valueInMax" />
					<a-button
						type="primary"
						html-type="submit"
						@click="buyWithExactResource"
					>
						Buy with exact resource
					</a-button>
				</a-form-item>
			</div>
			<div>My Resource Amount: {{ resourceBalance }}</div>
		</a-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { toToken, defaultDeadline, WETH } from '@/utils'
import {
	call,
	sendTransaction,
	getAccounts,
	Deployment,
	CallOption
} from '@/utils/eth'

import Payment from '@/abi/Payment.json'
import Resources from '@/components/resources.vue'

@Component({
	components: {
		Resources
	}
})
export default class Buy extends Vue {
	resource: Deployment = { address: '', abi: [] }

	// AB -> DT -> EVER
	prePath =
		'0x7a6ca1B5e1e5DDd9E5F4b4f685319f990A5585Db,0x455d2b264DC5b543014E24f8599b3E8177f73654,0xc0D05413823E6ebeA748285d468295eB384057A9'
	valueIn = '0'
	amountOutMin = '0'

	amountOut = '0'
	valueInMax = '0'

	resourceBalance = '0'

	valuationToken = ''

	async onResourceChanged(resource: Deployment) {
		this.resource = resource
		await this.getValuationToken()
		await this.getAccountAmount()
	}

	isETHValuated(token: string) {
		return token == WETH
	}

	async getValuationToken() {
		const result = await call(this.resource, 'valuationToken')
		this.valuationToken = result.toString()
	}

	async buyWithExactValue() {
		try {
			const value = toToken(this.valueIn)
			const tokens = this.prePath.split(',')
			const tokenIn = tokens[0]
			if (this.isETHValuated(this.valuationToken)) {
				if (this.isETHValuated(tokenIn)) {
					await this.sendPayment(
						'buyETHValuatedResourceByExactETH',
						[this.amountOutMin],
						{
							value: value.toHexString()
						}
					)
				} else {
					await this.sendPayment('buyETHValuatedResourceByExactToken', [
						tokens,
						value,
						this.amountOutMin,
						defaultDeadline()
					])
				}
			} else {
				if (this.isETHValuated(tokenIn)) {
					await this.sendPayment(
						'buyTokenValuatedResourceByExactETH',
						[this.amountOutMin],
						{
							value: value.toHexString()
						}
					)
				} else {
					if (tokenIn == this.valuationToken) {
						await this.sendPayment('buyTokenValuatedResourceByExactToken', [
							value,
							this.amountOutMin
						])
					} else {
						await this.sendPayment(
							'buyTokenValuatedResourceByOtherExactToken',
							[tokens, value, this.amountOutMin, defaultDeadline()]
						)
					}
				}
			}
		} catch (e) {
			this.$message.error(JSON.stringify(e))
		}
	}

	async buyWithExactResource() {
		try {
			const valueMax = toToken(this.valueInMax)
			const tokens = this.prePath.split(',')
			const tokenIn = tokens[0]
			if (this.isETHValuated(this.valuationToken)) {
				if (this.isETHValuated(tokenIn)) {
					await this.sendPayment(
						'buyExactETHValuatedResourceByETH',
						[this.amountOut],
						{
							value: valueMax.toHexString()
						}
					)
				} else {
					await this.sendPayment('buyExactETHValuatedResourceByToken', [
						tokens,
						this.amountOut,
						valueMax,
						defaultDeadline()
					])
				}
			} else {
				if (this.isETHValuated(tokenIn)) {
					await this.sendPayment(
						'buyExactTokenValuatedResourceByETH',
						[this.amountOut, defaultDeadline()],
						{
							value: valueMax.toHexString()
						}
					)
				} else {
					if (tokenIn == this.valuationToken) {
						await this.sendPayment('buyExactTokenValuatedResourceByToken', [
							tokens,
							this.amountOut,
							valueMax
						])
					} else {
						await this.sendPayment(
							'buyExactTokenValuatedResourceByOtherToken',
							[tokens, this.amountOut, valueMax, defaultDeadline()]
						)
					}
				}
			}
		} catch (e) {
			this.$message.error(JSON.stringify(e))
		}
	}

	async sendPayment(method: string, args: any[], options?: CallOption) {
		await sendTransaction(
			Payment,
			method,
			[this.resource.address].concat(args),
			options
		)
	}

	async getAccountAmount() {
		const accounts = await getAccounts()
		const result = await call(this.resource, 'balances', [accounts[0]])
		this.resourceBalance = result.toString()
	}
}
</script>
<style lang="css">
.buy {
	background-color: cyan;
	padding: 8px;
	margin-top: 8px;
}
</style>
