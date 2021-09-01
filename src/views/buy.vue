<template>
	<div style="width:100%;">
		<a-form>
			<a-form-item label="Resource">
				<Resources @onResourceChanged="onResourceChanged" />
			</a-form-item>
			<a-form-item label="Pre path">
				<PrePaths @onPathChanged="onPathChanged" />
			</a-form-item>
			<a-form-item label="Buy with exact value">
				<a-card :bordered="true">
					<div
						class="calculation-card"
						style="height:200px"
					>
						<a-form>
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
									Buy
								</a-button>
							</a-form-item>
						</a-form>
					</div>
				</a-card>
			</a-form-item>
			<a-form-item label="Buy with exact resource">
				<a-card :bordered="true">
					<div
						class="calculation-card"
						style="height:200px"
					>
						<a-form>
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
									Buy
								</a-button>
							</a-form-item>
						</a-form>
					</div>
				</a-card>
				<a-card>My Resource Amount: {{ resourceBalance }}</a-card>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { toToken, defaultDeadline, WETH } from '@/utils'

import Payment from '@/abi/Payment.json'
import Resources from '@/components/resources.vue'
import PrePaths from '@/components/pre-paths.vue'

@Component({
	components: {
		Resources,
		PrePaths
	}
})
export default class Buy extends Vue {
	resource: Deployment = { address: '', abi: [] }

	prePath: string[] = []

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

	async onPathChanged(path: string[]) {
		this.prePath = path
	}

	isETHValuated(token: string) {
		return token == WETH
	}

	async getValuationToken() {
		const result = await this.call(this.resource, 'valuationToken')
		this.valuationToken = result.toString()
	}

	async buyWithExactValue() {
		try {
			const value = toToken(this.valueIn)
			const tokenIn = this.prePath[0]
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
						this.prePath,
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
							[this.prePath, value, this.amountOutMin, defaultDeadline()]
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
			const tokenIn = this.prePath[0]
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
						this.prePath,
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
							this.prePath,
							this.amountOut,
							valueMax
						])
					} else {
						await this.sendPayment(
							'buyExactTokenValuatedResourceByOtherToken',
							[this.prePath, this.amountOut, valueMax, defaultDeadline()]
						)
					}
				}
			}
		} catch (e) {
			this.$message.error(JSON.stringify(e))
		}
	}

	async sendPayment(method: string, args: any[], options?: CallOption) {
		await this.sendTransaction(
			Payment,
			method,
			[this.resource.address].concat(args),
			options
		)
	}

	async getAccountAmount() {
		const account = await this.getAccount()
		const result = await this.call(this.resource, 'balances', [account])
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
