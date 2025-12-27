// const API_URL = 'https://localhost:5073/';

export const Api = {
	test: async () => {
		const response = await fetch('http://localhost:5073/api/Test/test');
		if (!response.ok) {
			throw new Error(`Бэкенд упал: ${response.status} ${response.statusText}`);
		}
		return response.json();
	}
};
