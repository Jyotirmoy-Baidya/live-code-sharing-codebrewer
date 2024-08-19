import React, { useState } from 'react';
import RealTimeChat from './RealTimeChat';
import RoomHost from './RoomHost';
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';
import LoginHeader from './LoginHeader';
import DesignHost from './DesignHost';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Lobby from './pages/Lobby';
import ParticipantRoom from './pages/ParticipantRoom';
import { Toaster } from 'react-hot-toast';
import HostRoom from './pages/HostRoom';
import HostRoomProvider from './pages/HostRoomProvider';
import LiveProblem from './pages/LiveProblem';
import ParticipantRoomProvider from './pages/ParticipantRoomProvider';

const App = () => {
  // const agoraClient = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  const appId = '15b767a0b7dd4fe488826585f7eeb187';
  let uid = String(Math.floor(Math.random() * 10000));
  const appid = '15b767a0b7dd4fe488826585f7eeb187'
  const channelId = 'jyoti';
  const userId = uid;

  const [chatPopUp, setChatPopUp] = useState(false);

  let agoraClient = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div className="h-screen w-screen bg-black">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<><Lobby /></>} />
          <Route path='/participant/:roomname/:roomid' element={
            <AgoraRTCProvider client={agoraClient}>
              <ParticipantRoomProvider />
            </AgoraRTCProvider>
          } />
          <Route path='/host/:roomname/:roomid' element={
            <AgoraRTCProvider client={agoraClient}>
              <HostRoomProvider />
            </AgoraRTCProvider>
          } />
        </Routes>
        {/* <AgoraRTCProvider client={agoraClient}>
          <DesignHost userId={userId} />
        </AgoraRTCProvider> */}
      </BrowserRouter>
      <Toaster />
    </div>
  );
};

export default App;
