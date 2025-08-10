import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import Income from './pages/Income.jsx'
import Home from './pages/Home.jsx'
import Expense from './pages/Expense.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Filter from './pages/Filter.jsx'
import Category from './pages/Category.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
const router=createBrowserRouter(createRoutesFromElements(
  <>
   <Route path='/' element={<App/>}/>
  <Route path='/dashboard' element={<Home/>}/>
  <Route path='/income' element={<Income/>}/>
  <Route path='/expense' element={<Expense/>}/>
  <Route path='/login' element={<Login/>}/>
  <Route path='/signup' element={<SignUp/>}/>
  <Route path='/filter' element={<Filter/>}/>
  <Route path='/category' element={<Category/>}/>
  </>
))
createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <RouterProvider router={router}/>
  </AppContextProvider>
)
