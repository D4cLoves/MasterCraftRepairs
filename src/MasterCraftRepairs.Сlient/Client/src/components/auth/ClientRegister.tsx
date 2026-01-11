import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Api } from '../../lib/api'
import type { ClientRegisterData, LoginData } from '../../types/auth'
import './Auth.css'

const registerClient = async (userData: ClientRegisterData) => {
	try {
		const result = await Api.AuthorizationClient(userData)
		return result
	} catch (error) {
		console.error('Registration error:', error)
		throw error
	}
}

const registerSchema = z
	.object({
		firstName: z.string().min(1, 'Имя обязательно для заполнения'),
		lastName: z.string().min(1, 'Фамилия обязательна для заполнения'),
		phone: z.string().min(1, 'Телефон обязателен для заполнения'),
		passport: z.string().min(1, 'Номер паспорта обязателен для заполнения'),
		address: z.string().min(1, 'Адрес обязателен для заполнения'),
		birthday: z.string().min(1, 'Дата рождения обязательна для заполнения'),
		email: z.string().email('Введите корректный email'),
		password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
		confirmPassword: z.string().min(1, 'Подтверждение пароля обязательно')
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	})

export const ClientRegister = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		passport: '',
		address: '',
		birthday: '',
		email: '',
		password: '',
		confirmPassword: ''
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
	const [registrationResult, setRegistrationResult] = useState<{
		message?: string
		success?: boolean
	} | null>(null)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const validation = registerSchema.safeParse(formData)

		if (!validation.success) {
			const fieldErrors: Record<string, string> = {}

			validation.error.issues.forEach(issue => {
				if (issue.path && issue.path[0]) {
					const fieldName = issue.path[0] as string
					fieldErrors[fieldName] = issue.message
				}
			})

			setErrors(fieldErrors)
			return
		}
		setErrors({})
		setIsLoading(true)
		try {
			const result = await registerClient(formData)
			setRegistrationResult(result)
			setIsSuccessModalOpen(true)

			// Автоматически логиним пользователя после регистрации
			try {
				const loginData: LoginData = {
					email: formData.email,
					password: formData.password
				};
				const loginResult = await Api.LoginClient(loginData);

				if (loginResult.token) {
					// Закрываем модалку и редиректим через небольшую задержку
					setTimeout(() => {
						setIsSuccessModalOpen(false);
						navigate('/cabinet/client');
					}, 1500);
				}
			} catch (loginError) {
				// Если автологин не удался, просто закрываем модалку
				// Пользователь сможет залогиниться вручную
				console.error('Auto-login failed:', loginError);
			}
		} catch (error) {
			console.error('Registration failed:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Ошибка регистрации'
			setErrors({ submit: errorMessage })
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="auth-container register-form-container">
			<div className="auth-card">
				<h2 className="auth-title">Регистрация клиента</h2>
				<p className="auth-subtitle">Создайте аккаунт для подачи обращений</p>
				<form
					onSubmit={handleSubmit}
					className="auth-form register-form"
				>
					<div className="form-row">
						<div className="form-group">
							<label htmlFor="client-firstName">Имя</label>
							<input
								id="client-firstName"
								name="firstName"
								type="text"
								value={formData.firstName}
								onChange={handleChange}
								placeholder="Имя"
								className={errors.firstName ? 'input-error' : ''}
								required
							/>
							{errors.firstName && (
								<div className="error-message">{errors.firstName}</div>
							)}
						</div>
						<div className="form-group">
							<label htmlFor="client-lastName">Фамилия</label>
							<input
								id="client-lastName"
								name="lastName"
								type="text"
								value={formData.lastName}
								onChange={handleChange}
								placeholder="Фамилия"
								className={errors.lastName ? 'input-error' : ''}
								required
							/>
							{errors.lastName && (
								<div className="error-message">{errors.lastName}</div>
							)}
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="client-phone">Телефон</label>
						<input
							id="client-phone"
							name="phone"
							type="tel"
							value={formData.phone}
							onChange={handleChange}
							placeholder="Телефон"
							className={errors.phone ? 'input-error' : ''}
							required
						/>
						{errors.phone && (
							<div className="error-message">{errors.phone}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="client-passport">Паспорт</label>
						<input
							id="client-passport"
							name="passport"
							type="text"
							value={formData.passport}
							onChange={handleChange}
							placeholder="Номер паспорта"
							className={errors.passport ? 'input-error' : ''}
							required
						/>
						{errors.passport && (
							<div className="error-message">{errors.passport}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="client-address">Адрес</label>
						<input
							id="client-address"
							name="address"
							type="text"
							value={formData.address}
							onChange={handleChange}
							placeholder="Адрес"
							className={errors.address ? 'input-error' : ''}
							required
						/>
						{errors.address && (
							<div className="error-message">{errors.address}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="client-birthday">Дата рождения</label>
						<input
							id="client-birthday"
							name="birthday"
							type="date"
							value={formData.birthday}
							onChange={handleChange}
							className={errors.birthday ? 'input-error' : ''}
							required
						/>
						{errors.birthday && (
							<div className="error-message">{errors.birthday}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="client-email">Email</label>
						<input
							id="client-email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Email"
							className={errors.email ? 'input-error' : ''}
							required
						/>
						{errors.email && (
							<div className="error-message">{errors.email}</div>
						)}
					</div>

					<div className="form-row">
						<div className="form-group">
							<label htmlFor="client-password">Пароль</label>
							<input
								id="client-password"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Пароль"
								className={errors.password ? 'input-error' : ''}
								required
							/>
							{errors.password && (
								<div className="error-message">{errors.password}</div>
							)}
						</div>
						<div className="form-group">
							<label htmlFor="client-confirm-password">Подтверждение</label>
							<input
								id="client-confirm-password"
								name="confirmPassword"
								type="password"
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="Подтверждение"
								className={errors.confirmPassword ? 'input-error' : ''}
								required
							/>
							{errors.confirmPassword && (
								<div className="error-message">{errors.confirmPassword}</div>
							)}
						</div>
					</div>

					{errors.submit && (
						<div
							className="error-message"
							style={{ marginBottom: '1rem' }}
						>
							{errors.submit}
						</div>
					)}

					<button
						type="submit"
						className={`auth-button ${isLoading ? 'loading' : ''}`}
						disabled={isLoading}
					>
						{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
					</button>
				</form>

				<div className="auth-switch">
					Есть аккаунт?{' '}
					<Link
						to="/auth/client/login"
						className="auth-switch-link"
					>
						вход
					</Link>
				</div>
			</div>

			{isSuccessModalOpen && (
				<div
					className="modal-overlay"
					onClick={() => setIsSuccessModalOpen(false)}
				>
					<div
						className="modal-content"
						onClick={e => e.stopPropagation()}
					>
						<div className="modal-icon">✅</div>
						<h3>Успешно!</h3>
						<p>
							Пользователь {formData.firstName} {formData.lastName} успешно
							зарегистрирован
						</p>
						<button
							className="modal-button"
							onClick={() => setIsSuccessModalOpen(false)}
						>
							ОК
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
