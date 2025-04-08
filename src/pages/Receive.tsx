
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Clipboard, Copy, Download, Share2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBankContext } from '@/context/BankContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Receive = () => {
  const navigate = useNavigate();
  const { currentUser, generateQRCode } = useBankContext();
  const [amount, setAmount] = useState('');
  const [qrData, setQrData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Protect the route
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleGenerate = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Introduzca un valor válido');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const data = generateQRCode(currentUser!.id, amountValue);
      setQrData(data);
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
    <Layout title="Recibe pagos">
      <div className="animate-fade-in">
        <Button 
          onClick={() => navigate('/dashboard')}
          variant="ghost" 
          className="mb-6 p-0 h-auto flex items-center text-[#adcbba]"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Regresso</span>
        </Button>
        
        <p className="text-gray-600 mb-4">
          Genera un código QR para recibir pagos de otros usuarios
        </p>
        
        {!qrData ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Importe a cobrar
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    R$
                  </div>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0.01"
                    required
                    className="pl-10 pr-4 text-lg"
                  />
                </div>
              </div>
              
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !amount}
                className="w-full bg-bank-purple "
              >
                {isLoading ? 'Generador...' : 'Generar código de pago'}
                {!isLoading && <QrCode size={18} className="ml-2" />}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-center mb-2">
                <div className="p-8 bg-bank-purple rounded-lg">
                  <QrCode size={120} className="text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="font-medium text-bank-purple text-xl">Código generado!</h3>
                <p className="text-gray-500 mt-1">
                  Valor: R$ {parseFloat(amount).toFixed(2)}
                </p>
              </div>
              
              <div className="bg-bank-light-blue p-4 rounded-lg relative overflow-hidden">
                <p className="text-sm font-mono break-all pr-8">{qrData}</p>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-bank-blue/10 rounded"
                >
                  <Clipboard size={16} className="text-bank-blue" />
                </button>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={copyToClipboard}
                  variant="outline" 
                  className="w-full"
                >
                  <Copy size={18} className="mr-2" />
                  Copiar código
                </Button>
                
                <Button 
                  onClick={() => {
                    setQrData('');
                    setAmount('');
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  Generar nuevo código
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Receive;
