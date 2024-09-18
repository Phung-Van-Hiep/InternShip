import { StrictMode } from 'react'
import './index.css'
import router from './routes/MainRoute'
import { RouterProvider } from 'react-router-dom'

export default function App() {
  return (
    <>
    {/* <StrictMode> */}
    <RouterProvider router={router} />
   {/* </StrictMode>, */}
    </>
  )
}
      