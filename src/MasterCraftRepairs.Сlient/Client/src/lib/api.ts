// const API_URL = 'https://localhost:5073/';

import type { ClientRegisterData } from '../types/auth'

export const Api = {
	test: async () => {
		const response = await fetch('http://localhost:5073/api/Test/test')
		if (!response.ok) {
			throw new Error(`Backend упал: ${response.status} ${response.statusText}`)
		}
		return response.json()
	},
	AuthorizationClient: async (userData: ClientRegisterData) => {
		const response = await fetch('http://localhost:5073/api/Auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		})
		if (!response.ok) throw new Error('Failed registration')
		return response.json()
	}
}
