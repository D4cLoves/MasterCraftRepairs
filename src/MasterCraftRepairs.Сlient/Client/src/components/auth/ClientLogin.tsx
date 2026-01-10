import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

interface ClientLoginProps {
	onLogin?: (email: string, password: string) => void;
}

export const ClientLogin = ({ onLogin }: ClientLoginProps) => {
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

		if (Object.keys(newErrors).length === 0 && onLogin) {
			setIsLoading(true);
			try {
				await onLogin(formData.email, formData.password);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h2 className="auth-title">Вход клиента</h2>
				<p className="auth-subtitle">Войдите в свой аккаунт</p>
				<form
					onSubmit={handleSubmit}
					className="auth-form"
				>
					<div className="form-group">
						<label htmlFor="client-email">Email</label>
						<input
							id="client-email"
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
						<label htmlFor="client-password">Пароль</label>
						<input
							id="client-password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Введите пароль"
							className={errors.password ? 'input-error' : ''}
							required
						/>
						{errors.password && (
							<div className="error-message">{errors.password}</div>
						)}
					</div>

					<button
						type="submit"
						className={`auth-button ${isLoading ? 'loading' : ''}`}
						disabled={isLoading}
					>
						{isLoading ? 'Вход...' : 'Войти'}
					</button>
				</form>

				<div className="auth-switch">
					Нет аккаунта?{' '}
					<Link
						to="/auth/client/register"
						className="auth-switch-link"
					>
						регистрация
					</Link>
				</div>
			</div>
		</div>
	);
};
