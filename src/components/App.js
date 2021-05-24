import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "myBase";
function App() {
  //  console.log(authService.currentUser);
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // console.log(authService.currentUser);
  // setInterval(() => {
  //   console.log(authService.currentUser);
  // }, 2000);

  useEffect(() => {
    authService.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn}></AppRouter> : "Initializing"}
      <footer>&copy; Hwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
