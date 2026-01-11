import './App.css';
import { Navigation } from './components/Navigation';
import { AppRoutes } from './routes/AppRoutes';

function App() {
	return (
		<div className="app-container">
			<Navigation />
			<div className="content">
				<AppRoutes />
			</div>
		</div>
	);
}

export default App;
