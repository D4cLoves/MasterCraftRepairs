// const API_URL = 'https://localhost:5073/';

import type { ClientRegisterData, LoginData, MasterRegisterData, OrderData } from '../types/auth'

export const Api = {
	test: async () => {
		const response = await fetch('http://localhost:5073/api/Test/test')
		if (!response.ok) {
			throw new Error(`Backend упал: ${response.status} ${response.statusText}`)
		}
		return response.json()
	},
	LoginAdmin: async (loginData: LoginData) => {
		const response = await fetch('http://localhost:5073/api/Admin/login', {
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
    errorData.message || 'Ошибка входа'
			throw new Error(errorMessage)
		}
		return response.json()
	},

	LogoutAdmin: async () => {
		const response = await fetch('http://localhost:5073/api/Admin/logout', {
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
    errorData.message || 'Ошибка выхода'
			throw new Error(errorMessage)
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
    Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
    typeof errorData.errors === 'string' ? errorData.errors :
    errorData.message || 'Ошибка входа'
			throw new Error(errorMessage)
		}
		return response.json()
	},
	UpdateClientProfile: async (payload: { phone: string; passport: string; address: string }) => {
		const response = await fetch('http://localhost:5073/api/Client/profile', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phone: payload.phone,
				passport: payload.passport,
				address: payload.address
			}),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage =
				Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
				typeof errorData.errors === 'string' ? errorData.errors :
				errorData.message || 'Ошибка обновления профиля'
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
	GetCategories: async () => {
		const response = await fetch('http://localhost:5073/api/Order/categories', {
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
    errorData.message || 'Ошибка загрузки категорий'
			throw new Error(errorMessage)
		}
		return response.json()
	},



	CreateOrder: async (orderData: OrderData) => {
		const response = await fetch('http://localhost:5073/api/Order/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(orderData),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage =
    Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
    typeof errorData.errors === 'string' ? errorData.errors :
    errorData.message || 'Ошибка создания заказа'
			throw new Error(errorMessage)
		}
		return response.json()
	},

	GetMyOrders: async () => {
		const response = await fetch('http://localhost:5073/api/Order/my-orders', {
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
    errorData.message || 'Ошибка загрузки заказов'
			throw new Error(errorMessage)
		}
		return response.json()
	},

	UpdateOrderDescription: async (orderId: string, description: string) => {
		const response = await fetch(`http://localhost:5073/api/Order/${orderId}/description`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ description }),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage =
				Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
				typeof errorData.errors === 'string' ? errorData.errors :
				errorData.message || 'Ошибка обновления обращения'
			throw new Error(errorMessage)
		}
		return response.json()
	},

	CancelOrder: async (orderId: string) => {
		const response = await fetch(`http://localhost:5073/api/Order/${orderId}/cancel`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Unknown error'] }))
			const errorMessage =
				Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
				typeof errorData.errors === 'string' ? errorData.errors :
				errorData.message || 'Error cancelling order'
			throw new Error(errorMessage)
		}
		return response.json();
	},

	GetAvailableOrders: async () => {
		const response = await fetch('http://localhost:5073/api/Order/available', {
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
    errorData.message || 'Ошибка загрузки заказов'
			throw new Error(errorMessage)
		}
		return response.json()
	},

	GetMasterOrders: async () => {
		const response = await fetch('http://localhost:5073/api/Order/master-orders', {
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
    errorData.message || 'Ошибка загрузки заказов'
			throw new Error(errorMessage)
		}
		return response.json()
	},

	GetMasterCompletedOrders: async () => {
		const response = await fetch('http://localhost:5073/api/Order/completed', {
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
    errorData.message || 'Ошибка загрузки заказов'
			throw new Error(errorMessage)
		}
		return response.json()
	},

	TakeOrder: async (orderId: string) => {
		const response = await fetch(`http://localhost:5073/api/Order/take/${orderId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage =
				Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
				typeof errorData.errors === 'string' ? errorData.errors :
				errorData.message || 'Ошибка принятия заказа'
			throw new Error(errorMessage)
		}
		return response.json()
	},

	CompleteOrder: async (orderId: string) => {
		const response = await fetch(`http://localhost:5073/api/Order/complete/${orderId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage =
				Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
				typeof errorData.errors === 'string' ? errorData.errors :
				errorData.message || 'Ошибка завершения заказа'
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
	UpdateMasterProfile: async (payload: { phone: string; passport: string }) => {
		const response = await fetch('http://localhost:5073/api/Master/profile', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phone: payload.phone,
				passport: payload.passport
			}),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			const errorMessage =
				Array.isArray(errorData.errors) ? errorData.errors.join(', ') :
				typeof errorData.errors === 'string' ? errorData.errors :
				errorData.message || 'Ошибка обновления профиля'
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
	},

	// Admin API
	AdminGetClients: async () => {
		const response = await fetch('http://localhost:5073/api/Admin/clients', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		})
		if (!response.ok) throw new Error('Ошибка загрузки клиентов')
		return response.json()
	},

	AdminCreateClient: async (data: any) => {
		const response = await fetch('http://localhost:5073/api/Admin/clients', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			throw new Error(Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.message || 'Ошибка создания клиента')
		}
		return response.json()
	},

	AdminUpdateClient: async (id: string, data: any) => {
		const response = await fetch(`http://localhost:5073/api/Admin/clients/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			throw new Error(Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.message || 'Ошибка обновления клиента')
		}
		return response.json()
	},

	AdminDeleteClient: async (id: string) => {
		const response = await fetch(`http://localhost:5073/api/Admin/clients/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			throw new Error(Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.message || 'Ошибка удаления клиента')
		}
		return response.json()
	},

	AdminGetMasters: async () => {
		const response = await fetch('http://localhost:5073/api/Admin/masters', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		})
		if (!response.ok) throw new Error('Ошибка загрузки мастеров')
		return response.json()
	},

	AdminCreateMaster: async (data: any) => {
		const response = await fetch('http://localhost:5073/api/Admin/masters', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			throw new Error(Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.message || 'Ошибка создания мастера')
		}
		return response.json()
	},

	AdminUpdateMaster: async (id: string, data: any) => {
		const response = await fetch(`http://localhost:5073/api/Admin/masters/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			throw new Error(Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.message || 'Ошибка обновления мастера')
		}
		return response.json()
	},

	AdminDeleteMaster: async (id: string) => {
		const response = await fetch(`http://localhost:5073/api/Admin/masters/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			throw new Error(Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.message || 'Ошибка удаления мастера')
		}
		return response.json()
	},

	AdminGetCategories: async () => {
		const response = await fetch('http://localhost:5073/api/Admin/categories', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		})
		if (!response.ok) throw new Error('Ошибка загрузки категорий')
		return response.json()
	},

	AdminCreateCategory: async (data: any) => {
		const response = await fetch('http://localhost:5073/api/Admin/categories', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			throw new Error(Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.message || 'Ошибка создания категории')
		}
		return response.json()
	},

	AdminUpdateCategory: async (id: string, data: any) => {
		const response = await fetch(`http://localhost:5073/api/Admin/categories/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			throw new Error(Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.message || 'Ошибка обновления категории')
		}
		return response.json()
	},

	AdminDeleteCategory: async (id: string) => {
		const response = await fetch(`http://localhost:5073/api/Admin/categories/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ errors: ['Неизвестная ошибка'] }))
			throw new Error(Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.message || 'Ошибка удаления категории')
		}
		return response.json()
	},

	AdminGetOrders: async () => {
		const response = await fetch('http://localhost:5073/api/Admin/orders', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		})
		if (!response.ok) throw new Error('Ошибка загрузки заказов')
		return response.json()
	},

	AdminGetMasterOrders: async (masterId: string) => {
		const response = await fetch(`http://localhost:5073/api/Admin/masters/${masterId}/orders`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include'
		})
		if (!response.ok) throw new Error('Ошибка загрузки заказов мастера')
		return response.json()
	}
}
