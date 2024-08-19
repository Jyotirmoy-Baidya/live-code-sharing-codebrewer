import React, { useState } from 'react'
import { FaCut } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom'
import CopyToClipboard from '../CopyToClipboard';
import CopyLinkToClipboard from '../CopyLinkToClipboard';
import axiosHandler from '../AxiosInstance';
import toast from 'react-hot-toast';
import LoginHeader from '../LoginHeader';



const Lobby = () => {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState("");
    const [roomid, setRoomid] = useState("");
    const [roomidPopUp, setRoomidPopUp] = useState(false);
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState({});
    const [login, setLogin] = useState(false);

    const [hostRoomid, setHostRoomid] = useState("");
    const [hostRoomname, setHostRoomname] = useState("");
    const [participantRoomid, setParticipantRoomid] = useState("");
    const [participantRoomname, setParticipantRoomname] = useState("");

    const generateRoomid = () => {
        if (hostRoomname === '') {
            toast.error('Please enter a room name');
        }
        else {
            const chars = 'abcdefghijklmnopqrstuvwxyz';
            let roomId = '';

            // Generate a random string with the length of 9 characters
            for (let i = 0; i < 9; i++) {
                roomId += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            setHostRoomid(roomId);
        }
    }




    const createRoom = () => {
        localStorage.setItem('HostRoomName', hostRoomname);
        localStorage.setItem('HostRoomId', hostRoomid);
        navigate(`/host/${hostRoomid}`);
    }


    return (
        <>
            <LoginHeader />
            <div className='h-96 px-16 pt-7 flex gap-4'>
                {/* Host  */}
                <div className='w-1/2 p-4 bg-primary-black rounded-md shadow shadow-gray-700' >
                    <h1 className='text-2xl font-bold underline-offset-4 underline pb-2'>Create Room</h1>
                    <p className='text-xm text-gray-400 '>Here you can host a meeting share live questions and code with your participants.</p>


                    <input type="text" className='w-full mt-7 p-2 bg-slate-600 rounded-md outline-none border-yellow-500 border mb-2' placeholder='Enter your roomname' value={hostRoomname} onChange={(e) => setHostRoomname(e.target.value)} />
                    <button className='bg-green-700 active:bg-green-700 py-2 px-3 mb-3 mx-auto rounded-md text-black font-plex-mono hover:border-b-2 hover:-translate-y-[0.07rem] active:translate-y-0 active:border-none' onClick={() => generateRoomid()}>Generate a roomid</button>
                    {
                        hostRoomid &&
                        <div className='flex items-center mx-auto gap-2 justify-center mt-3'>
                            <div className=''>Roomid:</div>
                            <div className='rounded-md shadow shadow-slate-400 px-3 py-2 bg-gray-600 w-48 tracking-widest flex'>
                                {hostRoomid}
                                <div className='ms-auto'><CopyToClipboard textToCopy={`${hostRoomid}`} /></div>
                                <div><CopyLinkToClipboard textToCopy={`http://localhost:5173/participant/${hostRoomid}`} /></div>
                            </div>
                        </div>
                    }
                    <div className='mt-8  text-center'>
                        <button className={`${hostRoomid ? 'bg-yellow-400' : 'bg-yellow-800'} rounded-md py-2 px-3 text-black font-plex-mono mx-auto hover:border-b-2 hover:-translate-y-[0.07rem] active:translate-y-0 active:border-none`}
                            onClick={() => {
                                if (hostRoomid) {
                                    createRoom();
                                }
                                else {
                                    toast.error('Please generate a roomid first');
                                }
                            }}>Create Room</button>
                    </div>
                </div>

                {/* Participant  */}
                <div className='w-1/2 p-4 bg-primary-black rounded-md shadow shadow-gray-700' >
                    <h1 className='text-2xl font-bold underline-offset-4 underline pb-2'>Join Room</h1>
                    <p className='text-xm text-gray-400 '>Here you can join a meeting hosted by coding profesionals.</p>


                    <input type="text" className='w-full mt-7 p-2 bg-slate-600 rounded-md outline-none border-yellow-500 border mb-2' placeholder='Enter your room id' value={participantRoomid} onChange={(e) => setParticipantRoomid(e.target.value)} />

                    <div className='mt-6  text-center'>
                        <button className={`${participantRoomid ? 'bg-yellow-400' : 'bg-yellow-800'} rounded-md py-2 px-3 text-black font-plex-mono mx-auto hover:border-b-2 hover:-translate-y-[0.07rem] active:translate-y-0 active:border-none`}
                            onClick={() => {
                                if (participantRoomid) {
                                    navigate(`participant/${participantRoomid}`)
                                }
                                else {
                                    toast.error('Please enter a roomid.');
                                }
                            }}>Join Room</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Lobby