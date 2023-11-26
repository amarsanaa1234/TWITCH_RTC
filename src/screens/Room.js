import React, { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player';
import peer from '../service/peer';

function Room() {

  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();

  const handleCallUser = useCallback(async ()=>{
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true, 
      video: true
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", {to: remoteSocketId, offer})
    setMyStream(stream);
  }, [])

  const handleUserJoined = useCallback(({email, id})=>{
    console.log(`email: ${email} joined room`);
    setRemoteSocketId(id)
  }, [])

  const handleIncommingCall = useCallback(async({from, offer})=>{
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true, 
      video: true
    });
    setMyStream(stream);
    console.log(`inComming call ${from} ${offer}`);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", {to: from, ans});
  },[]);

  const handleCallAccepted = useCallback(({from, ans})=>{
    peer.setLocalDescription(ans);
    console.log(`call accepted`);
  }, []);

  useEffect(()=>{
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    return () =>{
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);

    }
  },[socket, handleUserJoined, handleIncommingCall, handleCallAccepted]);

  return (
    <div>
      <h1>Room page</h1>
      <h3>{remoteSocketId ? 'Connected' : 'no one in room'}</h3>
      <button type="" onClick={handleCallUser}>CALL</button>
      {myStream && (
        <ReactPlayer 
          playing
          muted
          height="100px"
          width="100px"
          url={myStream}
        />
      )}
    </div>
  )
}

export default Room
