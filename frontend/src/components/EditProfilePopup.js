import React, {useEffect} from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from './PopupWithForm';

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {

  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]); 

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser(name, description)
  }

  return (

    <PopupWithForm
      name="edit-profile" 
      title="Редактировать профиль" 
      buttonTextContent="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}>

            <input
              className="form__input form__input_name form__input_field_name"
              type="text"
              id="form__profile-name"
              name="edit-profile"
              minLength="2"
              maxLength="40"
              value={name || ''}
              onChange={handleNameChange}
              required />
            <span id="form__profile-name-error" className="form__input-error"></span>
            <input
                className="form__input form__input_info form__input_field_description"
                type="text"
                id="form__profile-description"
                name="about"
                minLength="2"
                maxLength="200"
                value={description || ''}
                onChange={handleDescriptionChange}
                required />
              <span id="form__profile-description-error" className="form__input-error"></span>

      </PopupWithForm>
      

  )
}

export default EditProfilePopup;