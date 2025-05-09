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
import { ToastContainer } from 'react-toastify';
import CurrentOrder from './Component/CurrentOrder/CurrentOrder';

function App() {
  const { loginPopUp } = useContext(StoreContext);
  console.log(loginPopUp);

  return (
    <div>
      {!loginPopUp && <LoginSignUp />}
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        {loginPopUp ? <Route path='/Shop' element={<DisplayItems />} /> : <Route path='/' element={<DisplayItems />} />}
        <Route path='/New' element={<Home />} />
        <Route path='/Offers' element={<NewArrivals />} />
        <Route path='/Contact' element={<Home />} />
        <Route path='/showItems' element={<ItemsDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<Order />} />
        <Route path='/orderPlaced' element = {<CurrentOrder/>} />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
