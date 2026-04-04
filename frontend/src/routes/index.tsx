import { BrowserRoute, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './protectedRoute'
import { loginPage } from '../pages/login'

export function AppRoutes() {
    return (
        <BrowserRoute>
            <Routes>
                {/* Rotas públicas */
                <Route path = '/login' element={<loginPage />} />
                {/* Rotas protegidas */}
                <Route element = {<ProtectedRoute />}>
                    <Route path = '/dashboard' element={<HomePage />} />
                </Route>

                {/* Rota para redirecionar para o login caso a rota não exista */}
                route path = '*' element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRoute>
    )
}