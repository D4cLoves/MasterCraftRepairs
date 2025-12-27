import { Routes, Route } from 'react-router-dom';
import {
	ClientLogin,
	ClientRegister,
	MasterLogin,
	MasterRegister
} from '../components/auth';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route
				path="/auth/master/login"
				element={<MasterLogin />}
			/>
			<Route
				path="/auth/master/register"
				element={<MasterRegister />}
			/>
			<Route
				path="/auth/client/login"
				element={<ClientLogin />}
			/>
			<Route
				path="/auth/client/register"
				element={<ClientRegister />}
			/>
			<Route
				path="/"
				element={<MasterLogin />}
			/>
		</Routes>
	);
};

