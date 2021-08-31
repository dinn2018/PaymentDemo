<template>
	<div style="width:100%;">
		<a-select
			default-value="0"
			@change="onPathChanged"
		>
			<a-select-option
				v-for="(path, i) of paths"
				:key="`${i}-${path.name}`"
				:value="`${i}`"
			>
				{{ path.name }}
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
export default class PrePaths extends Vue {
	// AB -> DT -> EVER -> USDT
	paths = [
		{
			name: 'DT -> EVER',
			value: [MockDT.address, MockEVER.address]
		},
		{
			name: 'AB -> DT -> EVER',
			value: [MockAB.address, MockDT.address, MockEVER.address]
		},
		{
			name: 'AB -> DT',
			value: [MockAB.address, MockDT.address]
		},
		{
			name: 'AB -> DT -> EVER -> USDT',
			value: [
				MockAB.address,
				MockDT.address,
				MockEVER.address,
				MockUSDT.address
			]
		},
		{
			name: 'EVER',
			value: [MockEVER.address]
		}
	]

	async created() {
		this.$emit('onPathChanged', this.paths[0].value)
	}

	async onPathChanged(index: number) {
		this.$emit('onPathChanged', this.paths[index].value)
	}
}
</script>
