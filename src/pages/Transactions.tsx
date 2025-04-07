
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';
import { formatCurrency } from '@/lib/utils';

const Transactions = () => {
  const navigate = useNavigate();
  const { currentUser, users } = useBankContext();

  // Obter todas as transações ordenadas por data
  const sortedTransactions = currentUser?.transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

  // Proteger a rota
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  // Formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obter o nome do usuário para exibição na transação
  const getUserName = (userId: string, isFrom: boolean) => {
    if (userId === 'admin') return 'Sistema';
    if (userId === currentUser.id) return isFrom ? 'Tú' : 'Su cuenta';
    
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuario';
  };

  return (
    <Layout title="Historial de transacciones">
      <div className="animate-fade-in">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-bank-purple mb-6"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Regresa</span>
        </button>
        
        {sortedTransactions.length > 0 ? (
          <div className="space-y-3">
            {sortedTransactions.map((transaction) => {
              const isDebit = transaction.fromUserId === currentUser.id;
              const otherPartyId = isDebit ? transaction.toUserId : transaction.fromUserId;
              const otherPartyName = getUserName(otherPartyId, !isDebit);
              
              return (
                <div 
                  key={transaction.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-slide-in"
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
                        <p className="font-medium">{transaction.description || `${isDebit ? 'Envío a' : 'Recibido de'} ${otherPartyName}`}</p>
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
            <p className="text-gray-500">No se han encontrado transacciones</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
