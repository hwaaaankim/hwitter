import Hweet from "../components/Hweet";
import { dbService } from "myBase";
import React, { useState, useEffect } from "react";
const Home = ({ userObj }) => {
  console.log(userObj);
  const [hweet, setHweet] = useState("");
  const [hweets, setHweets] = useState([]);
  // const getHweets = async () => {
  //   const dbHweets = await dbService.collection("hweets").get();
  //   dbHweets.forEach(document => {
  //     const hweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //       creatorId: userObj.uid,
  //     };
  //     setHweets(prev => [hweetObject, ...prev]);
  //   });
  // };
  // forEach를 사용하여 그리는 방법

  useEffect(() => {
    dbService.collection("hweets").onSnapshot(snapshot => {
      const hweetArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHweets(hweetArray);
    });
  }, []);
  //  hweets를 배열로 선언 후 array를 만들어 setHweets를 하는 방법
  const onSubmit = async event => {
    event.preventDefault();
    await dbService.collection("hweets").add({
      text: hweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
    });
    setHweet("");
  };
  const onChange = event => {
    const {
      target: { value },
    } = event;
    setHweet(value);
  };
  console.log(hweets);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={hweet}
          onChange={onChange}
          placeholder="What's on your mind"
          maxLength={120}
        ></input>
        <input type="submit" value="Hweet"></input>
      </form>
      <div>
        {/* {hweets.map(hweet => (
          <div key={hweet.id}>
            <h4>{hweet.text}</h4>
          </div>
        ))} */}
        {hweets.map(hweet => (
          <Hweet
            hweetObj={hweet}
            key={hweet.id}
            isOwner={hweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
