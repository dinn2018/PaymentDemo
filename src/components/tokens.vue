<template>
	<div style="width:100%;">
		<a-select
			default-value="0"
			@change="onTokenChanged"
		>
			<a-select-option
				v-for="(token, i) of tokens"
				:key="`${i}-${token.name}`"
				:value="`${i}`"
			>
				{{ token.name }} {{ token.deployment.address }}
			</a-select-option>
		</a-select>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import MockAB from '@/abi/MockAB.json'
import MockDT from '@/abi/MockDT.json'
import MockUSDT from '@/abi/MockUSDT.json'
import MockEVER from '@/abi/MockEVER.json'

@Component
export default class Tokens extends Vue {
	tokens = [
		{
			name: 'AB',
			deployment: MockAB
		},
		{
			name: 'DT',
			deployment: MockDT
		},
		{
			name: 'USDT',
			deployment: MockUSDT
		},
		{
			name: 'EVER',
			deployment: MockEVER
		}
	]

	async created() {
		this.$emit('onTokenChanged', this.tokens[0].deployment)
	}

	async onTokenChanged(index: number) {
		this.$emit('onTokenChanged', this.tokens[index].deployment)
	}
}
</script>
