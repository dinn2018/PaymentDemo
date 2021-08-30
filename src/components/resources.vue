<template>
	<div style="width:100%;">
		<a-select
			:default-value="resourceIndex"
			@change="onResourceChanged"
		>
			<a-select-option value="0">
				InternalSwapResourceERC20 {{ resourceAddresses[0] }}
			</a-select-option>
			<a-select-option value="1">
				SimpleResourceERC20 {{ resourceAddresses[1] }}
			</a-select-option>
			<a-select-option value="2">
				SimpleResourceETH {{ resourceAddresses[2] }}
			</a-select-option>
		</a-select>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import InternalSwapResourceERC20 from '@/abi/InternalSwapResourceERC20.json'
import SimpleResourceERC20 from '@/abi/SimpleResourceERC20.json'
import SimpleResourceETH from '@/abi/SimpleResourceETH.json'

@Component
export default class Resources extends Vue {
	resourceIndex = '0'
	resourceAddresses = [
		InternalSwapResourceERC20.address,
		SimpleResourceERC20.address,
		SimpleResourceETH.address
	]

	async created() {
		this.$emit('onResourceChanged', this.resourceDeployment)
	}

	async onResourceChanged(value: string) {
		this.resourceIndex = value
		this.$emit('onResourceChanged', this.resourceDeployment)
	}

	get resourceDeployment() {
		if (this.resourceIndex == '0') {
			return InternalSwapResourceERC20
		} else if (this.resourceIndex == '1') {
			return SimpleResourceERC20
		} else {
			return SimpleResourceETH
		}
	}
}
</script>
