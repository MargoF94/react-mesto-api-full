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

  // const jwt = localStorage.getItem('jwt');

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
    const isLiked = card.likes.some(i => i === currentUser._id);
    // console.log(`In handleLikeClick: currentUser: ${JSON.stringify(currentUser)}`);
    // console.log(`In handleLikeClick: card: ${JSON.stringify(card)}`);
    // console.log(`In handleLikeClick: isLiked: ${isLiked}`);
    // if(card.owner !== currentUser._id) {
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      // console.log(`In App.js changeLikeCardStatus: newCard: ${JSON.stringify(card)}`);
      // const newCard = card;
      setCards((state) => state.map((c) => c._id === card._id ? newCard.card : c));
    })
    .catch((err) => {
      console.log(err);
    });
    // }
  }

  function handleCardDelete(card) {
    // const jwt = localStorage.getItem('jwt');
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(name, about) {
    // const jwt = localStorage.getItem('jwt');
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
    // const jwt = localStorage.getItem('jwt');
    api.changeUserAvatar(url)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLoginSubmit(email, password) {
    if (!email || !password) {
      return;
    }
    // Setting JWT after authorization
    auth.authorize(email, password)
      .then((data) => {
        // console.log(`In handleLoginSubmit: res data: ${data.jwt}`);
        if(!data.jwt) {
          throw new Error('Произошла ошибка (авторизации на фронте)');
        }
        return data._idж
      })
      .then((id) => {
        tokenCheck();
        setCurrentUser({
          _id: id,
        });
        
        setIsLoggedIn(true);
        history.push('/');
        })
        .catch(err => console.log(err));
  }

  function handleLogout() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    history.push('/signin');
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
    .then((res) => {
      if (res.ok) {
        history.push('/signin');
        setIsSuccess(true);
      }
    })
    .catch((err) => {
      setIsSuccess(false);
      // console.log(err);
    })
    .finally(() => {
      setIsInfoPopupOpen(true);
    })
  }

  function handleCloseInfoTooltip (isSuccess) {
    setIsInfoPopupOpen(false);
  }

  // Проверяет наличие токена
  function tokenCheck () {
    const jwt = localStorage.getItem('jwt');
    // console.log(`In ckeckToken: jwt: ${jwt}`);
    if(jwt) {
      auth.getContent(jwt)
        .then((res) => {
          if(res) {
            // console.log(`In tokenCheck: getContent response: ${res}`);
            setUserData({
              email:res.email,
              id: res._id,
            })
            setIsLoggedIn(true);
            history.push('/');
          } else {
            localStorage.removeItem('jwt');
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem('jwt');
        });
    }
  }

  useEffect(() => {
    tokenCheck();
  }, [history]);

  // Если пользователь залогинен, возвращаем карточки и пользователя
  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([
        api.getUserData(),
        api.getInitialCards()
      ])
      .then(([user, cards]) => {
        setCurrentUser(user.data);
        setCards(cards.data);
        // console.log(`In after getInitialCards: cards in setCards: ${cards.data}`);
        // console.log(`In after getInitialCards: ucurrentUser in setCards: ${user.data}`);
      })
      .catch(err => console.log(err))
    }
  }, [isLoggedIn]);


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
          <Route path="/signin">
            <Login 
              onLogin={handleLoginSubmit}
              isLoggedIn={isLoggedIn}
            />
          </Route>

          <Route path="/signup">
            <Register
              onRegister={handleRegister} />
          </Route> 
          <Route path="*">
              {localStorage.getItem('jwt') ? <Redirect to="/"/> : <Redirect to="/signin"/>}
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
