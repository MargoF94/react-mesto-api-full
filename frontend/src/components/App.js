// import React, {useEffect, useState} from 'react';
// import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
// import '../index.css';
// import api from '../utils/api';
// import * as auth from '../utils/auth';
// import Header from './Header';
// import Main from './Main';
// import Footer from './Footer';
// import ImagePopup from './ImagePopup';
// import EditProfilePopup from './EditProfilePopup';
// import EditAvatarPopup from './EditAvatarPopup';
// import AddPlacePopup from './AddPlacePopup';
// import Login from './Login';
// import Register from './Register';
// import ProtectedRoute from './ProtectedRoute';
// import InfoTooltip from './InfoTooltip';
// import { CurrentUserContext } from '../contexts/CurrentUserContext';

// function App() {

//   // переменные состояния, отвечающие за видимость попапов
//   const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
//   const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
//   const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
//   const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
//   const [selectedCard, setSelectedCard] = useState({});
//   const [currentUser, setCurrentUser] = useState({});
//   const [cards, setCards] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState({});
//   const [isSuccess, setIsSuccess] = useState(false);
//   // let jwt;

//   const history = useHistory();
  
//   // обработчики событий
//   function handleEditAvatarClick() {
//     setIsEditAvatarPopupOpen(true);
//   };
//   function handleEditProfileClick() {
//     setIsEditProfilePopupOpen(true);
//   };
//   function handleAddPlaceClick() {
//     setIsAddPlacePopupOpen(true);
//   };
//   function handleCardClick(card) {
//     setSelectedCard(card);
//   };

//   function closeAllPopups() {
//     setIsEditAvatarPopupOpen(false);
//     setIsEditProfilePopupOpen(false);
//     setIsAddPlacePopupOpen(false);
//     setSelectedCard({});
//   }
//   function handleLikeClick(card) {
//     const jwt = localStorage.getItem('jwt');
//     // проверяем, есть ли уже лайк на этой карточке
//     const isLiked = card.likes.some(i => i._id === currentUser._id);
//     // Отправляем запрос в API и получаем обновлённые данные карточки
//     if (jwt) {
//       api.changeLikeCardStatus(card._id, !isLiked, jwt)
//       .then((newCard) => {
//         setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     }
//   }
//   function handleCardDelete(card) {
//     const jwt = localStorage.getItem('jwt');
//     if (jwt) {
//       api.deleteCard(card._id, jwt)
//       .then(() => {
//         setCards((cards) => cards.filter((c) => c._id !== card._id))
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     }
//   }

//   function handleUpdateUser(name, about) {
//     const jwt = localStorage.getItem('jwt');
//     api.changeUserData(name, about, jwt)
//       .then((data) => {
//         setCurrentUser(data);
//         closeAllPopups();
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleUpdateAvatar(url) {
//     const jwt = localStorage.getItem('jwt');
//     api.changeUserAvatar(url, jwt)
//       .then((data) => {
//         setCurrentUser(data);
//         closeAllPopups()
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // function handleLogin(email) {
//   //   setUserData({
//   //     email: email
//   //   })
//   // }

//   // function handleLoginSubmit(email, password) {
//   //   if (!email || !password) {
//   //     return;
//   //   }
//   //   console.log('Handling LogInSubmit');
//   //   auth.authorize(email, password)
//   //     .then((data) => {
//   //       if(!data) {
//   //         console.log('In "handleLoginSubmit": no data returned');
//   //         return
//   //       } 
//   //       return data;
//   //     })
//   //     .then((data) => {
//   //       console.log('In "handleLoginSubmit/2nd then": got data after LogIn');
//   //       localStorage.setItem('jwt', data.jwt);
//   //       console.log('In "handleLoginSubmit/2nd then": set new JWT');
//   //       console.log(`In "handleLoginSubmit/2nd then": new JWT is ${localStorage.getItem('jwt')}`);
//   //     })
//   //     .then(() => {
//   //       console.log('In "handleLoginSubmit/3rd then": setting isLoggenIn state to TRUE');
//   //       setIsLoggedIn(true);
//   //       console.log(`In "handleLoginSubmit/3rd then": is LoggedIn is ${isLoggedIn}`);
//   //       handleLogin(email);
//   //       console.log('In "handleLoginSubmit/3rd then": about to check token');
//   //       checkToken();
//   //       history.push('/');
//   //     })
//   //     .catch(err => console.log(err));
//   // }

//   function handleLoginSubmit(email, password) {
//     // Проверяем, есть ли email и password; если нет - идем в catch
//     if (!email || !password) {
//       return;
//     };
//     auth.authorize(email, password)
//       .then((data) => {
//         // Записываем вернувшийся токен в хранилище
//         localStorage.setItem('jwt', data.jwt);
//       });
//       setUserData({
//         email: email
//       })
//   }

//   function handleLogout() {
//     console.log('Logging out');
//     localStorage.removeItem('jwt');
//     setIsLoggedIn(false);
//     history.push('/signin');
//   }

//   function handleAddPlaceSubmit(name, link) {
//     const jwt = localStorage.getItem('jwt');
//     api.addCard(name, link, jwt)
//       .then((data) => {
//         setCards([data, ...cards])
//         closeAllPopups();
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleRegister(email, password) {
//     localStorage.removeItem('jwt');
//     auth.register(email, password)
//     .then(() => {
//       history.push('/signin');
//       setIsSuccess(true);
//     })
//     .catch((err) => {
//       setIsSuccess(false);
//       console.log(err);
//     })
//     .finally(() => {
//       setIsInfoPopupOpen(true);
//     })
//   }

//   function handleCloseInfoTooltip (isSuccess) {
//     setIsInfoPopupOpen(false);
//   }

//   // запрашиваем первоначальные карточки и информацию о пользователе

//   // useEffect(() => {
//   //   const jwt = localStorage.getItem('jwt');
//   //   console.log(`In "useEffect[isLoggedIn]": После логина: ${jwt}`);
//   //   if (isLoggedIn) {
//   //     Promise.all([
//   //       api.getUserData(jwt),
//   //       api.getInitialCards(jwt)
//   //     ])
//   //     .then(([user, cards]) => {
//   //       console.log('In "useEffect[isLoggedIn]": Установили данные юзера.');
//   //         setCurrentUser(user);
//   //         setCards(cards);
//   //         history.push('/');
//   //     })
//   //     .catch(err => console.log(err));
//   //   }
//   // }, [isLoggedIn]);
  
//   // проверяет, авторизирован ли пользователь через проверку токена
//   // useEffect(() => {
//   //   const jwt = localStorage.getItem('jwt');
//   //   console.log(`Проверка авторизации: ${jwt}`);
//   //   if (jwt) {
//   //     auth.getContent(jwt).then((res) => {
//   //       if (res) {
//   //         setUserData({
//   //           email: res.data.email,
//   //           id: res.data._id
//   //         })
//   //         console.log('Установили данные юзера.');
//   //         setIsLoggedIn(true);
//   //         setCurrentUser(res);
//   //         history.push('/');
//   //       } else {
//   //         localStorage.removeItem('jwt');
//   //       }
//   //     })
//   //     .catch(err => console.log(err));
//   //   }
//   // }, [history]);

//   // const checkToken = () => {
//   //   const jwt = localStorage.getItem('jwt');
//   //   console.log('In "checkToken": Checking logIn and jwt');
//   //   console.log(`In "checkToken": Состояние логина: ${isLoggedIn}`);
//   //   console.log(`In "checkToken": Jwt: ${jwt}`);
//   //   if (!isLoggedIn) {
//   //     localStorage.removeItem('jwt');
//   //     console.log('In "checkToken": Removed jwt');
//   //   }
//   //   if (jwt) {
//   //     console.log(`In "checkToken": Jwt: ${jwt}`);
//   //     setIsLoggedIn(true);
//   //     console.log(`In "checkToken": Current logIn status: ${isLoggedIn}`);
//   //     Promise.all([
//   //       api.getUserData(jwt),
//   //       api.getInitialCards(jwt)
//   //     ])
//   //       .then(([user, cards]) => {
//   //         console.log('In "checkToken": Установили данные юзера.');
          
//   //         setCurrentUser(user);
//   //         setCards(cards);
//   //         history.push('/');
//   //       })
//   //       .catch((err) => {
//   //         console.log(`Promises did not fulfill: ${err}`);
//   //       });
//   //   };
//   // };

//   const checkToken = () => {
//     const jwt = localStorage.getItem('jwt');
//     console.log(`In "checkToken": начальное состояние логина: ${isLoggedIn}`);
//     console.log(`In "checkToken": начальное значение Jwt: ${jwt}`);
//     if (jwt) {
//       // получаем юзера
//       api.getUserData(jwt)
//         .then((user) => {
//           if (!user) {
//             console.log('In "checkToken": failed to fetch user');
//           }
//           setIsLoggedIn(true);
//           setCurrentUser(user.data);
//           history.push('/');
//         })
//         .catch((err) => {
//           console.log(err.message);
//         });
//       api.getInitialCards(jwt)
//         .then((cards) => {
//           setCards(cards);
//         })
//         .catch((err) => {
//           console.log(err.message);
//         });
//     };
//   };

//   // useEffect(() => {
//   //   console.log('Checking loggedIn state');
//   //   checkToken();
//   //   if (isLoggedIn === true) {
//   //     setIsLoggedIn(false);
//   //     localStorage.removeItem('jwt');
//   //   }
//   // }, []);

//   useEffect(() => {
//     checkToken();
//   }, [history]);

//   return (
//     <CurrentUserContext.Provider value={currentUser}>
//       <div className="page">
//         <Header
//           isLoggedIn={isLoggedIn}
//           onLogout={handleLogout}
//           email={userData.email} />

//         <Switch>
//           <ProtectedRoute
//             exact path="/"
//             component={Main}
//             isLoggedIn={isLoggedIn}
//             cards={cards}
//             onEditProfile={handleEditProfileClick}
//             onAddPlace={handleAddPlaceClick}
//             onEditAvatar={handleEditAvatarClick}
//             onCardClick={handleCardClick}
//             onCardLike={handleLikeClick}
//             onCardDelete={handleCardDelete}
//             />
//           <Route path="/signin">
//             <Login 
//               onLogin={handleLoginSubmit}
//             />
//           </Route>

//           <Route path="/signup">
//             <Register
//               onRegister={handleRegister} />
//           </Route> 
//           <Route path="*">
//               {isLoggedIn ? <Redirect to="/"/> : <Redirect to="/signin"/>}
//             </Route> 
//         </Switch>

//         {isLoggedIn && <Footer />}

//         <EditProfilePopup 
//           isOpen={isEditProfilePopupOpen}
//           onClose={closeAllPopups}
//           onUpdateUser={handleUpdateUser} />

//         <AddPlacePopup 
//           isOpen={isAddPlacePopupOpen}
//           onClose={closeAllPopups}
//           onAddPlace={handleAddPlaceSubmit} />

//         <EditAvatarPopup 
//           isOpen={isEditAvatarPopupOpen}
//           onClose={closeAllPopups}
//           onUpdateAvatar={handleUpdateAvatar}
//         />

//         <ImagePopup
//           card={selectedCard}
//           name="open-image"
//           onClose={closeAllPopups} />

//         <InfoTooltip
//           isOpen={isInfoPopupOpen}
//           onClose={handleCloseInfoTooltip}
//           isSuccess={isSuccess} />

//       </div>
//     </CurrentUserContext.Provider>
//   );
// }

// export default App;

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
    // const jwt = localStorage.getItem('jwt');
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
    // const jwt = localStorage.getItem('jwt');
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id))
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

  // function handleLogin(email) {
  //   setIsLoggedIn(true);
  //   setUserData({
  //     email: email
  //   })
  // }

  function handleLoginSubmit(email, password) {
    if (!email || !password) {
      return;
    }
    // Setting JWT after authorization
    auth.authorize(email, password)
      .then((jwt) => {
        console.log(`In handleLoginSubmit: res data: ${jwt}`);
        if(!jwt) {
          throw new Error('Произошла ошибка (авторизации на фронте)');
        }
        tokenCheck();
        // localStorage.setItem('jwt', jwt);
        // setIsLoggedIn(true);
        // api.getUserData(jwt)
        //   .then((user) => {
        //     setUserData({
        //       email: user.email
        //     });
        //     setIsLoggedIn(true);
        //     history.push('/');
        //     console.log(`In handleLoginSubmit: set following:\n
        //     JWT: ${jwt}\n
        //     isLoggedIn: ${isLoggedIn}`)
        //   });
      })
      .catch(err => console.log(err))
      .finally(() => console.log(`In handleLoginSubmit finally: isLoggedIn: ${isLoggedIn}`));
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
      if (res) {
        history.push('/signin');
        setIsSuccess(true);
      }
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
    setIsInfoPopupOpen(false);
  }

  // запрашиваем первоначальные карточки и информацию о пользователе

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    console.log(`In useEffect in LoggedIn: isLoggedIn: ${isLoggedIn}`);
    console.log(`In useEffect in LoggedIn: jwt: ${jwt}`); // we DO have the jwt here
    if (isLoggedIn) {
      // Promise.all([
      //   api.getUserData(jwt),
      //   api.getInitialCards(jwt)
      // ])
      // .then(([user, cards]) => {
      //   setCurrentUser(user);
      //   setUserData({
      //     email: user.email
      //   });
      //   setCards(cards);
      //   history.push('/');
      //   console.log(`In UseEffect on isLoggedIn: set following:\n
      //   JWT: ${jwt}\n
      //   isLoggedIn: ${isLoggedIn}`)
      // })
      // .catch(err => console.log(err))
      history.push('/');
    } else {
      localStorage.removeItem('jwt');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    tokenCheck();
  }, []);
  
  // проверяет, авторизирован ли пользователь через проверку токена

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    console.log(`In tokenCheck: isLoggedIn: ${isLoggedIn}`);
    console.log(`In tokenCheck: jwt: ${jwt}`);
    if (jwt) {
      setIsLoggedIn(true);
      Promise.all([
        api.getUserData(),
        api.getInitialCards()
      ])
      .then(([user, cards]) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
        setUserData({
          email: user.email
        });
        setCards(cards);
        history.push('/');
        console.log(`In tokenCheck: set following:\n
        JWT: ${jwt}\n
        isLoggedIn: ${isLoggedIn}`)
      })
      .catch(err => console.log(err))
    } else {
      localStorage.removeItem('jwt');
    }
  }

  // useEffect(() => {
  //   const jwt = localStorage.getItem('jwt');
  //   console.log(`In token-check: was able to find token ${jwt}`);
  //   if (jwt) {
  //     // auth.getContent(jwt).then((res) => {
  //     api.getUserData(jwt).then((res) => {
  //       if (res) {
  //         console.log(`In token-check: heres response data: ${res}`);
  //         // setUserData({
  //         //   email: res.email,
  //         //   id: res._id
  //         // })
  //         setIsLoggedIn(true);
  //         console.log(`In tokenCheck: isLoggedIn: ${isLoggedIn}`);
  //         history.push('/');
  //       } else {
  //         localStorage.removeItem('jwt');
  //       }
  //       console.log(`In token-check: was able to find token ${isLoggedIn}`);
  //     })
  //     .catch(err => console.log(err));
  //   }
  // }, [history]);

  // useEffect(() => {
  //   const jwt = localStorage.getItem('jwt');
  //   if (jwt) {
  //     auth.getContent(jwt)
  //       .then((data) => {
  //         if (data) {
  //           setIsLoggedIn(true);
  //         } else {
  //           console.log('Could not login');
  //         }
          
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, []);

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
              {isLoggedIn ? <Redirect to="/"/> : <Redirect to="/signin"/>}
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
