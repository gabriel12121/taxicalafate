
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Minus, RefreshCw, Users } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser, users, addFunds, subtractFunds } = useBankContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtragem de usuários (excluindo admin)
  const filteredUsers = users.filter(user => 
    !user.isAdmin &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Proteger a rota (apenas para admin)
  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      toast.error('Acesso restrito a administradores');
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.error('Selecione um usuário');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Digite um valor válido');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      let success = false;
      
      if (operation === 'add') {
        success = addFunds(selectedUser, amountValue);
      } else {
        success = subtractFunds(selectedUser, amountValue);
      }
      
      if (success) {
        setAmount('');
        // Mantém o usuário selecionado para facilitar operações consecutivas
      }
      
      setIsLoading(false);
    }, 800);
  };

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  return (
    <Layout title="Administração">
      <div className="animate-fade-in">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-bank-purple mb-6"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Voltar</span>
        </button>
        
        <div className="bg-bank-purple p-4 rounded-xl text-white mb-6 flex items-center">
          <Users className="mr-3" size={24} />
          <div>
            <h3 className="font-medium">Total de usuários</h3>
            <p className="text-xl font-bold">{users.filter(u => !u.isAdmin).length}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selecionar usuário */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Selecione um usuário
            </label>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome ou email"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (selectedUser && !e.target.value) {
                    setSelectedUser(null);
                  }
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50"
              />
            </div>
            
            {/* Lista de usuários */}
            {searchTerm && !selectedUser && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(user.id);
                        setSearchTerm(user.name);
                      }}
                      className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <p className="text-sm font-medium">
                          R$ {formatCurrency(user.balance)}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </div>
                )}
              </div>
            )}
            
            {/* Usuário selecionado */}
            {selectedUser && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{users.find(u => u.id === selectedUser)?.name}</p>
                    <p className="text-xs text-gray-500">{users.find(u => u.id === selectedUser)?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Saldo atual</p>
                    <p className="font-medium">
                      R$ {formatCurrency(users.find(u => u.id === selectedUser)?.balance || 0)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setSearchTerm('');
                  }}
                  className="text-sm text-bank-purple mt-2"
                >
                  Alterar usuário
                </button>
              </div>
            )}
          </div>
          
          {selectedUser && (
            <>
              {/* Tipo de operação */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Operação
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setOperation('add')}
                    className={`flex-1 py-3 rounded-md text-center transition-colors flex items-center justify-center ${
                      operation === 'add' ? 'bg-white shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Plus size={18} className="mr-2" />
                    <span>Adicionar fundos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperation('subtract')}
                    className={`flex-1 py-3 rounded-md text-center transition-colors flex items-center justify-center ${
                      operation === 'subtract' ? 'bg-white shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Minus size={18} className="mr-2" />
                    <span>Remover fundos</span>
                  </button>
                </div>
              </div>
              
              {/* Valor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Valor
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    R$
                  </div>
                  <input
                    type="number"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0.01"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50 text-lg"
                  />
                </div>
              </div>
              
              {/* Botão de envio */}
              <button
                type="submit"
                disabled={isLoading || !amount}
                className={`w-full text-white py-4 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center ${
                  operation === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {operation === 'add' ? (
                      <>
                        <Plus size={18} className="mr-2" />
                        Adicionar R$ {amount ? parseFloat(amount).toFixed(2) : '0,00'}
                      </>
                    ) : (
                      <>
                        <Minus size={18} className="mr-2" />
                        Remover R$ {amount ? parseFloat(amount).toFixed(2) : '0,00'}
                      </>
                    )}
                  </>
                )}
              </button>
            </>
          )}
        </form>
        
        {/* Lista de usuários */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Todos os usuários</h3>
          
          <div className="space-y-3">
            {users.filter(u => !u.isAdmin).map((user) => (
              <div 
                key={user.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Saldo</p>
                    <p className="font-medium">
                      R$ {formatCurrency(user.balance)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(user.id);
                    setSearchTerm(user.name);
                  }}
                  className="text-sm text-bank-purple mt-2"
                >
                  Selecionar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
