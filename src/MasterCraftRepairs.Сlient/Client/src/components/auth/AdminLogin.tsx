import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Api } from '../../lib/api';
import type { LoginData } from '../../types/auth';
import './Auth.css';

export const AdminLogin = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors: Record<string, string> = {};

		if (!formData.email.trim()) {
			newErrors.email = 'Email обязателен для заполнения';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Введите корректный email';
		}

		if (!formData.password) {
			newErrors.password = 'Пароль обязателен для заполнения';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			try {
				const loginData: LoginData = {
					email: formData.email,
					password: formData.password
				};
				const result = await Api.LoginAdmin(loginData);

				if (result.token) {
					navigate('/admin');
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Ошибка входа';
				setErrors({ submit: errorMessage });
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h2 className="auth-title">Вход администратора</h2>
				<p className="auth-subtitle">Войдите в админ-панель</p>
				<form
					onSubmit={handleSubmit}
					className="auth-form"
				>
					<div className="form-group">
						<label htmlFor="admin-email">Email</label>
						<input
							id="admin-email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Введите email"
							className={errors.email ? 'input-error' : ''}
							disabled={isLoading}
						/>
						{errors.email && (
							<span className="error-message">{errors.email}</span>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="admin-password">Пароль</label>
						<input
							id="admin-password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Введите пароль"
							className={errors.password ? 'input-error' : ''}
							disabled={isLoading}
						/>
						{errors.password && (
							<span className="error-message">{errors.password}</span>
						)}
					</div>

					{errors.submit && (
						<div className="error-message submit-error">
							{errors.submit}
						</div>
					)}

					<button
						type="submit"
						className="auth-submit-btn"
						disabled={isLoading}
					>
						{isLoading ? 'Вход...' : 'Войти'}
					</button>
				</form>

				<div className="auth-footer">
					<Link to="/" className="auth-link">
						Вернуться на главную
					</Link>
				</div>
			</div>
		</div>
	);
};
