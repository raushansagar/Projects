
import React, { useContext, useState } from 'react'
import './Items.css'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../StoreContext/StoreContext';

const Items = (props) => {

  const {viewItems, setViewItems, discount} = useContext(StoreContext);

  return (

    <div className='Items_Container'>
      <div key={props.items._id} className="Items_Image">
        <Link to={'/showItems'} onClick={() => setViewItems(props.items._id)} ><img src={props.items.image} alt="" /></Link>
      </div>
      <div className='Items_Down'>
        <h4>{props.items.subCategory}</h4>
        <p>{props.items.name}</p>
        <div className="price">
          <h5>Rs. {props.items.price}</h5>
          {discount === props.items.discount ? <h6>Up To {props.items.discount} OFF</h6>: ""}
        </div>
      </div>
    </div>
  )
}

export default Items

