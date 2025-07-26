import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import Store from './Store/Store.jsx'

export const SERVER_URL = "https://realtimechatapp-server-qzvk.onrender.com";

createRoot(document.getElementById('root')).render(
  <Provider store={Store} >
    <App />
    <Toaster />
  </Provider>
)
