
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Send } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';
import { toast } from 'sonner';

const Transfer = () => {
  const navigate = useNavigate();
  const { currentUser, users, transferFunds } = useBankContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Lista de usuários filtrada (excluindo o usuário atual e admin)
  const filteredUsers = users.filter(user => 
    user.id !== currentUser?.id && 
    !user.isAdmin &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Proteger a rota
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.error('Seleccionar un destinatario');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Introduzca un valor válido');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const success = transferFunds(
        currentUser!.id, 
        selectedUser, 
        amountValue,
        description || 'Transferencia'
      );
      
      if (success) {
        navigate('/dashboard');
      }
      
      setIsLoading(false);
    }, 800);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Layout title="Transferência">
      <div className="animate-fade-in">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-[#adcbba] mb-6"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Regresa</span>
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selecionar usuário */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
             A quién quieres transferirte?
            </label>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o correo electrónico"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedUser(null);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50"
              />
            </div>
            
            {/* Lista de usuários */}
            {searchTerm && (
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
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No se ha encontrado ningún usuario
                  </div>
                )}
              </div>
            )}
            
            {/* Usuário selecionado */}
            {selectedUser && (
              <div className="bg-bank-light-blue p-4 rounded-xl">
                <p className="font-medium">
                  Destinatario: {users.find(u => u.id === selectedUser)?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {users.find(u => u.id === selectedUser)?.email}
                </p>
              </div>
            )}
          </div>
          
          {/* Valor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
           Importe a transferir
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
          
          {/* Descrição */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Pago de alquiler"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50"
            />
          </div>
          
          {/* Botão de envio */}
          <button
            type="submit"
            disabled={isLoading || !selectedUser || !amount}
            className="w-full bg-[#8bb09b] text-white py-4 rounded-xl font-medium hover:bg-[#8bb09b] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? 'Processando...' : 'Transferir agora'}
            {!isLoading && <Send size={18} className="ml-2" />}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Transfer;
