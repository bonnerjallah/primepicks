import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"

import Nav from "./components/Nav"
import Home from "./pages/Home"
import ModifyProducts from "./pages/ModifyProducts"
import InventoryManagement from "./pages/InventoryManagement"
import ViewOrderAndStatus from "./pages/ViewOrderAndStatus"
import Billing from "./pages/Billing"


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Nav/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/ModifyProducts" element={<ModifyProducts />} />
      <Route path="/InventoryManagement" element={<InventoryManagement />} />
      <Route path="/ViewOrderAndStatus" element={<ViewOrderAndStatus />} />
      <Route path="/Billing" element={<Billing />}/>
    </Route>
  )
)


function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
