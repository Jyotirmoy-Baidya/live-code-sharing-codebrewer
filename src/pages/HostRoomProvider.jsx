import AgoraRTC, { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';
import React, { useEffect, useState } from 'react'
import HostRoom from './HostRoom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoginHeader from '../LoginHeader';

const HostRoomProvider = () => {
    //Initializing the RTCClient in order to pass it through the providers
    // let agoraClient;
    const [loading, setLoading] = useState(true);

    const [host, setHost] = useState();

    const { roomid } = useParams();



    const getUserId = async () => {
        console.log("sss");
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3010/api/v1/login/user/get-user`);
            setHost(response.data);
            console.log(host)
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserId();
        // agoraClient = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

    }, [])

    function generateRandomCode() {
        // Generate a random number between 1000 and 9999
        return `${Math.floor(1000 + Math.random() * 9000)}`;
    }

    return (
        <>
            {
                loading ?
                    <div>Loading...</div> :
                    host.username == '' && host._id == '' ?
                        <>You are not logged in. Failed to fetch user</> :
                        <>


                            <LoginHeader />
                            <HostRoom uid={generateRandomCode()} roomid={roomid} username={host.username} />
                        </>
            }
        </>
    )
}

export default HostRoomProvider