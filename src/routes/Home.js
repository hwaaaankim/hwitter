import Hweet from "../components/Hweet";
import { dbService, storageService } from "myBase";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
const Home = ({ userObj }) => {
  // console.log(userObj);
  const [hweet, setHweet] = useState("");
  const [hweets, setHweets] = useState([]);
  const [attachment, setAttachment] = useState();
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
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      // console.log(attachmentRef);

      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const hweetObj = {
      text: hweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("hweets").add(hweetObj);
    setHweet("");
    setAttachment("");
    // await dbService.collection("hweets").add({
    //   text: hweet,
    //   createAt: Date.now(),
    //   creatorId: userObj.uid,
    // });
    // setHweet("");
  };
  const onChange = event => {
    const {
      target: { value },
    } = event;
    setHweet(value);
  };
  // console.log(hweets);
  const onFileChange = event => {
    // console.log(event.target.files);
    const {
      target: { files },
    } = event;

    const theFile = files[0];
    // console.log(theFile);
    const reader = new FileReader();
    reader.onloadend = finishedEvent => {
      // console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearPhotoClick = () => setAttachment(null);
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
        <input type="file" accept="image/*" onChange={onFileChange}></input>
        <input type="submit" value="Hweet"></input>
        {attachment && (
          <div>
            <img src={attachment} width="50px"></img>
            <button onClick={onClearPhotoClick}>Clear</button>
          </div>
        )}
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
