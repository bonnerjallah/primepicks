import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"

import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import MenFashion from "./components/MenFashion"
import WomenFashion from "./components/WomenFashion"
import Shoes from "./components/Shoes"
import WomenAccessories from "./components/WomenAccessories"
import Watches from "./components/Watches"
import MenAccessories from "./components/MenAccessories"
import MoreDetails from "./components/MoreDetails"

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

    </Route>
  )
)


const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App