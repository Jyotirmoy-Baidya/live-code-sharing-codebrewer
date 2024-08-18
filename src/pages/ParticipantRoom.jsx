import React from 'react'
import { useParams } from 'react-router-dom'

const ParticipantRoom = () => {
    const { roomid } = useParams();
    console.log(roomid);
    return (
        <div>ParticipantRoom</div>
    )
}

export default ParticipantRoom