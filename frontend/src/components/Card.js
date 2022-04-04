import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({card, onCardClick, onCardLike, onCardDelete}) {

  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `button ${isOwn ? 'element__button-delete_visible' : 'element__button-delete_hidden'}`
  ); 

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
    `button element__button-like ${isLiked ? 'element__button-like_active' : ''}`
  ); 

  function handleClick() {
    onCardClick(card);
  } 

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleCardDelete() {
    onCardDelete(card);
  }

  return (
    <li className="element">
      <span className={cardDeleteButtonClassName} onClick={handleCardDelete}></span>
      <div className="element__image-container">
        <img onClick={handleClick} src={card.link} alt={card.name} className="element__image" />
      </div>
      <div className="element__info">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__like-info-container">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <div className="element__like-counter">{card.likes.length}</div>
        </div>
      </div>
    </li>
  )
}

export default Card;