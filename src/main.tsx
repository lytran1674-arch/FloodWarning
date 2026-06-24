import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { BrowserRouter } from 'react-router-dom'
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById('root')!).render(
  // StrictMode bị xóa để tránh double mount/fetch trong dev khi deloy lên host thì mở ra
  //<StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </Provider>
  //</StrictMode>
)