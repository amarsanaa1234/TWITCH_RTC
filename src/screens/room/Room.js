import './room.css'
import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../../service/peer";
import { useSocket } from "../../context/SocketProvider";
import Header from '../header/Header';

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [message, setMessage] = useState('');
  const [remoteStream, setRemoteStream] = useState();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} ${id} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      try {
        await peer.peer.setRemoteDescription(new RTCSessionDescription(ans));
        const answer = await peer.peer.createAnswer();
        await peer.peer.setLocalDescription(answer);
        socket.emit("peer:nego:done", { to: from, ans: answer });
  
        console.log("Call Accepted!");
        sendStreams();
      } catch (error) {
        console.error("Error handling call acceptance:", error);
      }
    },
    [peer, socket, sendStreams]
  );
  
  const handleNegoNeedIncomming = useCallback(async () => {
    try {
      const offer = await peer.getOffer();
  
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    } catch (error) {
      console.error("Error handling negotiation needed:", error);
    }
  }, [remoteSocketId, socket, peer]);
  
  const handleNegoNeedFinal = useCallback(
    async ({ ans }) => {
      try {
        await peer.peer.setLocalDescription(new RTCSessionDescription(ans));
      } catch (error) {
        console.error("Error handling negotiation final:", error);
      }
    },
    [peer]
  );

  
  const handleReceiveMessage = useCallback(({ message, id }) => {
    console.log(`Received Message: ${message} from user with ID: ${id}`);
    setMessages((prevMessages) => [...prevMessages, { message, id }]);
  }, []);

  const handleSendMsg = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit('message:sendMsg', { message: inputMessage, remoteSocketId });
      setInputMessage('');
    },
    [inputMessage, socket]
  );

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("message:sendMsg", handleSendMsg);
    socket.on("user:sendMsg", handleReceiveMessage);
    socket.on("user:sendMsg1", handleReceiveMessage);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("message:sendMsg", handleSendMsg);
      socket.off("user:sendMsg", handleReceiveMessage);
      socket.off("user:sendMsg1", handleReceiveMessage);

    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleSendMsg,
    handleReceiveMessage
  ]);

  return (
    <div className='room'>
      <Header/>
      <div className='room_frame'>
        <div className='room_navbar'>
          <div className='room_navbar_status'>
            <h2>Participants</h2>
            <h2 className='room_active_status'>0</h2>
          </div>
        </div>
        <div className='room_streaming'>
          {myStream && (
            <>
              <h1>My Stream</h1>
              <div div className='room_camera_frame'>
              <ReactPlayer
                playing
                muted
                width={336}
                className='room_camera'
                url={myStream}
              />
              </div>
            </>

          )}
          {remoteStream && (
            <>
              <h1>Remote Stream</h1>
              <ReactPlayer
                playing
                muted
                height="500px"
                width="500px"
                controls={true}
                className='room_camera'
                url={remoteStream}
              />
            </>
          )}
          <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
          {myStream && <button className='Lobby_button' onClick={sendStreams}>Send Stream</button>}
          {remoteSocketId && <button className='Lobby_button' onClick={handleCallUser}>Эхлүүлэх</button>}
          
        </div>
          <div className='room_chat'>
            <section id="messages__container">
              <div id="messages">
                {messages.map((msg, index) => (
                    <div className='createMember' key={index}>
                      <div className='msgUserName'>{msg.id}</div>
                      <div className='msgMessage'>{msg.message}</div>
                    </div>
                ))}
              </div>
              <form id="message__form" onSubmit={handleSendMsg}>
                <input
                  id='msgInput'
                  type="text"
                  name="message"
                  placeholder="Send a message...."
                  autoComplete="off"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
              </form>
            </section>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;