<template>
	<div style="width:100%;">
		<a-form
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 16 }"
		>
			<a-form-item label="Resource">
				<Resources @onResourceChanged="onResourceChanged" />
			</a-form-item>
			<a-form-item label="Pre path">
				<a-input v-model="prePath" />
			</a-form-item>
			<a-form-item label="Value In">
				<a-input v-model="valueIn" />
				<a-button
					type="primary"
					html-type="submit"
					@click="getAmountOut"
				>
					Get Amount Out
				</a-button>
				<div>Resource AmountOut: {{ resourceOut }}</div>
			</a-form-item>
			<a-form-item label="Amount resource">
				<a-input v-model="amountOut" />
				<a-button
					style="margin-left:8px;"
					type="primary"
					html-type="submit"
					@click="getValuesIn"
				>
					Get Values In
				</a-button>
				<div>Resource ValuesIn: {{ valuesIn }}</div>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { toToken, formatToken } from '@/utils'
import { call, Deployment } from '@/utils/eth'
import Resources from '@/components/resources.vue'
import Tokens from '@/components/tokens.vue'
import Payment from '@/abi/Payment.json'

@Component({
	components: {
		Resources,
		Tokens
	}
})
export default class Calculations extends Vue {
	resource: Deployment = { address: '', abi: [] }

	// AB -> DT -> EVER
	prePath =
		'0x7a6ca1B5e1e5DDd9E5F4b4f685319f990A5585Db,0x455d2b264DC5b543014E24f8599b3E8177f73654,0xc0D05413823E6ebeA748285d468295eB384057A9'
	valueIn = '0'
	amountOut = '0'

	resourceOut = '0'
	valuesIn = ''

	async onResourceChanged(resource: Deployment) {
		this.resource = resource
	}

	async getAmountOut() {
		try {
			const tokens = this.prePath.split(',')
			const result = await call(Payment, 'getAmountOut', [
				this.resource.address,
				tokens,
				toToken(this.valueIn)
			])
			this.resourceOut = result.toString()
			return this.resourceOut
		} catch (e) {
			this.$message.error({
				content: JSON.stringify(e)
			})
		}
	}

	async getValuesIn() {
		const tokens = this.prePath.split(',')
		const result = await call(Payment, 'getValuesIn', [
			this.resource.address,
			tokens,
			this.amountOut
		])
		this.valuesIn = result[0].map((v: any) => formatToken(v)).toString()
		return this.valuesIn
	}
}
</script>
