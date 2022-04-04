import React from "react";
import Card from './Card';
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({cards, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete}) {

  const currentUser = React.useContext(CurrentUserContext);

  return(
    <main className="main-container">
        <section className="profile page__profile">
          <div className="profile__main">
            <div 
              onClick={onEditAvatar} 
              className="profile__avatar" 
              style={{ backgroundImage: `url(${currentUser.avatar})` }} >
            </div>
            
            <div className="profile__info">
              <h1 className="profile__title">{currentUser.name}</h1>
              <p className="profile__subtitle">{currentUser.about}</p>
            </div>
            <button 
              onClick={onEditProfile} 
              type="button" 
              className="button profile__button-edit">
            </button>
          </div>
          <button 
            onClick={onAddPlace} 
            type="button" 
            className="button profile__button-add">
          </button>
        </section>

        <section className="elements page__elements">
          <ul className="elements__container">
          {
            cards.map((card) => (<Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />))
          }
          </ul>
        </section>
      </main>
  )
}

export default Main;