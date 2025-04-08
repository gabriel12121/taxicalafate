
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, RefreshCw, ArrowUp, ArrowDown, 
  ArrowRightLeft, QrCode 
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';
import { formatCurrency } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, showBalance, setShowBalance, users } = useBankContext();
  const [isLoading, setIsLoading] = useState(false);

  // Carregar últimas 3 transações
  const recentTransactions = currentUser?.transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3) || [];

  // Proteger a rota
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Simular atualização de dados
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (!currentUser) {
    return null; // Redirecionamento acontecerá pelo useEffect
  }

  // Formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obter o nome do usuário para exibição na transação
  const getUserName = (userId: string, isFrom: boolean) => {
    if (userId === 'admin') return 'Sistema';
    if (userId === currentUser.id) return isFrom ? 'Você' : 'Sua conta';
    
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário';
  };

  return (
    <Layout>
      <div className="animate-fade-in pb-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">Hola,</p>
            <h2 className="text-2xl font-bold">{currentUser.name}</h2>
          </div>
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-full transition-colors"
          >
            <RefreshCw size={20} className={`text-bank-purple ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {/* Card de saldo */}
        <div className="bg-bank-green card-balance p-6 mb-6" >
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-white font-medium">Saldo disponível</h3>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/80"
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex items-baseline">
            <span className="text-white/80 mr-1">R$</span>
            <h1 className="text-3xl font-bold text-white">
              {showBalance ? formatCurrency(currentUser.balance) : '••••••'}
            </h1>
          </div>
        </div>
        
        {/* Ações rápidas */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="flex flex-col items-center">
            <button 
              onClick={() => navigate('/transfer')}
              className="btn-action mb-2 bg-[#8bb09b]"
            >
              <ArrowRightLeft size={22} />
            </button>
            <span className="text-xs text-gray-600">Transferencia</span>
          </div>
          
          <div className="flex flex-col items-center">
             <button 
               onClick={() => navigate('/qr-pay')}
               className="btn-action mb-2 bg-[#8bb09b]"
             >
               <QrCode size={22} />
             </button>
             <span className="text-xs text-gray-600">QR Code</span>
           </div>
          
          <div className="flex flex-col items-center">
            <button 
              onClick={() => navigate('/transactions')}
              className="btn-action mb-2 bg-[#8bb09b]"
            >
              <ArrowUp size={22} />
            </button>
            <span className="text-xs text-gray-600">Histórico</span>
          </div>
        </div>
        
        {/* Últimas transações */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Últimas transacciones</h3>
            <button 
              onClick={() => navigate('/transactions')}
              className="text-sm text-[#8bb09b]"
            >
              Ver todas
            </button>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const isDebit = transaction.fromUserId === currentUser.id;
                const otherPartyId = isDebit ? transaction.toUserId : transaction.fromUserId;
                const otherPartyName = getUserName(otherPartyId, !isDebit);
                
                return (
                  <div 
                    key={transaction.id}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${isDebit ? 'bg-red-50' : 'bg-green-50'} mr-3`}>
                          {isDebit ? 
                            <ArrowUp size={18} className="text-red-500" /> : 
                            <ArrowDown size={18} className="text-green-500" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description || `${isDebit ? 'Envio para' : 'Recebido de'} ${otherPartyName}`}</p>
                          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <p className={`font-semibold ${isDebit ? 'text-red-500' : 'text-green-500'}`}>
                        {isDebit ? '-' : '+'} R$ {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center shadow-sm">
              <p className="text-gray-500">No hay transacciones recientes</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
