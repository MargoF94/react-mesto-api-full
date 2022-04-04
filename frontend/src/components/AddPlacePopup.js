import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup ({ isOpen, onClose, onAddPlace }) {

  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace(name, link);
  }

  // сброс полей формы при ее закрытии
  useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  return (
    <PopupWithForm
      name="add-element" 
      title="Новое место" 
      buttonTextContent="Создать"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}>

      <>
        <input
          className="form__input form__input_name form__input_field_image-name"
          type="text"
          id="form__element-name"
          name="name"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          value={name || ''}
          onChange={handleNameChange}
          required />
        <span id="form__element-name-error" className="form__input-error"></span>
          
        <input
          className="form__input form__input_info form__input_field_image-url"
          type="url"
          id="form__element-description"
          name="link"
          placeholder="Ссылка на картинку"
          value={link || ''}
          onChange={handleLinkChange}
          required />
        <span id="form__element-description-error" className="form__input-error"></span>
      </>

    </PopupWithForm>
  )

}

export default AddPlacePopup;