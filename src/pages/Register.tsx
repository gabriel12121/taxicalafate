
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';
import GoogleLoginButton from '@/components/GoogleLoginButton';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useBankContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const success = register(name, email, password);
      if (success) {
        navigate('/login');
      }
      setIsLoading(false);
    }, 800); // Simula uma chamada de API
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-bank-purple mb-6"
        >
          <span>Voltar</span>
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-bank-purple">Crie sua conta</h1>
          <p className="text-gray-500 mt-2">Preencha seus dados para começar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-bank-purple text-white py-4 rounded-xl font-medium hover:bg-bank-purple-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cadastrando...' : 'Criar conta'}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">Ou continue com</span>
            </div>
          </div>
          
          <GoogleLoginButton />
          
          <div className="text-center mt-4">
            <p className="text-gray-500">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-bank-purple font-medium"
              >
                Entrar
              </button>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
