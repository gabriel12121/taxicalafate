
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useBankContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
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
          <ArrowLeft size={20} className="mr-1" />
          <span>Voltar</span>
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-bank-purple">Bem-vindo novamente</h1>
          <p className="text-gray-500 mt-2">Acesse sua conta para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <div className="space-y-4">
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
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-bank-purple text-white py-4 rounded-xl font-medium hover:bg-bank-purple-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-gray-500">
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-bank-purple font-medium"
              >
                Criar conta
              </button>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
