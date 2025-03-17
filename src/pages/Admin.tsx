
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Minus, RefreshCw, Users, UserRound, Wallet, Ban } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser, users, addFunds, subtractFunds } = useBankContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Admin access check
  React.useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      toast.error('Acesso restrito a administradores');
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Filtered users (exclude admin)
  const filteredUsers = users.filter(user => 
    !user.isAdmin &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    }, 600);
  };

  const selectUserForOperation = (userId: string) => {
    setSelectedUser(userId);
    setSearchTerm(users.find(u => u.id === userId)?.name || '');
  };

  // User detail component
  const UserDetail = ({ userId }: { userId: string }) => {
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-bank-purple/10 rounded-full">
            <UserRound size={24} className="text-bank-purple" />
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Saldo atual</p>
            <p className="text-xl font-bold text-bank-purple">R$ {formatCurrency(user.balance)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Transações</p>
            <p className="text-xl font-bold text-bank-purple">{user.transactions.length}</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Operações</h4>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => {
                selectUserForOperation(userId);
                setOperation('add');
              }}
            >
              <Plus size={16} className="mr-1" />
              Adicionar fundos
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => {
                selectUserForOperation(userId);
                setOperation('subtract');
              }}
            >
              <Minus size={16} className="mr-1" />
              Remover fundos
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  return (
    <Layout title="Dashboard Administrativo">
      <div className="animate-fade-in space-y-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-bank-purple"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Voltar</span>
        </button>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bank-purple p-4 rounded-xl text-white flex items-center">
            <Users className="mr-3" size={24} />
            <div>
              <h3 className="font-medium">Total de usuários</h3>
              <p className="text-xl font-bold">{users.filter(u => !u.isAdmin).length}</p>
            </div>
          </div>
          <div className="bg-green-600 p-4 rounded-xl text-white flex items-center">
            <Wallet className="mr-3" size={24} />
            <div>
              <h3 className="font-medium">Saldo Total</h3>
              <p className="text-xl font-bold">R$ {formatCurrency(
                users.filter(u => !u.isAdmin).reduce((sum, user) => sum + user.balance, 0)
              )}</p>
            </div>
          </div>
        </div>
        
        {/* Search and Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Gerenciar Usuários</h3>
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'cards' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Cartões
              </Button>
              <Button 
                variant={viewMode === 'table' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Tabela
              </Button>
            </div>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50"
            />
          </div>
        </div>
        
        {/* User Operation Form */}
        {selectedUser && (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Operação Financeira</h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setSearchTerm('');
                  setAmount('');
                }}
                className="text-sm text-red-500 flex items-center"
              >
                <Ban size={16} className="mr-1" />
                Cancelar
              </button>
            </div>
            
            {/* Selected User */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <UserRound size={20} className="text-bank-purple" />
                  <div>
                    <p className="font-medium">{users.find(u => u.id === selectedUser)?.name}</p>
                    <p className="text-xs text-gray-500">{users.find(u => u.id === selectedUser)?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Saldo atual</p>
                  <p className="font-medium">
                    R$ {formatCurrency(users.find(u => u.id === selectedUser)?.balance || 0)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Operation Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Operação
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
            
            {/* Amount */}
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
            
            {/* Submit Button */}
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
                      Adicionar R$ {amount ? parseFloat(amount).toFixed(2).replace('.', ',') : '0,00'}
                    </>
                  ) : (
                    <>
                      <Minus size={18} className="mr-2" />
                      Remover R$ {amount ? parseFloat(amount).toFixed(2).replace('.', ',') : '0,00'}
                    </>
                  )}
                </>
              )}
            </button>
          </form>
        )}
        
        {/* Users List - Card View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-bank-purple/10 rounded-full">
                        <UserRound size={18} className="text-bank-purple" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Saldo</p>
                      <p className="font-medium text-bank-purple">
                        R$ {formatCurrency(user.balance)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          Detalhes
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Detalhes do Usuário</SheetTitle>
                          <SheetDescription>
                            Informações e operações para {user.name}
                          </SheetDescription>
                        </SheetHeader>
                        <UserDetail userId={user.id} />
                      </SheetContent>
                    </Sheet>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => selectUserForOperation(user.id)}
                    >
                      Gerenciar fundos
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-6 rounded-lg text-center">
                <p className="text-gray-500">Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        )}
        
        {/* Users List - Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Transações</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>R$ {formatCurrency(user.balance)}</TableCell>
                      <TableCell>{user.transactions.length}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                Detalhes
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Detalhes do Usuário</SheetTitle>
                                <SheetDescription>
                                  Informações e operações para {user.name}
                                </SheetDescription>
                              </SheetHeader>
                              <UserDetail userId={user.id} />
                            </SheetContent>
                          </Sheet>
                          
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => selectUserForOperation(user.id)}
                          >
                            Gerenciar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
