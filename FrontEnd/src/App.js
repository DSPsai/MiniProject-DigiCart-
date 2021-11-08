import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes ,Switch, Route ,Link } from 'react-router-dom';
import Signup from './Pages/Signup'
import SignIn from './Pages/SignIn';
import Home from './Pages/Home';
import SingleShop from './Pages/SingleShop';
import Navbar from './Components/Navbar';
import Shops from './Pages/Shops'
import MercHome from './Merchant/MercHome';
import Checkout from './Pages/Checkout'
function App() {
   //pre-call function to fetch data
  async function apicall() {        
    
  }
  useEffect(() => { //restricts the function call loop
    apicall();
  }, [])
  return <div className='main'>
    <Router>
        <Navbar/>
      <Routes>
      {/* <Switch>       */}
        {/* switching from one page to another */}
        <Route path='/' exact element={<Home/>} />
        <Route path='/login' exact element={<SignIn/>} />
        <Route path='/signup' exact element={<Signup/>} />
        <Route path='/Shops' exact element={<Shops/>} />
        <Route path='/Shop/:id' exact element={<SingleShop/>} />
        <Route path='/Merchant' exact element={<MercHome/>} />
        <Route path='/Checkout' exact element={<Checkout/>} />
      {/* </Switch> */}
      </Routes>
    </Router>
  </div>
}

export default App;
