<template>
	<div id="app">
		<div style="width: 350px">
			<a-card>
				<a-button
					v-if="!isConnected"
					type="primary"
					@click="connect"
				>
					Connect
				</a-button>
				<div v-else>
					Connected: {{ formatAccount }} Network: {{ network }}
					<a-icon
						v-if="isNetworkSupported"
						style="color:green;"
						type="check-circle"
						theme="filled"
					/>
					<a-icon
						v-else
						style="color:red;"
						type="warning"
						theme="filled"
					/>
				</div>
			</a-card>
			<a-menu
				:default-selected-keys="['1']"
				:default-open-keys="['sub1']"
				mode="inline"
			>
				<a-menu-item key="1">
					<span>Approve</span>
					<router-link to="/" />
				</a-menu-item>
				<a-menu-item key="2">
					<span>Calculation</span>
					<router-link to="/calculation" />
				</a-menu-item>
				<a-menu-item key="3">
					<span>Statistics</span>
					<router-link to="/statistics" />
				</a-menu-item>
				<a-menu-item key="4">
					<span>Buy</span>
					<router-link to="/buy" />
				</a-menu-item>
			</a-menu>
		</div>
		<keep-alive>
			<router-view style="margin-left:8px;" />
		</keep-alive>
	</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { UPDATE_ACCOUNT, UPDATE_CHAINID } from '@/store'
import { formatNetwork, isNetworkSupported } from '@/utils'

@Component
export default class App extends Vue {
	async created() {
		this.checkAccount()
		this.listen()
	}

	get isNetworkSupported() {
		return isNetworkSupported(this.$store.state.chainId)
	}

	get isConnected() {
		if (!window.ethereum) {
			return false
		}
		return !!this.$store.state.account
	}

	get network() {
		return formatNetwork(this.$store.state.chainId)
	}

	async checkAccount() {
		if (window.ethereum) {
			let accounts = await window.ethereum.request({
				method: 'eth_accounts'
			})
			if (accounts.length > 0) {
				this.$store.commit(UPDATE_ACCOUNT, accounts[0])
				this.$store.commit(UPDATE_CHAINID, window.ethereum.chainId)
			}
		}
	}

	async connect() {
		if (!window.ethereum) {
			return this.$message.warn('Please install MetaMask to use this app.')
		}

		if (!isNetworkSupported(window.ethereum.chainId)) {
			return this.$message.error(
				'Please MetaMask change your network to `Goerli`.'
			)
		}

		let accounts = await window.ethereum.request({
			method: 'eth_accounts'
		})
		if (accounts.length == 0) {
			accounts = await window.ethereum.request({
				method: 'eth_requestAccounts'
			})
		}

		this.$store.commit(UPDATE_ACCOUNT, accounts[0])
		this.$store.commit(UPDATE_CHAINID, window.ethereum.chainId)
	}

	listen() {
		window.ethereum.on('accountsChanged', accounts => {
			this.$store.commit(UPDATE_ACCOUNT, accounts[0])
		})

		window.ethereum.on('chainChanged', chainId => {
			this.$store.commit(UPDATE_CHAINID, chainId)
		})
	}

	get formatAccount() {
		const account = this.$store.state.account
		if (account.length > 0) {
			return (
				account.substr(0, 10) + '....' + account.substr(account.length - 8, 8)
			)
		}
		return account
	}
}
</script>
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
}
</style>
