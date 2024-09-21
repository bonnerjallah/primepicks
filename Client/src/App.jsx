import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"

import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import MenFashion from "./components/MenFashion"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route path="/" element={<Home />} />
      <Route path="/MenFashion" element={<MenFashion />} />

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