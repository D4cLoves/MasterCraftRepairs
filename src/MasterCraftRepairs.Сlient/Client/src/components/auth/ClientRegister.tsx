import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import type { ClientRegisterData } from '../../types/auth';
import {
	validateName,
	validatePhone,
	validatePassport,
	validateAddress,
	validateEmail,
	validatePassword,
	validateBirthday
} from '../../utils/validation';

interface ClientRegisterProps {
	onRegister?: (data: ClientRegisterData) => void;
}

export const ClientRegister = ({ onRegister }: ClientRegisterProps) => {
	const [formData, setFormData] = useState<ClientRegisterData>({
		firstName: '',
		lastName: '',
		phone: '',
		passport: '',
		address: '',
		birthday: '',
		email: '',
		password: ''
	});

	const [errors, setErrors] = useState<Partial<Record<keyof ClientRegisterData, string>>>({});

	const handleChange = (field: keyof ClientRegisterData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	const validateField = (field: keyof ClientRegisterData, value: string): string | undefined => {
		switch (field) {
			case 'firstName':
			case 'lastName':
				return validateName(value).error;
			case 'phone':
				return validatePhone(value).error;
			case 'passport':
				return validatePassport(value).error;
			case 'address':
				return validateAddress(value).error;
			case 'email':
				return validateEmail(value).error;
			case 'password':
				return validatePassword(value).error;
			case 'birthday':
				return validateBirthday(value).error;
			default:
				return undefined;
		}
	};

	const handleBlur = (field: keyof ClientRegisterData) => {
		const error = validateField(field, formData[field]);
		setErrors(prev => ({ ...prev, [field]: error }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors: Partial<Record<keyof ClientRegisterData, string>> = {};
		let isValid = true;

		(Object.keys(formData) as Array<keyof ClientRegisterData>).forEach(field => {
			const error = validateField(field, formData[field]);
			if (error) {
				newErrors[field] = error;
				isValid = false;
			}
		});

		setErrors(newErrors);

		if (isValid && onRegister) {
			onRegister(formData);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h2 className="auth-title">Регистрация клиента</h2>
				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-row">
						<div className="form-group">
							<label htmlFor="client-first-name">Имя</label>
							<input
								id="client-first-name"
								type="text"
								value={formData.firstName}
								onChange={e => handleChange('firstName', e.target.value)}
								onBlur={() => handleBlur('firstName')}
								placeholder="Введите имя"
								className={errors.firstName ? 'input-error' : ''}
								required
							/>
							{errors.firstName && <span className="error-message">{errors.firstName}</span>}
						</div>

						<div className="form-group">
							<label htmlFor="client-last-name">Фамилия</label>
							<input
								id="client-last-name"
								type="text"
								value={formData.lastName}
								onChange={e => handleChange('lastName', e.target.value)}
								onBlur={() => handleBlur('lastName')}
								placeholder="Введите фамилию"
								className={errors.lastName ? 'input-error' : ''}
								required
							/>
							{errors.lastName && <span className="error-message">{errors.lastName}</span>}
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="client-phone">Номер телефона</label>
						<input
							id="client-phone"
							type="tel"
							value={formData.phone}
							onChange={e => handleChange('phone', e.target.value)}
							onBlur={() => handleBlur('phone')}
							placeholder="+7 или 8XXXXXXXXXX"
							className={errors.phone ? 'input-error' : ''}
							required
						/>
						{errors.phone && <span className="error-message">{errors.phone}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="client-passport">Номер паспорта</label>
						<input
							id="client-passport"
							type="text"
							value={formData.passport}
							onChange={e => handleChange('passport', e.target.value)}
							onBlur={() => handleBlur('passport')}
							placeholder="10 цифр"
							maxLength={10}
							className={errors.passport ? 'input-error' : ''}
							required
						/>
						{errors.passport && <span className="error-message">{errors.passport}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="client-address">Адрес</label>
						<input
							id="client-address"
							type="text"
							value={formData.address}
							onChange={e => handleChange('address', e.target.value)}
							onBlur={() => handleBlur('address')}
							placeholder="Введите адрес"
							className={errors.address ? 'input-error' : ''}
							required
						/>
						{errors.address && <span className="error-message">{errors.address}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="client-birthday">Дата рождения</label>
						<input
							id="client-birthday"
							type="date"
							value={formData.birthday}
							onChange={e => handleChange('birthday', e.target.value)}
							onBlur={() => handleBlur('birthday')}
							className={errors.birthday ? 'input-error' : ''}
							required
						/>
						{errors.birthday && <span className="error-message">{errors.birthday}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="client-email">Email</label>
						<input
							id="client-email"
							type="email"
							value={formData.email}
							onChange={e => handleChange('email', e.target.value)}
							onBlur={() => handleBlur('email')}
							placeholder="Введите email"
							className={errors.email ? 'input-error' : ''}
							required
						/>
						{errors.email && <span className="error-message">{errors.email}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="client-password">Пароль</label>
						<input
							id="client-password"
							type="password"
							value={formData.password}
							onChange={e => handleChange('password', e.target.value)}
							onBlur={() => handleBlur('password')}
							placeholder="Минимум 6 символов"
							className={errors.password ? 'input-error' : ''}
							required
						/>
						{errors.password && <span className="error-message">{errors.password}</span>}
					</div>

					<button type="submit" className="auth-button">
						Зарегистрироваться
					</button>

					<div className="auth-footer">
						<span>Уже есть аккаунт? </span>
						<Link to="/auth/client/login" className="auth-link">
							Войти
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
