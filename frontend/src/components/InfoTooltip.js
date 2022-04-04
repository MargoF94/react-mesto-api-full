import React from "react";

function InfoTooltip({isOpen, onClose, isSuccess}) {

  function handleCloseInfoTooltip() {
    onClose(isSuccess);
  }

  return (
    <div className={`page__popup popup popup_role_tooltip ${ isOpen ? 'popup_opened' : '' }`}>
        <div className="popup__container">
          <button onClick={ handleCloseInfoTooltip } type="button" className="button popup__button-close"></button>
          <div
            className={`popup__image popup__image_${ isSuccess ? 'success' : 'fail' }`}
            ></div>
          <h2 className="popup__title popup__title_tooltip ">{ isSuccess ? 
            'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.' }</h2>
        </div>
      </div>
  )
}

export default InfoTooltip;