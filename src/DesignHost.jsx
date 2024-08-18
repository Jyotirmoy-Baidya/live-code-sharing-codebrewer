import React from 'react'
import { AiOutlineAudio, AiOutlineAudioMuted } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';
import { FiCamera, FiCameraOff } from 'react-icons/fi';
import { MdCallEnd, MdOutlineScreenShare } from 'react-icons/md';


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GiCrossMark } from 'react-icons/gi';
import ProblemStatementsForVideoConfee from './ProblemStatementsForVideoConfee';
import RealTimeChat from './RealTimeChat';

import AgoraRTC, {
    LocalUser,
    RemoteUser,
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteAudioTracks,
    useRemoteUsers,
} from "agora-rtc-react";

// const remoteUsers = ['jyoti', 'buddu', 'papoy'];

const DesignHost = ({ userId }) => {
    const appId = '15b767a0b7dd4fe488826585f7eeb187';
    const roomid = 'jyoti';


    const [activeConnection, setActiveConnection] = useState(true);
    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);
    const [screenSharing, setScreenSharing] = useState(false);
    const [screenTrack, setScreenTrack] = useState(null);

    // const navigate = useNavigate();

    //Start Comment
    // // Join the channel
    const client1 = useJoin(
        {
            appid: appId,
            channel: roomid,
            token: null,
            uid: '123'
        },
        activeConnection,
    );

    console.log(client1);

    // Get local tracks
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);

    // Re-publish tracks when mic or camera state changes
    const tracksToPublish = [localMicrophoneTrack, localCameraTrack, screenTrack].filter(Boolean);

    usePublish(tracksToPublish);

    // Remote users and their audio tracks
    const remoteUsers = useRemoteUsers();
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);

    // Play the remote user audio tracks
    useEffect(() => {
        audioTracks.forEach((track) => track.play());
    }, [audioTracks]);

    // Handle screen sharing
    const handleScreenSharing = async () => {
        setCamera(false);
        if (screenSharing) {
            // Stop screen sharing
            if (screenTrack) {
                await screenTrack.stop();
                await screenTrack.close();
                setScreenTrack(null);
            }
            setScreenSharing(false);
        } else {
            // Start screen sharing
            const track = await AgoraRTC.createScreenVideoTrack();
            setScreenTrack(track);
            setScreenSharing(true);
        }
    };
    //End Comment

    // const handleScreenSharing = () => {
    //     setScreenSharing(!screenSharing);
    // }
    const [questionBlock, setQuestionBlock] = useState(false);
    const [questionPopUp, setQuestionPopUp] = useState(false);
    const [sharingQuestion, setSharingQuestion] = useState(false);

    const [search, setSearch] = useState("");

    const [question, setQuestion] = useState();

    const handleQuestionSharing = async (problemid) => {
        setSharingQuestion(true);
        setQuestionPopUp(false)
        setQuestion({
            description: "Lorem",
            title: 'Sum of two numbers'
        });
    }

    const [questionData, setQuestionData] = useState("");


    // Real time messaging 


    return (
        <>
            <div className={`w-full h-[88%] px-2 gap-2 flex flex-col`}>
                <div className='flex gap-4'>
                    <div id='localVideo' className={`${questionBlock ? 'w-[50%]' : 'w-[60%]'} p-3 ${sharingQuestion ? 'h-[26rem]' : 'h-[31rem]'} rounded-md flex flex-col bg-primary-black design-scrollbar smooth-transition`}>
                        {/* Host Screen  */}
                        <LocalUser
                            audioTrack={localMicrophoneTrack}
                            videoTrack={localCameraTrack}
                            cameraOn={cameraOn}
                            micOn={micOn}
                            playAudio={micOn}
                            playVideo={cameraOn}
                            className='camera-video'
                        />
                        {/* {
                            <div className={`h-[29rem] rounded-md bg-violet-800 `}>
                                Jyot
                            </div>
                        } */}
                    </div>
                    <div className='grow'>
                        <button className={`btn flex items-center gap-2 text-white mb-3 border-yellow-500 border hover:shadow-sm  hover:shadow-yellow-500 py-1 px-2 rounded-md ${questionPopUp ? 'w-full' : 'w-60'} flex justify-between video-search-problem-input-block`}>
                            {questionPopUp ?
                                <div className='flex w-full items-center gap-3 relative'>
                                    <input type='text' className='px-2 py-1 w-full bg-transparent cursor-pointer outline-none video-serach-problem-input' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                                    <FaSearch />
                                    <GiCrossMark className='text-red-500 hover:scale-[120%]' onClick={() => { setQuestionPopUp(false) }} />
                                    {questionPopUp &&
                                        <ProblemStatementsForVideoConfee search={search} handleQuestionSharing={handleQuestionSharing} />
                                    }
                                </div>
                                :
                                <div className=' px-2 py-1 w-full flex items-center justify-between' onClick={() => { setQuestionBlock(true); setQuestionPopUp(true) }}>
                                    <div>Search Problem</div>
                                    <FaSearch />
                                </div>
                            }
                        </button>
                        {!sharingQuestion &&
                            <div className='h-[27.6rem]  p-2 rounded-md bg-primary-black overflow-scroll design-scrollbar'>

                                <div id='remoteVideoGrid' className={`grid ${questionBlock ? 'grid-cols-4' : 'grid-cols-3'} rounded-md gap-4 h-full smooth-transition`}>
                                    {
                                        remoteUsers.map((user) => (
                                            <>
                                                <div key={user.uid} className="h-28 flex justify-center items-center remote-video-container rounded-md smooth-transition">
                                                    <RemoteUser user={user} className="rounded-md" />
                                                </div>
                                            </>

                                        ))
                                    }
                                    {/* {
                                        remoteUsers.map((user, i) => (
                                            <div key={i} className="h-28 flex justify-center items-center remote-video-container rounded-md bg-violet-800">
                                                <div>{user}</div>
                                            </div>

                                        ))
                                    } */}
                                </div>
                            </div>
                        }
                        {sharingQuestion &&
                            <>
                                <div className='h-[27.6rem] flex-col p-2 rounded-md bg-primary-black overflow-scroll design-scrollbar text-white'>
                                    <div>{question.title}</div>
                                    <div>{question.description}</div>
                                    <div>{questionData}</div>
                                </div>
                                <RealTimeChat appId={appId} roomid={roomid} userId={userId} />
                            </>
                        }
                    </div>

                </div>
                <div id="controlsToolbar" className="gap-10  mx-auto mt-auto mb-4 text-white flex ">
                    <button className="btn text-3xl" onClick={() => setMic(a => !a)}>
                        {micOn ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}
                    </button>
                    <button className="btn text-3xl" onClick={() => setCamera(a => !a)}>
                        {cameraOn ? <FiCamera /> : <FiCameraOff />}
                    </button>
                    <button className="btn text-4xl" onClick={handleScreenSharing}>
                        {screenSharing ? <MdOutlineScreenShare className='text-primary' /> : <MdOutlineScreenShare className='text-white' />}
                    </button>

                    <button id="endConnection" className='rounded-2xl w-16 h-8 flex justify-center items-center my-auto bg-red-600 text-white'
                        onClick={() => {
                            setActiveConnection(false);
                            // navigate('/');
                        }}> <MdCallEnd />
                    </button>
                </div>
            </div>
        </>
    )
}

export default DesignHost