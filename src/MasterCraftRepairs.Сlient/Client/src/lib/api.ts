// const API_URL = 'https://localhost:5073/';

import type { ClientRegisterData, LoginData } from '../types/auth'

export const Api = {
	test: async () => {
		const response = await fetch('http://localhost:5073/api/Test/test')
		if (!response.ok) {
			throw new Error(`Backend упал: ${response.status} ${response.statusText}`)
		}
		return response.json()
	},
	AuthorizationClient: async (userData: ClientRegisterData) => {
		const response = await fetch('http://localhost:5073/api/Client/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage = errorData.errors?.join(', ') || errorData.message || 'Ошибка регистрации'
			throw new Error(errorMessage)
		}
		return response.json()
	},
	LoginClient: async (loginData: LoginData) => {
		const response = await fetch('http://localhost:5073/api/Client/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(loginData),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage = errorData.errors?.join(', ') || errorData.message || 'Ошибка входа'
			throw new Error(errorMessage)
		}
		return response.json()
	}
}
