import React, { useContext } from 'react';
import './Menu.css';
import { StoreContext } from '../../StoreContext/StoreContext';
import { Link } from 'react-router-dom';

const Menu = ({ menuId, menuName, menuImg}) => {

    const { changeCategory, changeDiscount } = useContext(StoreContext);

    const handleClick = () => {
        changeCategory(menuName);
        changeDiscount("0%");
    };

    return (
        <div className="Menu_Container" key={menuId}>
            <div className="Menu_Img">
                <Link to="/shop" onClick={handleClick}>
                    <img src={menuImg} alt={menuName} />
                </Link>
            </div>
            <div className="Menu_Down">
                <h3>✨ {menuName} ✨</h3>
            </div>
        </div>
    );
};

export default Menu;