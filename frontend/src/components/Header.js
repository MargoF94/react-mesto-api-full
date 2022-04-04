import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header({isLoggedIn, onLogout, email}) {

  const location = useLocation();

  function handleLogout() {
    onLogout();
  }
  return(
    <header className="header page__header">
      <div className="header__container">
        <div className="header__logo"></div>
        <div className="header__button-container">
          { isLoggedIn && 
            <>
              <span className="header__email">{email}</span>
              <button className="header__logout-button header__link" onClick={handleLogout}>Выйти</button>
            </> }
          { (location.pathname === '/signin') &&
            <Link className="header__link" to="/signup">Регистрация</Link> } 
          { (location.pathname === '/signup') &&
            <Link className="header__link" to="/signin">Войти</Link>}
        </div>
      </div>
      </header>
  )
}

export default Header;