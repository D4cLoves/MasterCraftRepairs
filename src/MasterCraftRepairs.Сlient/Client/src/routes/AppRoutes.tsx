import { Route, Routes } from 'react-router-dom';
import {
	ClientLogin,
	ClientRegister,
	MasterLogin,
	MasterRegister,
	AdminLogin
} from '../components/auth';
import { HomePage } from '../components/HomePage';
import { ClientCabinet, MasterCabinet } from '../components/cabinet';
import { ClientProfile } from '../components/profile/ClientProfile';
import { MasterProfile } from '../components/profile/MasterProfile';
import { AdminPanel } from '../components/admin';

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
				path="/auth/admin/login"
				element={<AdminLogin />}
			/>
			<Route
				path="/cabinet/client"
				element={<ClientCabinet />}
			/>
			<Route
				path="/cabinet/master"
				element={<MasterCabinet />}
			/>
			<Route
				path="/profile/client"
				element={<ClientProfile />}
			/>
			<Route
				path="/profile/master"
				element={<MasterProfile />}
			/>
			<Route
				path="/admin"
				element={<AdminPanel />}
			/>
		</Routes>
	);
};
