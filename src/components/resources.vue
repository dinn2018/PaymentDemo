<template>
	<div style="width:100%;">
		<a-select
			default-value="0"
			@change="onResourceChanged"
		>
			<a-select-option
				v-for="(resource, i) of resources"
				:key="`${i}-${resource.deployment.address}`"
				:value="`${i}`"
			>
				{{ resource.name }} {{ resource.deployment.address }}
			</a-select-option>
		</a-select>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import StorageWithExpiration from '@/abi/StorageWithExpiration.json'
// import SimpleResourceERC20 from '@/abi/SimpleResourceERC20.json'
// import SimpleResourceETH from '@/abi/SimpleResourceETH.json'

@Component
export default class Resources extends Vue {
	resources = [
		{
			name: 'StorageWithExpiration',
			deployment: StorageWithExpiration
		}
	]
	async created() {
		this.$emit('onResourceChanged', this.resources[0].deployment)
	}

	async onResourceChanged(index: number) {
		this.$emit('onResourceChanged', this.resources[index].deployment)
	}
}
</script>
