import React, {useEffect, useState} from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import '../index.css';
import api from '../utils/api';
import * as auth from '../utils/auth';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {

  // переменные состояния, отвечающие за видимость попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const history = useHistory();
  
  // обработчики событий
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };
  function handleCardClick(card) {
    setSelectedCard(card);
  };

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
  }
  function handleLikeClick(card) {
    // проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id))
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(name, about) {
    api.changeUserData(name, about)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(url) {
    api.changeUserAvatar(url)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogin(email) {
    setIsLoggedIn(true);
    setUserData({
      email: email
    })
  }

  function handleLoginSubmit(email, password) {
    if (!email || !password) {
      return;
    }
    auth.authorize(email, password)
      .then((data) => {
        if(!data.token) {
          return
        }
        localStorage.setItem('token', data.token);
        handleLogin(email);
        history.push('/');
      })
      .catch(err => console.log(err));
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    history.push('/sign-in');
  }

  function handleAddPlaceSubmit(name, link) {
    api.addCard(name, link)
      .then((data) => {
        setCards([data, ...cards])
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleRegister(email, password) {
    auth.register(email, password)
    .then(() => {
      history.push('/sign-in');
      setIsSuccess(true);
    })
    .catch((err) => {
      setIsSuccess(false);
      console.log(err);
    })
    .finally(() => {
      setIsInfoPopupOpen(true);
    })
  }

  function handleCloseInfoTooltip (isSuccess) {
    // if(isSuccess) {
    //   history.push('/');
    // }
    setIsInfoPopupOpen(false);
  }

  // запрашиваем первоначальные карточки и информацию о пользователе

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([
        api.getUserData(),
        api.getInitialCards()
      ])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards)
      })
      .catch(err => console.log(err))
    }
  }, [isLoggedIn]);

  // useEffect(() => {
  //   api.getUserData()
  //     .then((data) => {
  //       setCurrentUser(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //     api.getInitialCards()
  //     .then((data) => {
  //       setCards(data)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, []);
  
  // проверяет, авторизирован ли пользователь через проверку токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getContent(token).then((res) => {
        if (res) {
          setUserData({
            email: res.data.email,
            id: res.data._id
          })
          setIsLoggedIn(true);  
          history.push('/')
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(err => console.log(err));
    }
  }, [history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          email={userData.email} />

        <Switch>
          <ProtectedRoute
            exact path="/"
            component={Main}
            isLoggedIn={isLoggedIn}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleLikeClick}
            onCardDelete={handleCardDelete}
            />
          <Route path="/sign-in">
            <Login 
              onLogin={handleLoginSubmit}
            />
          </Route>

          <Route path="/sign-up">
            <Register
              onRegister={handleRegister} />
          </Route> 
          <Route path="*">
              {isLoggedIn ? <Redirect to="/"/> : <Redirect to="/sign-in"/>}
            </Route> 
        </Switch>

        {isLoggedIn && <Footer />}

        <EditProfilePopup 
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} />

        <AddPlacePopup 
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit} />

        <EditAvatarPopup 
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup
          card={selectedCard}
          name="open-image"
          onClose={closeAllPopups} />

        <InfoTooltip
          isOpen={isInfoPopupOpen}
          onClose={handleCloseInfoTooltip}
          isSuccess={isSuccess} />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
