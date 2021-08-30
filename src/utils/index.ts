import { BigNumber } from 'ethers'

export const WETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

export const oneToken = BigNumber.from(1e18.toString())

export const toToken = (value: string) => {
	if (parseFloat(value) < 1) {
		return BigNumber.from((parseFloat(value) * 1e18).toString())
	}
	return BigNumber.from(value).mul(oneToken)
}

export const formatToken = (value: BigNumber) => {
	if (value < oneToken) {
		return (value.toNumber() / 1e18 * 1.0).toFixed(10)
	}
	return value.div(oneToken).toString()
}

export const defaultDeadline = () => {
	return BigNumber.from(Math.floor(Date.now() / 1000 + 100000))
}
