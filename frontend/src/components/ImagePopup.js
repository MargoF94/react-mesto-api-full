import React from "react"

function ImagePopup({card, name, onClose}) {
  return (
    <div className={`popup page__image-popup image-popup popup_role_${name}  ${(!!card.name && !!card.link) ? 'popup_opened' : ''}`} >
        <div className="image-popup__container">
          <button onClick={onClose} type="button" className="button popup__button-close"></button>
          <img src={card.link} alt={card.name} className="image-popup__image-opened" />
          <h2 className="image-popup__title">{card.name}</h2>
        </div>
      </div>
  )
}

export default ImagePopup;