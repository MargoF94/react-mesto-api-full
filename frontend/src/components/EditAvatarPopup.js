import React, { useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {

  const [avatar, setAvatar] = React.useState('');

  useEffect(() => {
    setAvatar('')
  }, [isOpen]);

  function handleAvatarChange(e) {
    setAvatar(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar(avatar);
  }

  return (
    <PopupWithForm
      name="edit-avatar" 
      title="Обновить аватар" 
      buttonTextContent="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}>
        <input
          className="form__input form__input_name form__input_field_avatar"
          type="url"
          id="form__avatar-url"
          name="avatar"
          value={avatar || ''}
          placeholder="Ссылка на новый аватар"
          onChange={handleAvatarChange}
          required />
        <span id="form__avatar-url-error" className="form__input-error"></span>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;