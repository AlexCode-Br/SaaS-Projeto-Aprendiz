import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// Páginas Públicas
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// Páginas do Gestor
import GestorDashboard from './pages/gestor/Dashboard.jsx';
import Cursos from './pages/gestor/Cursos.jsx';
import Alunos from './pages/gestor/Alunos.jsx';
import Professores from './pages/gestor/Professores.jsx';
import GestorRelatorios from './pages/gestor/Relatorios.jsx';
import GestorInformativos from './pages/gestor/Informativos.jsx';
import GestorSuporte from './pages/gestor/Suporte.jsx';

// Páginas do Professor
import ProfessorDashboard from './pages/professor/ProfessorDashboard.jsx';
import ProfessorAlunos from './pages/professor/ProfessorAlunos.jsx';
import ProfessorFrequencia from './pages/professor/ProfessorFrequencia.jsx';
import ProfessorRelatorios from './pages/professor/ProfessorRelatorios.jsx';
import ProfessorInformativos from './pages/professor/ProfessorInformativos.jsx';
import ProfessorSuporte from './pages/professor/ProfessorSuporte.jsx';

// Página de Configurações (Partilhada)
import Configuracoes from './pages/gestor/Configuracoes.jsx';

const NotFound = () => <div className="p-6 text-center"><h1>404 - Página Não Encontrada</h1></div>;

const DashboardRedirector = () => {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;
    
    const dashboardPath = user.role === 'gestor' ? '/gestor/dashboard' : '/professor/dashboard';
    return <Navigate to={dashboardPath} replace />;
};

const AppRoutes = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route 
            path="/*"
            element={
                <PrivateRoute>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<DashboardRedirector />} />
                            
                            {/* Rotas do Gestor */}
                            <Route path="/gestor/dashboard" element={<GestorDashboard />} />
                            <Route path="/gestor/cursos" element={<Cursos />} />
                            <Route path="/gestor/alunos" element={<Alunos />} />
                            <Route path="/gestor/professores" element={<Professores />} />
                            <Route path="/gestor/relatorios" element={<GestorRelatorios />} />
                            <Route path="/gestor/informativos" element={<GestorInformativos />} />
                            <Route path="/gestor/suporte" element={<GestorSuporte />} />
                            
                            {/* Rotas do Professor */}
                            <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
                            <Route path="/professor/alunos" element={<ProfessorAlunos />} />
                            <Route path="/professor/frequencia" element={<ProfessorFrequencia />} />
                            <Route path="/professor/relatorios" element={<ProfessorRelatorios />} />
                            <Route path="/professor/informativos" element={<ProfessorInformativos />} />
                            <Route path="/professor/suporte" element={<ProfessorSuporte />} />
                            
                            <Route path="/configuracoes" element={<Configuracoes />} />

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </MainLayout>
                </PrivateRoute>
            } 
        />
    </Routes>
);

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;