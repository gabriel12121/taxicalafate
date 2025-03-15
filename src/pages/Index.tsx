
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Users, Lock, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useBankContext();
  
  React.useEffect(() => {
    // Se o usuário já estiver logado, redireciona para o dashboard
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-bank-purple mb-2">FinBank</h1>
          <p className="text-gray-500">Seu banco digital moderno e seguro</p>
        </div>
        
        <div className="w-full max-w-md space-y-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-start mb-4">
              <div className="bg-bank-light-blue p-3 rounded-full mr-4">
                <Wallet className="text-bank-blue" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Gestão financeira simplificada</h3>
                <p className="text-gray-500 text-sm">Acompanhe seu saldo e histórico de transações</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start mb-4">
              <div className="bg-bank-light-blue p-3 rounded-full mr-4">
                <Users className="text-bank-blue" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Transferências entre usuários</h3>
                <p className="text-gray-500 text-sm">Envie dinheiro de forma rápida e segura</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start mb-4">
              <div className="bg-bank-light-blue p-3 rounded-full mr-4">
                <Lock className="text-bank-blue" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Segurança em primeiro lugar</h3>
                <p className="text-gray-500 text-sm">Sua informação financeira protegida</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-bank-purple text-white py-4 rounded-xl font-medium flex justify-center items-center hover:bg-bank-purple-light transition-colors"
          >
            Entrar
            <ArrowRight className="ml-2" size={18} />
          </button>
          
          <button 
            onClick={() => navigate('/register')}
            className="w-full bg-white text-bank-purple py-4 rounded-xl font-medium border border-bank-purple hover:bg-bank-gray transition-colors"
          >
            Criar conta
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
