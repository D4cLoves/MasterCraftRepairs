import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

interface MasterRegisterProps {
	onRegister?: (email: string, password: string, name: string) => void;
}

export const MasterRegister = ({ onRegister }: MasterRegisterProps) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Имя обязательно для заполнения';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email обязателен для заполнения';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Введите корректный email';
		}

		if (!formData.password) {
			newErrors.password = 'Пароль обязателен для заполнения';
		} else if (formData.password.length < 6) {
			newErrors.password = 'Пароль должен содержать минимум 6 символов';
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Пароли не совпадают';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0 && onRegister) {
			setIsLoading(true);
			try {
				await onRegister(formData.email, formData.password, formData.name);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h2 className="auth-title">Регистрация мастера</h2>
				<p className="auth-subtitle">Создайте аккаунт для работы с заказами</p>
				<form
					onSubmit={handleSubmit}
					className="auth-form"
				>
					<div className="form-group">
						<label htmlFor="master-name">Имя</label>
						<input
							id="master-name"
							name="name"
							type="text"
							value={formData.name}
							onChange={handleChange}
							placeholder="Введите ваше имя"
							className={errors.name ? 'input-error' : ''}
							required
						/>
						{errors.name && <div className="error-message">{errors.name}</div>}
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
							placeholder="Создайте пароль"
							className={errors.password ? 'input-error' : ''}
							required
						/>
						{errors.password && (
							<div className="error-message">{errors.password}</div>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="master-confirm-password">Подтвердите пароль</label>
						<input
							id="master-confirm-password"
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
		</div>
	);
};
