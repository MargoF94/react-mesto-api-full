import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import * as auth from '../utils/auth';

function Login ({onLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  function handleEmailChange(e) {
    setEmail(e.target.value);
  };

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  };

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(email, password);
    // if (!email || !password) {
    //   return
    // }
    // auth.authorize(email, password)
    //   .then((data) => {
    //     if(!data.token) {
    //       return
    //     }
    //     handleLogin(data.token, email);
    //   })
    //   .catch(err => console.log(err));
  };

  return (
    <div className='login page__login'>
      <h2 className='login__title'>Вход</h2>
      <form 
        className='form login__form form_role_login'
        name='login'
        onSubmit={handleSubmit}>

        <input
          className="login__input form__input_email form__input_field_email"
          type="text"
          id="form__login-email"
          name="login-email"
          minLength="2"
          maxLength="40"
          value={email || ''}
          placeholder='Email'
          onChange={handleEmailChange}
          required />
        <span id="form__login-email-error" className="form__input-error"></span>

        <input
          className="login__input form__input_password form__input_field_password"
          type="password"
          id="form__login-password"
          name="password"
          minLength="2"
          maxLength="200"
          value={password || ''}
          placeholder='Пароль'
          onChange={handlePasswordChange}
          required />
        <span id="form__profile-description-error" className="form__input-error"></span>

        <button
          type="submit"
          className="button login__button">
          Войти
        </button>

      </form>
    </div>
  )
}

export default Login;