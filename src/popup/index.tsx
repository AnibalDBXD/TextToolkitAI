import { createRoot } from 'react-dom/client';
import Popup from './popup';

chrome.tabs.query({ active: true, currentWindow: true }, () => {
    createRoot(document.getElementById('root')!).render(<Popup />);
});