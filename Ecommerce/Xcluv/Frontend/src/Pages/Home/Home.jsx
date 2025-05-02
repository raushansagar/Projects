import React, { useContext, useEffect, useState } from 'react'
import Category from '../../Component/Category/Category.jsx';
import NewArrivals from '../../Component/NewArrivals/NewArrivals.jsx';
import Support from '../../Component/XcluvSupport/Support.jsx';
import Discount from '../../Component/Discount/Discount.jsx';
import Hero from '../../Component/Hero/Hero.jsx';
import Order from '../../Component/Order/Order.jsx';

const Home = () => {

  return (
    <div className='home'>
      <Hero/>
      <Category />
      <NewArrivals />
      <Support/>
      <Discount/>
    </div>
  )
}

export default Home
