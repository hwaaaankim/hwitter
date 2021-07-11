import { authService, dbService } from "myBase";
import React, { useEffect } from "react";
import { useHistory } from "react-router";

export default ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyHweets = async () => {
    const hweets = await dbService
      .collection("hweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createAt")
      .get();
    console.log(hweets.docs.map(doc => doc.data()));
  };

  useEffect(() => {
    getMyHweets();
  }, []);
  return (
    <>
      <button onClick={onLogOutClick}>Log out</button>
    </>
  );
};
