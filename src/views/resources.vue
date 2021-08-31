<template>
	<div style="width:100%;">
		<a-form
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 12 }"
		>
			<a-form-item label="Resource">
				<Resources @onResourceChanged="onResourceChanged" />
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 12, offset: 5 }">
				<a-card :bordered="true">
					<div class="calculation-card">
						<div>Resource Beneficiary: {{ beneficiary }}</div>
						<div>
							Resource ValuationToken: {{ valuationTokenName }}
							{{ valuationToken }}
						</div>
						<div>Resource Beneficiary Balance: {{ beneficiaryBalance }}</div>
						<div v-if="hasSwap">
							<div>Resource Swap Receiver: {{ swapReceiver }}</div>
							<div>Resource Swap Token:{{ swapTokenName }} {{ swapToken }}</div>
							<div>
								Resource Swap Receiver Balance:{{ swapReceiverBalance }}
							</div>
						</div>
					</div>
				</a-card>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BigNumber } from 'ethers'
import { formatToken, WETH } from '@/utils'
import { call, Deployment, getBalance } from '@/utils/eth'
import Resources from '@/components/resources.vue'
import MockAB from '@/abi/MockAB.json'

@Component({
	components: {
		Resources
	}
})
export default class Calculations extends Vue {
	resource: Deployment = { address: '', abi: [] }

	beneficiary = ''
	valuationToken = ''
	valuationTokenName = ''
	beneficiaryBalance = '0'

	hasSwap = false

	swapReceiver = ''
	swapToken = ''
	swapTokenName = ''
	swapReceiverBalance = '0'

	async onResourceChanged(resource: Deployment) {
		this.resource = resource
		try {
			await this.getSwapToken()
			await this.getSwapReceiver()
			await this.getSwapTokenName()
			await this.getSwapReceiverBalance()
			this.hasSwap = true
		} catch (e) {
			this.hasSwap = false
		}
		await this.getBeneficiary()
		await this.getValuationToken()
		await this.getValuationTokenName()
		await this.getBeneficiaryBalance()
	}

	async getBeneficiary() {
		const result = await call(this.resource, 'beneficiary')
		this.beneficiary = result.toString()
		return this.beneficiary
	}

	async getValuationToken() {
		const result = await call(this.resource, 'valuationToken')
		this.valuationToken = result.toString()
		return this.valuationToken
	}

	async getValuationTokenName() {
		const result = await call(MockAB, 'name', [], {
			to: this.valuationToken
		})
		this.valuationTokenName = result.toString()
		return this.valuationTokenName
	}

	async getBeneficiaryBalance() {
		if (this.valuationToken != WETH) {
			const result = await call(MockAB, 'balanceOf', [this.beneficiary], {
				to: this.valuationToken
			})
			this.beneficiaryBalance = formatToken(BigNumber.from(result.toString()))
		} else {
			const result = await getBalance({
				from: this.beneficiary
			})
			console.log(BigNumber.from(result.toString()))
			this.beneficiaryBalance = formatToken(BigNumber.from(result.toString()))
		}
	}

	async getSwapToken() {
		const result = await call(this.resource, 'swapToken')
		this.swapToken = result.toString()
	}

	async getSwapTokenName() {
		if (this.swapToken) {
			const result = await call(MockAB, 'name', [], {
				to: this.swapToken
			})
			this.swapTokenName = result.toString()
		}
	}

	async getSwapReceiver() {
		if (this.swapToken) {
			const result = await call(this.resource, 'swapReceiver')
			this.swapReceiver = result.toString()
		}
	}

	async getSwapReceiverBalance() {
		if (this.swapToken && this.swapReceiver) {
			if (this.valuationToken != WETH) {
				const result = await call(MockAB, 'balanceOf', [this.swapReceiver], {
					to: this.swapToken
				})
				this.swapReceiverBalance = formatToken(
					BigNumber.from(result.toString())
				)
			} else {
				const result = await getBalance({
					from: this.swapReceiver
				})
				this.swapReceiverBalance = formatToken(
					BigNumber.from(result.toString())
				)
			}
		}
	}
}
</script>
