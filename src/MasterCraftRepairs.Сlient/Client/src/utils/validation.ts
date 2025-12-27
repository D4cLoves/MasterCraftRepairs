export interface ValidationResult {
	isValid: boolean;
	error?: string;
}

export const validateName = (value: string): ValidationResult => {
	if (!value || value.trim().length === 0) {
		return {
			isValid: false,
			error: 'Имя не может быть пустым'
		};
	}

	const trimmed = value.trim();
	if (trimmed.length === 0) {
		return {
			isValid: false,
			error: 'Имя не может состоять только из пробелов'
		};
	}

	return { isValid: true };
};

export const validatePhone = (value: string): ValidationResult => {
	if (!value || value.trim().length === 0) {
		return {
			isValid: false,
			error: 'Номер телефона не может быть пустым'
		};
	}

	const cleaned = value.replace(/\s|-|\(|\)/g, '');

	if (!cleaned.startsWith('+7') && !cleaned.startsWith('8')) {
		return {
			isValid: false,
			error: 'Номер телефона должен начинаться с +7 или 8'
		};
	}

	if (cleaned.length < 11) {
		return {
			isValid: false,
			error: 'Номер телефона слишком короткий'
		};
	}

	if (cleaned.length > 12) {
		return {
			isValid: false,
			error: 'Номер телефона слишком длинный'
		};
	}

	return { isValid: true };
};

export const validatePassport = (value: string): ValidationResult => {
	if (!value || value.trim().length === 0) {
		return {
			isValid: false,
			error: 'Номер паспорта не может быть пустым'
		};
	}

	const cleaned = value.trim().replace(/\s/g, '');

	if (cleaned.length !== 10) {
		return {
			isValid: false,
			error: 'Номер паспорта должен содержать 10 символов'
		};
	}

	if (!/^\d+$/.test(cleaned)) {
		return {
			isValid: false,
			error: 'Номер паспорта должен содержать только цифры'
		};
	}

	return { isValid: true };
};

export const validateAddress = (value: string): ValidationResult => {
	if (!value || value.trim().length === 0) {
		return {
			isValid: false,
			error: 'Адрес не может быть пустым'
		};
	}

	const trimmed = value.trim();
	if (trimmed.length === 0) {
		return {
			isValid: false,
			error: 'Адрес не может состоять только из пробелов'
		};
	}

	return { isValid: true };
};

export const validateEmail = (value: string): ValidationResult => {
	if (!value || value.trim().length === 0) {
		return {
			isValid: false,
			error: 'Email не может быть пустым'
		};
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(value)) {
		return {
			isValid: false,
			error: 'Некорректный формат email'
		};
	}

	return { isValid: true };
};

export const validatePassword = (value: string): ValidationResult => {
	if (!value || value.length === 0) {
		return {
			isValid: false,
			error: 'Пароль не может быть пустым'
		};
	}

	if (value.length < 6) {
		return {
			isValid: false,
			error: 'Пароль должен содержать минимум 6 символов'
		};
	}

	return { isValid: true };
};

export const validateBirthday = (value: string): ValidationResult => {
	if (!value) {
		return {
			isValid: false,
			error: 'Дата рождения обязательна'
		};
	}

	const date = new Date(value);
	const today = new Date();
	if (date > today) {
		return {
			isValid: false,
			error: 'Дата рождения не может быть в будущем'
		};
	}

	return { isValid: true };
};

