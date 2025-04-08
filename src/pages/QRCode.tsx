import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Clipboard, ArrowDown, ArrowUp } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';
import { toast } from 'sonner';

const QRCode = () => {
  const navigate = useNavigate();
  const { currentUser, generateQRCode, processQRPayment } = useBankContext();
  const [mode, setMode] = useState<'generate' | 'read'>('generate');
  const [amount, setAmount] = useState('');
  const [qrData, setQrData] = useState('');
  const [qrInput, setQrInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Proteger a rota
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleGenerate = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Digite um valor válido');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const data = generateQRCode(currentUser!.id, amountValue);
      setQrData(data);
      setIsLoading(false);
    }, 800);
  };

  const handlePayWithQR = () => {
    if (!qrInput) {
      toast.error('Pegar código QR');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const success = processQRPayment(qrInput, currentUser!.id);
      
      if (success) {
        navigate('/dashboard');
      }
      
      setIsLoading(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData);
    toast.success('Código copiado en el portapapeles');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Layout title="Pago con código QR">
      <div className="animate-fade-in">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-[#adcbba] mb-6"
        >
          <span>Regresso</span>
        </button>
        
        {/* Abas de modo */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 py-3 rounded-md text-center transition-colors ${
              mode === 'generate' ? 'bg-white shadow-sm' : 'text-gray-500'
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <ArrowDown size={18} className="mb-1" />
              <span className="text-sm">Recibir</span>
            </div>
          </button>
          <button
            onClick={() => setMode('read')}
            className={`flex-1 py-3 rounded-md text-center transition-colors ${
              mode === 'read' ? 'bg-white shadow-sm' : 'text-gray-500'
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <ArrowUp size={18} className="mb-1" />
              <span className="text-sm">Pagar</span>
            </div>
          </button>
        </div>
        
        {/* Conteúdo baseado no modo */}
        {mode === 'generate' ? (
          <div>
            <p className="text-gray-600 mb-4">
              Genera un código QR para recibir pagos de otros usuarios
            </p>
            
            {!qrData ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Importe a cobrar
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
                
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !amount}
                  className="w-full bg-[#8bb09b] text-white py-4 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? 'Gerando...' : 'Gerar código QR'}
                  {!isLoading && <QrCode size={18} className="ml-2" />}
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-center mb-2">
                  <div className="p-8 bg-bank-purple rounded-lg">
                    <QrCode size={120} className="text-white" />
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-bank-purple">Código generado!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Valor: R$ {parseFloat(amount).toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-bank-light-blue p-4 rounded-lg relative overflow-hidden">
                  <p className="text-sm font-mono break-all pr-8">{qrData}</p>
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2  rounded"
                  >
                    <Clipboard size={16} className="text-bank-blue" />
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                 Comparte este código para recibir pagos
                </p>
                
                <button
                  onClick={() => {
                    setQrData('');
                    setAmount('');
                  }}
                  className="w-full bg-white border border-bank-purple text-bank-purple py-3 rounded-xl font-medium  transition-colors"
                >
                  Generar nuevo código
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Pega el código QR para realizar un pago
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Código QR
                </label>
                <textarea
                  placeholder="Cole o código QR aqui"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-purple/50"
                />
              </div>
              
              <button
                onClick={handlePayWithQR}
                disabled={isLoading || !qrInput}
                className="w-full bg-[#8bb09b] text-white py-4 rounded-xl font-medium  transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? 'Processando...' : 'Pagar con código QR'}
                {!isLoading && <ArrowUp size={18} className="ml-2" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QRCode;
