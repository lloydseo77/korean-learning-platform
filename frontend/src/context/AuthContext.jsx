import { createContext, useReducer, useContext, useEffect } from 'react'

export const AuthContext = createContext()

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: true,
    error: null
}

const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return { user: action.payload.user, token: action.payload.token, loading: false, error: null }
        case 'LOGOUT':
            return { user: null, token: null, loading: false, error: null }
        case 'SET_LOADING':
            return { ...state, loading: true }
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    // login function
    const login = async (email, password) => {
        dispatch({ type: 'SET_LOADING' })
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()
            if (!response.ok) {
                dispatch({ type: 'SET_ERROR', payload: data.error })
                return
            }
            localStorage.setItem('token', data.token)
            dispatch({ type: 'LOGIN', payload: data })
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
        }
    }

    // register function
    const register = async (email, password, name) => {
        dispatch({ type: 'SET_LOADING' })
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            })
            const data = await response.json()
            if (!response.ok) {
                dispatch({ type: 'SET_ERROR', payload: data.error })
                return
            }
            localStorage.setItem('token', data.token)
            dispatch({ type: 'LOGIN', payload: data })
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
        }
    }

    // logout function
    const logout = () => {
        localStorage.removeItem('token')
        dispatch({ type: 'LOGOUT' })
    }

    // get current user function
    const getCurrentUser = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            return
        }
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (!response.ok) {
                dispatch({ type: 'SET_ERROR', payload: data.error })
                return
            }
            dispatch({ type: 'LOGIN', payload: { user: data.user, token } })
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
        }
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}