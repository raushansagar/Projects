import React, { useContext } from 'react'
import { StoreContext } from '../../StoreContext/StoreContext';
import './Category.css'
import Menu from '../Menu/Menu';

const Category = () => {

  const {menu} = useContext(StoreContext);

  return (
    <div className="Category_Container" id='explore-category'>
      <h1>Explore Categories</h1>
      <div className="Category_items">
          {menu?.map((item) =>
            item?._id ? (
              <Menu 
                key={item._id} 
                menuId={item._id} 
                menuName={item.name} 
                menuImg={item.image} 
              />
            ) : null 
          )}
      </div>
    </div>
  );
};

export default Category;
