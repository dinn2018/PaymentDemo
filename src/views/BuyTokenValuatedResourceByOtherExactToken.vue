<template>
	<div>
		<a-form
			:form="form"
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 12 }"
		>
			<a-form-item label="Resource">
				<a-input v-model="resource" />
			</a-form-item>
			<a-form-item label="Resource pre path">
				<a-input v-model="prePath" />
			</a-form-item>
			<a-form-item label="Value In">
				<a-input v-model="valueIn" />
			</a-form-item>
			<a-form-item label="Amount resource minmum out">
				<a-input v-model="amountOutMin" />
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 12, offset: 5 }">
				<a-button
					type="primary"
					html-type="submit"
					@click="approve"
				>
					Approve
				</a-button>
				<a-button
					style="margin-left:8px;"
					type="primary"
					html-type="submit"
					@click="buy"
				>
					Buy
				</a-button>
				<a-button
					style="margin-left:8px;"
					type="primary"
					html-type="submit"
					@click="refresh"
				>
					Refresh
				</a-button>
			</a-form-item>
		</a-form>
		<div>Resource Amount: {{ resourceBalance }}</div>
		<div>Resource ValuationToken: {{ valuationToken }}</div>
		<div>Resource Beneficiary: {{ beneficiary }}</div>
		<div>Resource Total Received: {{ beneficiaryBalance }}</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BigNumber } from 'ethers'
import { toToken, formatToken, defaultDeadline } from '@/utils'
import { call, sendTransaction, getAccounts } from '@/utils/eth'

import Payment from '@/abi/Payment.json'
import MockAB from '@/abi/MockAB.json'
import SimpleResourceERC20 from '@/abi/SimpleResourceERC20.json'

@Component
export default class BuyTokenValuatedResourceByOtherExactToken extends Vue {
	resource = SimpleResourceERC20.address
	allowance = '0'

	// AB -> DT -> EVER
	prePath =
		'0x7a6ca1B5e1e5DDd9E5F4b4f685319f990A5585Db,0x455d2b264DC5b543014E24f8599b3E8177f73654,0xc0D05413823E6ebeA748285d468295eB384057A9'
	valueIn = '0'
	amountOutMin = '0'
	form = {}
	valuationToken = ''
	resourceBalance = '0'
	beneficiary = ''
	beneficiaryBalance = '0'

	async created() {
		this.refresh()
	}

	async approve() {
		const vi = toToken(this.valueIn)
		const result = await sendTransaction(MockAB, 'approve', [
			Payment.address,
			vi
		])
		console.log('approve', result)
	}

	async buy() {
		const vi = toToken(this.valueIn)
		const tokens = this.prePath.split(',')
		const result = await sendTransaction(
			Payment,
			'buyTokenValuatedResourceByOtherExactToken',
			[this.resource, tokens, vi, 0, defaultDeadline()]
		)
		console.log('buyTokenValuatedResourceByOtherExactToken', result)
	}

	async refresh() {
		await this.getAccountAmount()
		await this.getResourceValuationToken()
		await this.getResourceBeneficiary()
		await this.getBeneficiaryBalance()
	}

	async getAccountAmount() {
		const accounts = await getAccounts()
		const result = await call(SimpleResourceERC20, 'balances', [accounts[0]], {
			to: this.resource
		})
		this.resourceBalance = result.toString()
		return this.resourceBalance
	}

	async getResourceBeneficiary() {
		const result = await call(SimpleResourceERC20, 'beneficiary', [], {
			to: this.resource
		})
		this.beneficiary = result.toString()
		return this.beneficiary
	}

	async getResourceValuationToken() {
		const result = await call(SimpleResourceERC20, 'valuationToken', [], {
			to: this.resource
		})
		this.valuationToken = result.toString()
		return this.valuationToken
	}

	async getBeneficiaryBalance() {
		const result = await call(MockAB, 'balanceOf', [this.beneficiary], {
			to: this.valuationToken
		})
		this.beneficiaryBalance = formatToken(BigNumber.from(result.toString()))
		return this.beneficiaryBalance
	}
}
</script>
