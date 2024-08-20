import React from 'react'
import { AiOutlineAudio, AiOutlineAudioMuted } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';
import { FiCamera, FiCameraOff } from 'react-icons/fi';
import { MdCallEnd, MdOutlineScreenShare } from 'react-icons/md';


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GiCrossMark } from 'react-icons/gi';

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
import ProblemStatementsForVideoConfee from '../ProblemStatementsForVideoConfee';
import RealTimeChat from '../RealTimeChat';
import LiveProblem from './LiveProblem';
import RealTimeChatForParticipant from './RealTimeChatForParticipant';
import LiveProblemForParticipants from './LiveProblemForParticipants';

const ParticipantRoom = ({ roomid, uid }) => {
    const appId = '15b767a0b7dd4fe488826585f7eeb187';
    const { hostuid } = useParams();

    const [activeConnection, setActiveConnection] = useState(true);

    // Conference Controls 
    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);
    const [screenSharing, setScreenSharing] = useState(false);
    const [screenTrack, setScreenTrack] = useState(null);

    //Questionid which is to be displayed
    const [questionid, setQuestionid] = useState("");


    const navigate = useNavigate();


    //Start Comment
    // // Join the channel
    const client1 = useJoin(
        {
            appid: appId,
            channel: roomid,
            token: null,
            uid: uid
        },
        activeConnection,
    );

    console.log(client1);

    // Get local tracks
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);

    // Re-publish tracks when mic or camera state changes
    const tracksToPublish = [localMicrophoneTrack, localCameraTrack].filter(Boolean);

    usePublish(tracksToPublish);

    // Remote users and their audio tracks
    const remoteUsers = useRemoteUsers();
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);

    // Play the remote user audio tracks
    useEffect(() => {
        audioTracks.forEach((track) => track.play());
    }, [audioTracks]);

    // Handle screen sharing

    //End Comment

    // const handleScreenSharing = () => {
    //     setScreenSharing(!screenSharing);
    // }

    //Question Block Datas
    const [questionBlock, setQuestionBlock] = useState(false);
    const [questionPopUp, setQuestionPopUp] = useState(false);
    const [sharingQuestion, setSharingQuestion] = useState(false);

    const [search, setSearch] = useState("");


    const handleQuestionSharing = async () => {
        setSharingQuestion(true);
        setQuestionPopUp(false);
    }

    //Chat Sharing Data
    const [messages, setMessages] = useState([]);
    const [editorData, setEditorData] = useState("");
    const [editorBoxData, setEditorBoxData] = useState("");



    return (
        <>
            <div className={`w-full h-[88%] px-2 gap-2 flex flex-col`}>
                <div className='flex gap-4'>
                    <div id='localVideo' className={`${questionBlock ? 'w-[50%]' : 'w-[60%]'} p-3 ${sharingQuestion ? 'h-[26rem]' : 'h-[31rem]'} rounded-md flex flex-col bg-primary-black design-scrollbar smooth-transition`}>
                        {remoteUsers
                            .filter((user) => user.uid == hostuid) // Replace hostUid with the actual host's UID
                            .map((user) => {
                                console.log("check");
                                return (
                                    <div key={user.uid} className="h-[31rem] flex justify-center items-center remote-video-container rounded-md smooth-transition bg-primary text-white">
                                        <RemoteUser user={user} className="rounded-md h-full bg-red-400" />
                                    </div>
                                )
                            })
                        }
                        {sharingQuestion &&
                            <div className='grid grid-cols-4'>
                                <div className="h-28 flex justify-center items-center remote-video-container rounded-md smooth-transition">
                                    <LocalUser
                                        audioTrack={localMicrophoneTrack}
                                        videoTrack={localCameraTrack}
                                        cameraOn={cameraOn}
                                        micOn={micOn}
                                        playAudio={micOn}
                                        playVideo={cameraOn}
                                        className='camera-video'
                                    />
                                </div>
                                {
                                    remoteUsers.filter((user) => user.uid !== hostuid).map((user) => (
                                        <>
                                            <div key={user.uid} className="h-28 flex justify-center items-center remote-video-container rounded-md smooth-transition">
                                                <RemoteUser user={user} className="rounded-md" />
                                            </div>
                                        </>

                                    ))
                                }
                            </div>
                        }
                        {/* Host Screen  */}

                    </div>
                    <div className='grow'>
                        {/* <button className={`btn flex items-center gap-2 text-white mb-3 border-yellow-500 border hover:shadow-sm  hover:shadow-yellow-500 py-1 px-2 rounded-md ${questionPopUp ? 'w-full' : 'w-60'} flex justify-between video-search-problem-input-block`}>
                            {questionPopUp ?
                                <div className='flex w-full items-center gap-3 relative'>
                                    <input type='text' className='px-2 py-1 w-full bg-transparent cursor-pointer outline-none video-serach-problem-input' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                                    <FaSearch />
                                    <GiCrossMark className='text-red-500 hover:scale-[120%]'
                                        onClick={() => {
                                            if (sharingQuestion === true) {
                                                setQuestionPopUp(false)
                                            }
                                            else {
                                                setQuestionBlock(false);
                                                setQuestionPopUp(false);
                                            }
                                        }} />
                                    {questionPopUp &&
                                        <ProblemStatementsForVideoConfee search={search} handleQuestionSharing={handleQuestionSharing} setQuestionid={setQuestionid} />
                                    }
                                </div>
                                :
                                <div className=' px-2 py-1 w-full flex items-center justify-between' onClick={() => { setQuestionBlock(true); setQuestionPopUp(true) }}>
                                    <div>Search Problem</div>
                                    <FaSearch />
                                </div>
                            }
                        </button> */}
                        {!sharingQuestion &&
                            <div className='h-[27.6rem]  p-2 rounded-md bg-primary-black overflow-scroll design-scrollbar'>

                                <div className={`grid ${questionBlock ? 'grid-cols-4' : 'grid-cols-3'} rounded-md gap-4 h-full smooth-transition`}>
                                    <div className="h-28 flex justify-center items-center remote-video-container rounded-md smooth-transition">
                                        <LocalUser
                                            audioTrack={localMicrophoneTrack}
                                            videoTrack={localCameraTrack}
                                            cameraOn={cameraOn}
                                            micOn={micOn}
                                            playAudio={micOn}
                                            playVideo={cameraOn}
                                            className='camera-video'
                                        />
                                    </div>
                                    {
                                        remoteUsers.filter((user) => user.uid !== hostuid).map((user) => (
                                            <>
                                                <div key={user.uid} className="h-28 flex justify-center items-center remote-video-container rounded-md smooth-transition">
                                                    <RemoteUser user={user} className="rounded-md" />
                                                </div>
                                            </>

                                        ))
                                    }

                                </div>
                            </div>
                        }
                        {sharingQuestion &&
                            <>
                                <div className='h-[27.6rem] flex-col p-2 rounded-md bg-primary-black overflow-scroll design-scrollbar text-white'>
                                    <LiveProblemForParticipants questionid={questionid} editorBoxData={editorBoxData} setEditorBoxData={setEditorBoxData} editorData={editorData} setEditorData={setEditorData} />
                                </div>
                            </>
                        }
                    </div>
                    <RealTimeChatForParticipant appId={appId} roomid={roomid} userId={uid} setQuestionBlock={setQuestionBlock} setSharingQuestion={setSharingQuestion} setQuestionid={setQuestionid} questionid={questionid} messages={messages} setMessages={setMessages} editorBoxData={editorBoxData} setEditorBoxData={setEditorBoxData} editorData={editorData} setEditorData={setEditorData} />
                </div >
                <div id="controlsToolbar" className="gap-10  mx-auto mt-auto mb-4 text-white flex ">
                    <button className="btn text-3xl" onClick={() => setMic(a => !a)}>
                        {micOn ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}
                    </button>
                    <button className="btn text-3xl" onClick={() => setCamera(a => !a)}>
                        {cameraOn ? <FiCamera /> : <FiCameraOff />}
                    </button>

                    <button id="endConnection" className='rounded-2xl w-16 h-8 flex justify-center items-center my-auto bg-red-600 text-white'
                        onClick={() => {
                            setActiveConnection(false);
                            // disconnectRtm();
                            navigate('/');
                        }}> <MdCallEnd />
                    </button>
                </div>
            </div >
        </>
    )
}

export default ParticipantRoom