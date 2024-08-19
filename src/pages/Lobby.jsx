import React, { useState } from 'react'
import { FaCut } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom'
import CopyToClipboard from '../CopyToClipboard';
import CopyLinkToClipboard from '../CopyLinkToClipboard';
import axiosHandler from '../AxiosInstance';
import toast from 'react-hot-toast';



const Lobby = () => {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState("");
    const [roomid, setRoomid] = useState("");
    const [roomidPopUp, setRoomidPopUp] = useState(false);
    const [loading, setLoading] = useState(false);

    function generateRoomId() {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        let roomId = '';

        // Generate a random string with the length of 9 characters
        for (let i = 0; i < 9; i++) {
            roomId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return roomId;
    }

    const createRoom = async (room) => {
        setLoading(true);
        const response = await axiosHandler('post', 'room/create-room', {
            roomName,
            roomId: room,
        })
        if (response.success == true) {

            setRoomidPopUp(true);
        }
        else {
            toast.error("room not created");
        }
    }

    const divertToRoom = () => {
        if (roomName.trim() === '') {

            alert('Please enter a room name');
            return;
            //Toast error
        }
        const room = generateRoomId();
        setRoomid(room);
        setRoomidPopUp(true);
        // createRoom(room);

        // navigate(`/host/room/${roomid}`)
    }
    return (
        <div className=''>
            <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            <button className='bg-yellow-400' onClick={() => divertToRoom()}>Create Room</button>
            {roomidPopUp &&
                <div className='absolute top-0 bg-primary-black h-full w-full flex justify-center items-center bg-opacity-30'>
                    <div className='flex flex-col w-2/6 p-5 h-fit rounded-lg bg-gray-800'>
                        <FaCut className='ms-auto text-xl drop-shadow-lg  text-red-500' onClick={() => { setRoomidPopUp(false); navigate("/contests") }} />
                        <div className='text-lg uppercase font-bold tracking-widest font-helvetica drop-shadow-xl text-gray-300'><span className='text-primary'>Y</span>our <span className='text-primary'>C</span>ontent <span className='text-primary'>C</span>ode</div>
                        <div className='text-xl uppercase font-semibold tracking-wider text-primary mt-2 mb-2 shadow-inner outline-none w-full p-3 rounded-lg bg-gray-700 flex'>{roomid}
                            <div className='ms-auto flex gap-2'>
                                <CopyToClipboard textToCopy={roomid} />
                                <CopyLinkToClipboard textToCopy={`http://localhost:5173/participant/${roomid}`} />
                            </div>
                        </div>
                        <NavLink to={`/host/${roomName}/${roomid}`} className='bg-yellow-400 py-3 mt-2 w-48 text-center rounded-md mx-auto'>Enter the room as host</NavLink>
                    </div>
                </div>
            }
        </div>
    )
}

export default Lobby