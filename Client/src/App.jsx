import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"

import { CartProvider } from "./components/Cartcontext"

import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import MenFashion from "./components/MenFashion"
import WomenFashion from "./components/WomenFashion"
import Shoes from "./components/Shoes"
import WomenAccessories from "./components/WomenAccessories"
import Watches from "./components/Watches"
import MenAccessories from "./components/MenAccessories"
import MoreDetails from "./components/MoreDetails"
import CheckOut from "./pages/CheckOut"
import Login from "./pages/Login"
import WishList from "./components/WishList"
import ProtectedRoutes from "./components/ProtectedRoutes"


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route path="/" element={<Home />} />
      <Route path="/MenFashion" element={<MenFashion />} />
      <Route path="/WomenFashion" element={<WomenFashion />} />
      <Route path="/Shoes" element={<Shoes/>} />
      <Route path="/WomenAccessories" element={<WomenAccessories />} />
      <Route path="/Watches" element={<Watches/>} />
      <Route path="/MenAccessories" element={<MenAccessories/>} />
      <Route path="/MoreDetails/:id" element={<MoreDetails/>} />
      <Route path="/CheckOut" element={<CheckOut />} />
      <Route path="/Login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/WishList" element={<WishList />} />
      </Route>

    </Route>
  )
)


const App = () => {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}

export default App