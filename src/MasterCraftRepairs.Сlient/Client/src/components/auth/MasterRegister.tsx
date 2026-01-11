import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Api } from '../../lib/api'
import type { MasterRegisterData, LoginData } from '../../types/auth'
import './Auth.css'

const registerMaster = async (userData: MasterRegisterData) => {
	try {
		const result = await Api.AuthorizationMaster(userData)
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
		birthday: z.string().min(1, 'Дата рождения обязательна для заполнения'),
		email: z.string().email('Введите корректный email'),
		password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
		confirmPassword: z.string().min(1, 'Подтверждение пароля обязательно')
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	})

export const MasterRegister = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		passport: '',
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
			const registerData: MasterRegisterData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				phone: formData.phone,
				passport: formData.passport,
				birthday: formData.birthday,
				email: formData.email,
				password: formData.password
			}
			const result = await registerMaster(registerData)
			setRegistrationResult(result)
			setIsSuccessModalOpen(true)

			// Автоматически логиним пользователя после регистрации
			try {
				const loginData: LoginData = {
					email: formData.email,
					password: formData.password
				}
				const loginResult = await Api.LoginMaster(loginData)

				if (loginResult.token) {
					// Закрываем модалку и редиректим через небольшую задержку
					setTimeout(() => {
						setIsSuccessModalOpen(false)
						navigate('/cabinet/master')
					}, 1500)
				}
			} catch (loginError) {
				// Если автологин не удался, просто закрываем модалку
				// Пользователь сможет залогиниться вручную
				console.error('Auto-login failed:', loginError)
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
				<h2 className="auth-title">Регистрация мастера</h2>
				<p className="auth-subtitle">Создайте аккаунт для работы с заказами</p>
				<form
					onSubmit={handleSubmit}
					className="auth-form"
				>
					<div className="form-group">
						<label htmlFor="master-firstName">Имя</label>
						<input
							id="master-firstName"
							name="firstName"
							type="text"
							value={formData.firstName}
							onChange={handleChange}
							placeholder="Введите имя"
							className={errors.firstName ? 'input-error' : ''}
							required
						/>
						{errors.firstName && (
							<div className="error-message">{errors.firstName}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="master-lastName">Фамилия</label>
						<input
							id="master-lastName"
							name="lastName"
							type="text"
							value={formData.lastName}
							onChange={handleChange}
							placeholder="Введите фамилию"
							className={errors.lastName ? 'input-error' : ''}
							required
						/>
						{errors.lastName && (
							<div className="error-message">{errors.lastName}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="master-phone">Телефон</label>
						<input
							id="master-phone"
							name="phone"
							type="tel"
							value={formData.phone}
							onChange={handleChange}
							placeholder="Введите телефон"
							className={errors.phone ? 'input-error' : ''}
							required
						/>
						{errors.phone && (
							<div className="error-message">{errors.phone}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="master-passport">Паспорт</label>
						<input
							id="master-passport"
							name="passport"
							type="text"
							value={formData.passport}
							onChange={handleChange}
							placeholder="Введите номер паспорта"
							className={errors.passport ? 'input-error' : ''}
							required
						/>
						{errors.passport && (
							<div className="error-message">{errors.passport}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="master-birthday">Дата рождения</label>
						<input
							id="master-birthday"
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
						<label htmlFor="master-email">Email</label>
						<input
							id="master-email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Введите email"
							className={errors.email ? 'input-error' : ''}
							required
						/>
						{errors.email && (
							<div className="error-message">{errors.email}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="master-password">Пароль</label>
						<input
							id="master-password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Создайте пароль (мин. 6 символов)"
							className={errors.password ? 'input-error' : ''}
							required
						/>
						{errors.password && (
							<div className="error-message">{errors.password}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="master-confirmPassword">Подтвердите пароль</label>
						<input
							id="master-confirmPassword"
							name="confirmPassword"
							type="password"
							value={formData.confirmPassword}
							onChange={handleChange}
							placeholder="Повторите пароль"
							className={errors.confirmPassword ? 'input-error' : ''}
							required
						/>
						{errors.confirmPassword && (
							<div className="error-message">{errors.confirmPassword}</div>
						)}
					</div>

					{errors.submit && (
						<div className="error-message" style={{ marginBottom: '1rem' }}>
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
						to="/auth/master/login"
						className="auth-switch-link"
					>
						вход
					</Link>
				</div>
			</div>

			{isSuccessModalOpen && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h3>Регистрация успешна!</h3>
						<p>{registrationResult?.message || 'Мастер успешно зарегистрирован'}</p>
					</div>
				</div>
			)}
		</div>
	)
}
