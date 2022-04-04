import React from "react"

function PopupWithForm({name, title, buttonTextContent, isOpen, onClose, onSubmit, children}) {

  return(
    <div className={`page__popup popup popup_role_${name} ${isOpen ? 'popup_opened' : ''}`}>
        <div className="popup__container">
          <button onClick={onClose} type="button" className="button popup__button-close"></button>
          <h2 className="popup__title">{title}</h2>
          <form
            className={`popup__form form form_role_${name}`}
            name={`${name}`}
            method="post"
            onSubmit={onSubmit}
            noValidate>

            {children}

            <button
              type="submit"
              className="button form__button-submit">
              {buttonTextContent}
            </button>
          </form>
        </div>
      </div>
  )
}

export default PopupWithForm;