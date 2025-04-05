import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Interfaces para tipagem
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  isAdmin: boolean;
  transactions: Transaction[];
  googleId?: string;
}

interface GoogleUser {
  id: string;
  name: string;
  email: string;
}

interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  date: string;
  description: string;
}

interface BankContextType {
  users: User[];
  currentUser: User | null;
  showBalance: boolean;
  setShowBalance: (show: boolean) => void;
  login: (email: string, password: string) => boolean;
  loginWithGoogle: (googleUser: GoogleUser) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  getUser: (id: string) => User | undefined;
  getUserByEmail: (email: string) => User | undefined;
  addFunds: (userId: string, amount: number) => boolean;
  subtractFunds: (userId: string, amount: number) => boolean;
  transferFunds: (fromUserId: string, toUserId: string, amount: number, description: string) => boolean;
  generateQRCode: (userId: string, amount: number) => string;
  processQRPayment: (qrData: string, fromUserId: string) => boolean;
}

// Valores default para o contexto
const defaultContext: BankContextType = {
  users: [],
  currentUser: null,
  showBalance: true,
  setShowBalance: () => {},
  login: () => false,
  loginWithGoogle: () => false,
  logout: () => {},
  register: () => false,
  getUser: () => undefined,
  getUserByEmail: () => undefined,
  addFunds: () => false,
  subtractFunds: () => false,
  transferFunds: () => false,
  generateQRCode: () => '',
  processQRPayment: () => false
};

// Criação do contexto
const BankContext = createContext<BankContextType>(defaultContext);

// Hook para utilizar o contexto
export const useBankContext = () => useContext(BankContext);

// Provedor do contexto
export const BankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showBalance, setShowBalance] = useState(true);

  // Carregar dados salvos no localStorage na inicialização
  useEffect(() => {
    const savedUsers = localStorage.getItem('bankUsers');
    const savedCurrentUser = localStorage.getItem('currentUser');

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Criar um admin para demonstração inicial
      const adminUser: User = {
        id: Date.now().toString(),
        name: 'Admin',
        email: 'admin@finbank.com',
        password: 'admin123',
        balance: 10000,
        isAdmin: true,
        transactions: []
      };
      setUsers([adminUser]);
    }

    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
  }, []);

  // Salvar dados no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('bankUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Login de usuário
  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      toast.success(`Bem-vindo, ${user.name}!`);
      return true;
    }
    
    toast.error('Email ou senha incorretos');
    return false;
  };

  // Login com Google
  const loginWithGoogle = (googleUser: GoogleUser): boolean => {
    // Verificar se usuário já existe
    const existingUser = users.find(u => u.email === googleUser.email || u.googleId === googleUser.id);
    
    if (existingUser) {
      // Atualizar googleId se não existir
      if (!existingUser.googleId) {
        setUsers(prev => prev.map(u => {
          if (u.id === existingUser.id) {
            return { ...u, googleId: googleUser.id };
          }
          return u;
        }));
      }
      
      setCurrentUser(existingUser);
      toast.success(`Bem-vindo de volta, ${existingUser.name}!`);
      return true;
    } else {
      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        name: googleUser.name,
        email: googleUser.email,
        password: '', // Usuários do Google não têm senha local
        googleId: googleUser.id,
        balance: 0,
        isAdmin: false,
        transactions: []
      };
      
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      toast.success(`Bem-vindo, ${newUser.name}!`);
      return true;
    }
  };

  // Logout
  const logout = (): void => {
    setCurrentUser(null);
    toast.info('Você saiu da sua conta');
  };

  // Registro de novo usuário
  const register = (name: string, email: string, password: string): boolean => {
    if (users.some(u => u.email === email)) {
      toast.error('Este email já está em uso');
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      balance: 0,
      isAdmin: false,
      transactions: []
    };

    setUsers(prev => [...prev, newUser]);
    toast.success('Cadastro realizado com sucesso!');
    return true;
  };

  // Buscar usuário por ID
  const getUser = (id: string): User | undefined => {
    return users.find(u => u.id === id);
  };

  // Buscar usuário por email
  const getUserByEmail = (email: string): User | undefined => {
    return users.find(u => u.email === email);
  };

  // Adicionar fundos (admin)
  const addFunds = (userId: string, amount: number): boolean => {
    if (amount <= 0) {
      toast.error('O valor deve ser maior que zero');
      return false;
    }

    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          balance: user.balance + amount,
          transactions: [
            ...user.transactions,
            {
              id: Date.now().toString(),
              fromUserId: 'admin',
              toUserId: userId,
              amount,
              date: new Date().toISOString(),
              description: 'Depósito (Admin)'
            }
          ]
        };
      }
      return user;
    }));

    // Atualizar o usuário atual se for o mesmo
    if (currentUser?.id === userId) {
      setCurrentUser(prev => {
        if (prev) {
          return {
            ...prev,
            balance: prev.balance + amount,
            transactions: [
              ...prev.transactions,
              {
                id: Date.now().toString(),
                fromUserId: 'admin',
                toUserId: userId,
                amount,
                date: new Date().toISOString(),
                description: 'Depósito (Admin)'
              }
            ]
          };
        }
        return prev;
      });
    }

    toast.success(`R$ ${amount.toFixed(2)} adicionado com sucesso`);
    return true;
  };

  // Subtrair fundos (admin)
  const subtractFunds = (userId: string, amount: number): boolean => {
    if (amount <= 0) {
      toast.error('O valor deve ser maior que zero');
      return false;
    }

    const user = users.find(u => u.id === userId);
    
    if (!user) {
      toast.error('Usuário não encontrado');
      return false;
    }

    if (user.balance < amount) {
      toast.error('Saldo insuficiente');
      return false;
    }

    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          balance: user.balance - amount,
          transactions: [
            ...user.transactions,
            {
              id: Date.now().toString(),
              fromUserId: userId,
              toUserId: 'admin',
              amount,
              date: new Date().toISOString(),
              description: 'Saque (Admin)'
            }
          ]
        };
      }
      return user;
    }));

    // Atualizar o usuário atual se for o mesmo
    if (currentUser?.id === userId) {
      setCurrentUser(prev => {
        if (prev) {
          return {
            ...prev,
            balance: prev.balance - amount,
            transactions: [
              ...prev.transactions,
              {
                id: Date.now().toString(),
                fromUserId: userId,
                toUserId: 'admin',
                amount,
                date: new Date().toISOString(),
                description: 'Saque (Admin)'
              }
            ]
          };
        }
        return prev;
      });
    }

    toast.success(`R$ ${amount.toFixed(2)} retirado com sucesso`);
    return true;
  };

  // Transferência entre usuários
  const transferFunds = (fromUserId: string, toUserId: string, amount: number, description: string): boolean => {
    if (amount <= 0) {
      toast.error('O valor deve ser maior que zero');
      return false;
    }

    if (fromUserId === toUserId) {
      toast.error('Não é possível transferir para si mesmo');
      return false;
    }

    const fromUser = users.find(u => u.id === fromUserId);
    const toUser = users.find(u => u.id === toUserId);

    if (!fromUser || !toUser) {
      toast.error('Usuário não encontrado');
      return false;
    }

    if (fromUser.balance < amount) {
      toast.error('Saldo insuficiente');
      return false;
    }

    const transactionId = Date.now().toString();
    const transactionDate = new Date().toISOString();

    setUsers(prev => prev.map(user => {
      if (user.id === fromUserId) {
        return {
          ...user,
          balance: user.balance - amount,
          transactions: [
            ...user.transactions,
            {
              id: transactionId,
              fromUserId,
              toUserId,
              amount,
              date: transactionDate,
              description
            }
          ]
        };
      }
      if (user.id === toUserId) {
        return {
          ...user,
          balance: user.balance + amount,
          transactions: [
            ...user.transactions,
            {
              id: transactionId,
              fromUserId,
              toUserId,
              amount,
              date: transactionDate,
              description
            }
          ]
        };
      }
      return user;
    }));

    // Atualizar o usuário atual se for o remetente
    if (currentUser?.id === fromUserId) {
      setCurrentUser(prev => {
        if (prev) {
          return {
            ...prev,
            balance: prev.balance - amount,
            transactions: [
              ...prev.transactions,
              {
                id: transactionId,
                fromUserId,
                toUserId,
                amount,
                date: transactionDate,
                description
              }
            ]
          };
        }
        return prev;
      });
    }

    toast.success(`Transferência de R$ ${amount.toFixed(2)} realizada com sucesso`);
    return true;
  };

  // Gerar código QR para pagamento
  const generateQRCode = (userId: string, amount: number): string => {
    if (amount <= 0) {
      toast.error('O valor deve ser maior que zero');
      return '';
    }

    // Formato do QR: userId|amount
    const qrData = `${userId}|${amount}`;
    return qrData;
  };

  // Processar pagamento via QR Code
  const processQRPayment = (qrData: string, fromUserId: string): boolean => {
    const [toUserId, amountStr] = qrData.split('|');
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
      toast.error('QR Code inválido');
      return false;
    }

    return transferFunds(fromUserId, toUserId, amount, 'Pagamento via QR Code');
  };

  // Objeto com todos os valores e funções do contexto
  const contextValue: BankContextType = {
    users,
    currentUser,
    showBalance,
    setShowBalance,
    login,
    loginWithGoogle,
    logout,
    register,
    getUser,
    getUserByEmail,
    addFunds,
    subtractFunds,
    transferFunds,
    generateQRCode,
    processQRPayment
  };

  return (
    <BankContext.Provider value={contextValue}>
      {children}
    </BankContext.Provider>
  );
};
