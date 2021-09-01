import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

export const UPDATE_ACCOUNT = 'update-account'
export const UPDATE_CHAINID = 'update-chainId'

interface AccountState {
	account: string
	chainId: string
}

class InvoiceStore extends Vuex.Store<AccountState>{
	constructor() {
		super({
			state: {
				account: '',
				chainId: ''
			},
			mutations: {
				[UPDATE_ACCOUNT](state: AccountState, account: string) {
					state.account = account
				},
				[UPDATE_CHAINID](state: AccountState, chainId: string) {
					state.chainId = chainId
				},
			}
		})
	}

}

const store = new InvoiceStore()

export default store