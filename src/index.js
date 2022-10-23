import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import reportWebVitals from './reportWebVitals'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  BrowserRouter,
  Routes 
} from "react-router-dom"
import logo from './logo.svg'
import 'bootstrap/dist/css/bootstrap.min.css'
import Menu from './menu'
import Game from './game'
import Voice from './components/Voice'
import About from './about'
import Navigation from './components/Navigation'
import Container from 'react-bootstrap/Container'

// function Root() {
//   return (
//     <>
//       <div style={{ backgroundImage: `url(${mapsImg})`, height: '90vh', backgroundPosition: 'center',
//   backgroundSize: 'cover',
//   backgroundRepeat: 'no-repeat' }}></div>
//     </>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/game" element={<Game />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

reportWebVitals();

 