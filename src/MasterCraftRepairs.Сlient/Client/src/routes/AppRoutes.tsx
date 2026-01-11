import { Route, Routes } from 'react-router-dom';
import {
	ClientLogin,
	ClientRegister,
	MasterLogin,
	MasterRegister
} from '../components/auth';
import { HomePage } from '../components/HomePage';
import { ClientCabinet } from '../components/cabinet';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={<HomePage />}
			/>
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
				path="/cabinet/client"
				element={<ClientCabinet />}
			/>
		</Routes>
	);
};
