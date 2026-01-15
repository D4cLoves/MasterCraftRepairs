export interface LoginData {
	email: string
	password: string
}

export interface ClientRegisterData {
	firstName: string
	lastName: string
	phone: string
	passport: string
	address: string
	birthday: string
	email: string
	password: string
	confirmPassword: string
}

export interface MasterRegisterData {
	firstName: string
	lastName: string
	phone: string
	passport: string
	birthday: string
	email: string
	password: string
	confirmPassword: string
}

export interface OrderData {
	categoryId: string
	serialNumber: string
	releaseYear: string
	brand: string
	model: string
	price: string;
	description: string;
}