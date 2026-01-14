// const API_URL = 'https://localhost:5073/';

import type { ClientRegisterData, LoginData, MasterRegisterData } from '../types/auth'

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
			const errorData = await response
				.json()
				.catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage = 
    Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
    typeof errorData.errors === 'string' ? errorData.errors :
    errorData.message || 'Ошибка регистрации'
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
			const errorData = await response
				.json()
				.catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage = 
    Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
    typeof errorData.errors === 'string' ? errorData.errors :
    errorData.message || 'Ошибка регистрации'
			throw new Error(errorMessage)
		}
		return response.json()
	},
	GetClientProfile: async () => {
		const response = await fetch('http://localhost:5073/api/Client/profile', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage =
				errorData.errors?.join(', ') || errorData.message || 'Ошибка входа'
			throw new Error(errorMessage)
		}
		return response.json()
	},
	LogoutClient: async () => {
		const response = await fetch('http://localhost:5073/api/Client/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage = 
    Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
    typeof errorData.errors === 'string' ? errorData.errors :
    errorData.message || 'Ошибка регистрации'
			throw new Error(errorMessage)
		}
		return response.json()
	},



	AuthorizationMaster: async (userData: MasterRegisterData) => {
		const response = await fetch('http://localhost:5073/api/Master/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage = 
    Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
    typeof errorData.errors === 'string' ? errorData.errors :
    errorData.message || 'Ошибка регистрации'
			throw new Error(errorMessage)
		}
		return response.json()
	},
	LoginMaster: async (loginData: LoginData) => {
		const response = await fetch('http://localhost:5073/api/Master/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(loginData),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage = 
    Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
    typeof errorData.errors === 'string' ? errorData.errors :
    errorData.message || 'Ошибка регистрации'
			throw new Error(errorMessage)
		}
		return response.json()
	},
	GetMasterProfile: async () => {
		const response = await fetch('http://localhost:5073/api/Master/profile', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage = 
    Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
    typeof errorData.errors === 'string' ? errorData.errors :
    errorData.message || 'Ошибка регистрации'
			throw new Error(errorMessage)
		}
		return response.json()
	},
	LogoutMaster: async () => {
		const response = await fetch('http://localhost:5073/api/Master/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage = 
    Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
    typeof errorData.errors === 'string' ? errorData.errors :
    errorData.message || 'Ошибка регистрации'
			throw new Error(errorMessage)
		}
		return response.json()
	}
}
