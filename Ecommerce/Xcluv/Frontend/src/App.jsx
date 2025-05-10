import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home';
import DisplayItems from './Component/DisplayItems/DisplayItems';
import ItemsDetails from './Component/ItemsDetails/ItemsDetails';
import NewArrivals from './Component/NewArrivals/NewArrivals';
import Cart from './Component/Cart/Cart';
import Navbar from './Component/Navbar/Navbar';
import Footer from './Component/Footer/Footer';
import LoginSignUp from './Component/LoginSignUp/LoginSignUp';
import Order from './Component/Order/Order';
import { StoreContext } from './StoreContext/StoreContext';
import { useContext } from 'react';
import CurrentOrder from './Component/CurrentOrder/CurrentOrder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { loginPopUp } = useContext(StoreContext);

  return (
    <div>
      {!loginPopUp ? <LoginSignUp /> : ""}
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Shop' element={loginPopUp ? <DisplayItems /> : <DisplayItems />} />
        <Route path='/New' element={loginPopUp ? <Home /> : <Home />} />
        <Route path='/Offers' element={loginPopUp ? <NewArrivals /> : <Home />} />
        <Route path='/Contact' element={loginPopUp ? <Home /> : <Home/>} />
        <Route path='/showItems' element={loginPopUp ? <ItemsDetails /> : <Home/>} />
        <Route path='/cart' element={loginPopUp ? <Cart /> : <Home/>} />
        <Route path='/order' element={loginPopUp ? <Order /> : <Home/>} />
        <Route path='/orderPlaced' element = {loginPopUp ? <CurrentOrder/> : <Home/>} />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
