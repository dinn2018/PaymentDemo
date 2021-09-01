<template>
	<div style="width:100%;">
		<a-form>
			<a-form-item label="Resource">
				<Resources @onResourceChanged="onResourceChanged" />
			</a-form-item>
			<a-form-item label="Pre path">
				<PrePaths @onPathChanged="onPathChanged" />
			</a-form-item>
			<a-form-item label="Value In">
				<a-card :bordered="true">
					<div class="calculation-card">
						<a-input v-model="valueIn" />
						<a-button
							type="primary"
							html-type="submit"
							@click="getAmountOut"
						>
							Get Amount Out
						</a-button>
						<div>Resource AmountOut: {{ resourceOut }}</div>
					</div>
				</a-card>
			</a-form-item>
			<a-form-item label="Amount resource">
				<a-card :bordered="true">
					<div class="calculation-card">
						<a-input v-model="amountOut" />
						<a-button
							type="primary"
							html-type="submit"
							@click="getValuesIn"
						>
							Get Values In
						</a-button>
						<div>Resource ValuesIn: {{ valuesIn }}</div>
					</div>
				</a-card>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { toToken, formatToken } from '@/utils'
import Resources from '@/components/resources.vue'
import PrePaths from '@/components/pre-paths.vue'
import Payment from '@/abi/Payment.json'

@Component({
	components: {
		Resources,
		PrePaths
	}
})
export default class Calculation extends Vue {
	resource: Deployment = { address: '', abi: [] }

	prePath: string[] = []
	valueIn = '0'
	amountOut = '0'

	resourceOut = '0'
	valuesIn = ''

	async onResourceChanged(resource: Deployment) {
		this.resource = resource
	}

	async onPathChanged(prePath: string[]) {
		this.prePath = prePath
	}

	async getAmountOut() {
		try {
			const result = await this.call(Payment, 'getAmountOut', [
				this.resource.address,
				this.prePath,
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
		const result = await this.call(Payment, 'getValuesIn', [
			this.resource.address,
			this.prePath,
			this.amountOut
		])
		this.valuesIn = result[0].map((v: any) => formatToken(v)).toString()
		return this.valuesIn
	}
}
</script>
