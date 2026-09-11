import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

createRoot(rootElement, {
  onUncaughtError(error, errorInfo) {
    const msg = String((error as any)?.message || error || '');
    if (
      msg.includes('cross-origin frame') ||
      msg.includes('SecurityError') ||
      msg.includes('Should not already be working')
    ) {
      return;
    }
    console.error('Uncaught render error:', error, errorInfo);
  },
  onCaughtError(error, errorInfo) {
    const msg = String((error as any)?.message || error || '');
    if (
      msg.includes('cross-origin frame') ||
      msg.includes('SecurityError') ||
      msg.includes('Should not already be working')
    ) {
      return;
    }
    console.error('Caught render error:', error, errorInfo);
  },
  onRecoverableError(error, errorInfo) {
    const msg = String((error as any)?.message || error || '');
    if (
      msg.includes('cross-origin frame') ||
      msg.includes('SecurityError') ||
      msg.includes('Should not already be working')
    ) {
      return;
    }
    console.warn('Recoverable render notice:', error, errorInfo);
  },
}).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

