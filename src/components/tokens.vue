<template>
	<div style="width:100%;">
		<a-select
			:default-value="erc20Index"
			@change="onTokenChanged"
		>
			<a-select-option value="0">
				AB {{ erc20Addresses[0] }}
			</a-select-option>
			<a-select-option value="1">
				DT {{ erc20Addresses[1] }}
			</a-select-option>
			<a-select-option value="2">
				USDT {{ erc20Addresses[2] }}
			</a-select-option>
			<a-select-option value="3">
				EVER {{ erc20Addresses[3] }}
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
	erc20Index = '0'
	erc20Addresses = [
		MockAB.address,
		MockDT.address,
		MockUSDT.address,
		MockEVER.address
	]

	async created() {
		this.$emit('onTokenChanged', this.erc20Deployment)
	}

	async onTokenChanged(value: string) {
		this.erc20Index = value
		this.$emit('onTokenChanged', this.erc20Deployment)
	}

	get erc20Deployment() {
		if (this.erc20Index == '0') {
			return MockAB
		} else if (this.erc20Index == '1') {
			return MockDT
		} else if (this.erc20Index == '2') {
			return MockUSDT
		} else {
			return MockEVER
		}
	}
}
</script>
