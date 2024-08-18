import React, { useState, useEffect } from 'react';
import AgoraRTM from 'agora-rtm-sdk';

const RealTimeChat = ({ appId, roomid, userId, setDisconnectRtm, setQuestionBlock, setSharingQuestion, setQuestionid, questionid }) => {
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');



    useEffect(() => {
        const initRTM = async () => {
            const rtmClient = AgoraRTM.createInstance(appId);
            setClient(rtmClient);

            await rtmClient.login({ uid: userId });

            const rtmChannel = rtmClient.createChannel(roomid);
            await rtmChannel.join();

            setChannel(rtmChannel);
            async function disconnect() {
                try {
                    await rtmClient.logout();
                    console.log('RTM client logged out successfully.');
                } catch (error) {
                    console.error('Failed to logout from RTM:', error);
                }
            }
            window.addEventListener('beforeunload', disconnect);


            rtmChannel.on('ChannelMessage', ({ text = '' }, senderId) => {
                let messageData = {};

                try {
                    messageData = JSON.parse(text);
                } catch (error) {
                    console.error('Failed to parse message', error);
                    return;
                }

                const { editor = '', text: parsedText = '', questionid = '', setQuestion = false } = messageData;

                if (parsedText !== '') {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { senderId, text: parsedText },
                    ]);
                }

                if (editor !== '') {
                    setEditorBoxData(editor);
                }

                if (questionid != '') {
                    setQuestionBlock(true);
                    console.log("questionsent " + questionid);
                    setSharingQuestion(true);
                    setQuestionid(questionid);
                    localStorage.setItem('quesid', questionid);
                }

            });


        };




        initRTM();

        return () => {
            if (channel) channel.leave();
            if (client) client.logout();
        };
    }, [appId, roomid, userId]);

    //old
    // const sendMessage = async () => {
    //     if (inputMessage.trim() === '') return;

    //     await channel.sendMessage({ text: inputMessage });
    //     setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { senderId: userId, text: inputMessage },
    //     ]);
    //     setInputMessage('');
    // };

    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        // Send the message as a JSON string
        await channel.sendMessage({ text: JSON.stringify({ text: inputMessage }) });

        // Update the local message state
        setMessages((prevMessages) => [
            ...prevMessages,
            { senderId: userId, text: inputMessage },
        ]);

        // Clear the input field
        setInputMessage('');
    };

    const [editorData, setEditorData] = useState("");
    const [editorBoxData, setEditorBoxData] = useState("");
    const sendEditorData = async (editorMsg) => {
        // Trim the message and check if it's empty
        if (editorMsg.trim() === '') return;

        // Send the message as a JSON string
        await channel.sendMessage({ text: JSON.stringify({ editor: editorMsg }) });
    }

    useEffect(() => {
        console.log("sending question");
        if (questionid != '') {
            const sendQuestionStatus = async () => {
                if (localStorage.getItem('questionid')) {
                    const quesid = localStorage.getItem('questionid');
                    console.log("seding QUestion" + quesid);
                    const c = await channel.sendMessage({ text: JSON.stringify({ questionid: questionid }) });
                    console.log(c);
                }
            }

            sendQuestionStatus();
        }
    }, [questionid])




    return (
        <div>
            <div className='text-white'>
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.senderId}:</strong> {message.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage();
                }}
                placeholder="Type your message here..."
            />
            <button className='bg-white' onClick={sendMessage}>Send</button>

            <div className='bg-primary text-black'>
                <input
                    type="text"
                    value={editorData}
                    onChange={(e) => { setEditorData(e.target.value); sendEditorData(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                    placeholder="Type your Editor..."
                />
                <button className='bg-white' onClick={sendMessage}>Send</button>

                <div className='text-white bg-primary-black'>{editorBoxData}</div>
            </div>
        </div>
    );
};

export default RealTimeChat;
