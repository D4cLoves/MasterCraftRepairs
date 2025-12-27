import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import type { MasterRegisterData } from '../../types/auth';
import {
	validateName,
	validatePhone,
	validatePassport,
	validateEmail,
	validatePassword,
	validateBirthday
} from '../../utils/validation';

interface MasterRegisterProps {
	onRegister?: (data: MasterRegisterData) => void;
}

export const MasterRegister = ({ onRegister }: MasterRegisterProps) => {
	const [formData, setFormData] = useState<MasterRegisterData>({
		firstName: '',
		lastName: '',
		phone: '',
		passport: '',
		birthday: '',
		email: '',
		password: ''
	});

	const [errors, setErrors] = useState<Partial<Record<keyof MasterRegisterData, string>>>({});

	const handleChange = (field: keyof MasterRegisterData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	const validateField = (field: keyof MasterRegisterData, value: string): string | undefined => {
		switch (field) {
			case 'firstName':
			case 'lastName':
				return validateName(value).error;
			case 'phone':
				return validatePhone(value).error;
			case 'passport':
				return validatePassport(value).error;
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

	const handleBlur = (field: keyof MasterRegisterData) => {
		const error = validateField(field, formData[field]);
		setErrors(prev => ({ ...prev, [field]: error }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors: Partial<Record<keyof MasterRegisterData, string>> = {};
		let isValid = true;

		(Object.keys(formData) as Array<keyof MasterRegisterData>).forEach(field => {
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
				<h2 className="auth-title">Регистрация мастера</h2>
				<form
					onSubmit={handleSubmit}
					className="auth-form"
				>
					<div className="form-row">
						<div className="form-group">
							<label htmlFor="master-first-name">Имя</label>
							<input
								id="master-first-name"
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
							<label htmlFor="master-last-name">Фамилия</label>
							<input
								id="master-last-name"
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
						<label htmlFor="master-phone">Номер телефона</label>
						<input
							id="master-phone"
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
						<label htmlFor="master-passport">Номер паспорта</label>
						<input
							id="master-passport"
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
						<label htmlFor="master-birthday">Дата рождения</label>
						<input
							id="master-birthday"
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
						<label htmlFor="master-email">Email</label>
						<input
							id="master-email"
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
						<label htmlFor="master-password">Пароль</label>
						<input
							id="master-password"
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

					<button
						type="submit"
						className="auth-button"
					>
						Зарегистрироваться
					</button>

					<div className="auth-footer">
						<span>Уже есть аккаунт? </span>
						<Link to="/auth/master/login" className="auth-link">
							Войти
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
