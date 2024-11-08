import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"

import { ProductsProvider } from "./components/ProductsContext"
import { OrderProvider } from "./components/OrderContext"


import Nav from "./components/Nav"
import Home from "./pages/Home"
import ModifyProducts from "./pages/ModifyProducts"
import InventoryManagement from "./pages/InventoryManagement"
import ViewOrderAndStatus from "./pages/ViewOrderAndStatus"
import Billing from "./pages/Billing"
import OrderStatusUpdate from "./pages/OrderStatusUpdate"
import SignUpLogin from "./pages/SignUpLogin"
import ProtectedRoutes from "./components/ProtectedRoutes"


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<SignUpLogin />} />
      <Route path="/" element={<Nav/>}>
        <Route element={<ProtectedRoutes />} >
          <Route path="/Home" element={<Home/>}/>
          <Route path="/ModifyProducts" element={<ModifyProducts />} />
          <Route path="/InventoryManagement/:id" element={<InventoryManagement />} />
          <Route path="/ViewOrderAndStatus" element={<ViewOrderAndStatus />} />
          <Route path="/Billing" element={<Billing />}/>
          <Route path="/OrderStatusUpdate/:id" element={<OrderStatusUpdate/>} />
        </Route>
      </Route>

    </Route>
    
  )
)


function App() {

  return (
    <ProductsProvider>
      <OrderProvider>
        <RouterProvider router={router}/>
      </OrderProvider>
    </ProductsProvider>
  )
}

export default App
