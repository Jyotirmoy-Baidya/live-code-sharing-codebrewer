import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
import LoginHeader from "./LoginHeader";

const RoomHost = ({ userId }) => {
    const appId = '15b767a0b7dd4fe488826585f7eeb187';
    const roomid = 'jyoti';


    const [activeConnection, setActiveConnection] = useState(true);
    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);
    const [screenSharing, setScreenSharing] = useState(false);
    const [screenTrack, setScreenTrack] = useState(null);

    // const navigate = useNavigate();

    // Join the channel
    const client1 = useJoin(
        {
            appid: appId,
            channel: roomid,
            token: null,
            uid: userId
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

    const [questionBlock, setQuestionBlock] = useState(false);

    return (
        <>
            <div className={`w-full grid ${questionBlock ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div id='remoteVideoGrid' className={`bg-slate-900 grid ${questionBlock ? 'grid-cols-4' : 'grid-cols-8'} h-fit overflow-scroll design-scrollbar`}>
                    {
                        remoteUsers.map((user) => (
                            <>
                                <div key={user.uid} className="h-32 w-32 mx-auto flex justify-center items-center remote-video-container">
                                    <RemoteUser user={user} className="rounded-full" />
                                </div>
                            </>

                        ))
                    }
                </div>
                <div id='localVideo' className="relative h-40 w-60">
                    {!screenSharing &&
                        <LocalUser
                            audioTrack={localMicrophoneTrack}
                            videoTrack={localCameraTrack}
                            cameraOn={cameraOn}
                            micOn={micOn}
                            playAudio={micOn}
                            playVideo={cameraOn}
                            className='camera-video'
                        />
                    }
                    {screenSharing && screenTrack && (
                        <LocalUser
                            videoTrack={screenTrack}
                            cameraOn={true}
                            micOn={false}
                            playVideo={true}
                            className='screen-video'
                        />
                    )}
                    <div>
                        <div id="controlsToolbar" className="text-white">
                            <div id="mediaControls" className="flex">
                                <button className="btn" onClick={() => setMic(a => !a)}>
                                    {micOn ? "Turn Off Mic" : "Turn On Mic"}
                                </button>
                                <button className="btn" onClick={() => setCamera(a => !a)}>
                                    {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
                                </button>
                                <button className="btn" onClick={handleScreenSharing}>
                                    {screenSharing ? "Stop Sharing" : "Share Screen"}
                                </button>
                                <button className="btn" onClick={() => setQuestionBlock(!questionBlock)}>
                                    {questionBlock ? "Close Question" : "Open Question"}
                                </button>
                            </div>
                            <button id="endConnection"
                                onClick={() => {
                                    setActiveConnection(false);
                                    // navigate('/');
                                }}> Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default RoomHost;
