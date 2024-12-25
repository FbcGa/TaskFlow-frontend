import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Layout} from './layout.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
)