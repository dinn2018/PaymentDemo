import { utils } from 'ethers'

export const call = async (
	contractDeployments: {
		address: string,
		abi: any[]
	},
	functionName: string,
	args?: any[],
	options?: {
		from?: string,
		value?: string,
		to?: string,
		gas?: string,
		gasPrice?: string
	}
) => {
	const accounts = await getAccounts()
	const contractInterface = new utils.Interface(contractDeployments.abi)
	const data = contractInterface.encodeFunctionData(functionName, args)
	const result = await window.ethereum.request({
		method: 'eth_call',
		params: [
			{
				from: options?.from || accounts[0],
				to: options?.to || contractDeployments.address,
				data,
				value: options?.value,
				gas: options?.gas,
				gasPrice: options?.gasPrice
			}
		]
	})
	return contractInterface.decodeFunctionResult(functionName, result)
}

export const sendTransaction = async (
	contractDeployments: {
		address: string,
		abi: any[]
	},
	functionName: string,
	args?: any[],
	options?: {
		from?: string,
		to?: string,
		value?: string,
		gas?: string,
		gasPrice?: string
	}
) => {
	const accounts = await getAccounts()
	const contractInterface = new utils.Interface(contractDeployments.abi)
	const data = contractInterface.encodeFunctionData(functionName, args)
	return window.ethereum.request({
		method: 'eth_sendTransaction',
		params: [
			{
				from: options?.from || accounts[0],
				to: options?.to || contractDeployments.address,
				data,
				value: options?.value,
				gas: options?.gas,
				gasPrice: options?.gasPrice
			}
		]
	})


}

export const getAccounts = async (): Promise<string[]> => {
	let accounts = await window.ethereum.request({
		method: 'eth_accounts'
	})
	if (accounts.length == 0) {
		accounts = await window.ethereum.request({
			method: 'eth_requestAccounts'
		})
	}
	return accounts
}