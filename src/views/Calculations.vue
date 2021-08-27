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
			<a-form-item label="Amount resource">
				<a-input v-model="amountOut" />
			</a-form-item>
			<a-form-item :wrapper-col="{ span: 12, offset: 5 }">
				<a-button
					type="primary"
					html-type="submit"
					@click="getAmountOut"
				>
					Get Amount Out
				</a-button>
				<a-button
					style="margin-left:8px;"
					type="primary"
					html-type="submit"
					@click="getValuesIn"
				>
					Get Values In
				</a-button>
			</a-form-item>
		</a-form>
		<div>Resource AmountOut: {{ resourceOut }}</div>
		<div>Resource ValuesIn: {{ valuesIn }}</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { utils } from 'ethers'
import { toToken, formatToken } from '@/utils'
import { call } from '@/utils/eth'

import Payment from '@/abi/Payment.json'
import MockAB from '@/abi/MockAB.json'
import SimpleResourceERC20 from '@/abi/SimpleResourceERC20.json'

@Component
export default class Calculations extends Vue {
	form = {}

	resource = '0x66D575cA7e77C53679Dd49bcDd64075e621E01f9'
	// AB -> DT -> EVER
	prePath =
		'0x7a6ca1B5e1e5DDd9E5F4b4f685319f990A5585Db,0x455d2b264DC5b543014E24f8599b3E8177f73654,0xc0D05413823E6ebeA748285d468295eB384057A9'
	valueIn = '0'
	amountOut = '0'
	resourceOut = '0'
	valuesIn = ''

	paymentInterface = new utils.Interface(Payment.abi)
	abInterface = new utils.Interface(MockAB.abi)
	simpleResourceERC20Inteface = new utils.Interface(SimpleResourceERC20.abi)
	erc20Interface = new utils.Interface(MockAB.abi)

	async getAmountOut() {
		const tokens = this.prePath.split(',')
		const result = await call(Payment, 'getAmountOut', [
			this.resource,
			tokens,
			toToken(this.valueIn)
		])
		this.resourceOut = result.toString()
		return this.resourceOut
	}

	async getValuesIn() {
		const tokens = this.prePath.split(',')
		const result = await call(Payment, 'getValuesIn', [
			this.resource,
			tokens,
			this.amountOut
		])
		this.valuesIn = result[0].map((v: any) => formatToken(v)).toString()
		return this.valuesIn
	}
}
</script>
