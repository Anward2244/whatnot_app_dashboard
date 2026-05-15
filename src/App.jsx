import { Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Login from './Login'
import Layout from './components/Layout'
import BrandSales from './pages/BrandSales'
import StoreSales from './pages/StoreSales'
import ProductSales from './pages/ProductSales'
import CategorySales from './pages/CategorySales'
import PromotersData from './PromotersData'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="promoters-sales" element={<CategorySales />} />
        <Route path="brand-sales" element={<BrandSales />} />
        <Route path="store-sales" element={<StoreSales />} />
        <Route path="product-sales" element={<ProductSales />} />
        <Route path="promoters" element={<PromotersData />} />
      </Route>
    </Routes>
  )
}

export default App
