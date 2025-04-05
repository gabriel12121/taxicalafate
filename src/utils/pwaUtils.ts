
import { toast } from 'sonner';

// Variable to store the deferred prompt event
let deferredPrompt: any;

// Setup PWA installation prompt
export const setupPWA = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Store the event so it can be triggered later
    deferredPrompt = e;
    
    // Show a toast notification that the app can be installed
    setTimeout(() => {
      toast.message('Instale nosso app!', {
        description: 'FinBank está disponível para instalação no seu dispositivo.',
        action: {
          label: 'Instalar',
          onClick: () => promptInstall()
        },
        duration: 10000
      });
    }, 3000);
  });

  // When the app is successfully installed
  window.addEventListener('appinstalled', () => {
    // Clear the deferredPrompt variable
    deferredPrompt = null;
    // Log or perform actions after app is installed
    console.log('PWA was installed');
    toast.success('App instalado com sucesso!');
  });
};

// Function to prompt user to install the PWA
export const promptInstall = () => {
  if (!deferredPrompt) {
    toast.error('A instalação não está disponível');
    return;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
    if (choiceResult.outcome === 'accepted') {
      toast.success('Obrigado por instalar nosso app!');
    } else {
      toast.info('Você pode instalar o app mais tarde');
    }
    // Clear the deferredPrompt variable
    deferredPrompt = null;
  });
};
