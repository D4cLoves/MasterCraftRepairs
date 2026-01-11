import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react'
import { Api } from '../lib/api'

interface AuthContextType {
	isAuthenticated: boolean
	checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	const checkAuth = useCallback(async () => {
		try {
			await Api.GetClientProfile()
			setIsAuthenticated(true)
		} catch (error) {
			setIsAuthenticated(false)
		}
	}, [])

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	return (
		<AuthContext.Provider value={{ isAuthenticated, checkAuth }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
