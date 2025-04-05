
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupPWA } from './utils/pwaUtils'

// Initialize PWA setup
setupPWA();

createRoot(document.getElementById("root")!).render(<App />);
