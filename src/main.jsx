import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx' 
import Productos from './pages/Productos.jsx'
import AñadirProducto from './pages/AñadirProducto.jsx'
import DetalleProducto from './pages/DetalleProducto.jsx'
import EditarProducto from './pages/EditarProducto.jsx'
import Lotes from './pages/Lotes.jsx'
const router = createBrowserRouter([
  {
    path:'/',
    element: <App/>
  },
  {
    path:'/products',
    element: <Productos/>
  },
  {
    path:'/productos/nuevo',
    element:<AñadirProducto/>
  },
  {
    path:'/products/:id',
    element:<DetalleProducto/>
  },
  {
    path:'/products/editar/:id',
    element:<EditarProducto/>
  },
  {
    path:'/lotes',
    element:<Lotes/>
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
