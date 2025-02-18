import React, { useState, useEffect } from 'react';
import AgoraRTM from 'agora-rtm-sdk';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsFillSendFill } from 'react-icons/bs';



const RealTimeChat = ({ appId, roomid, userId, setQuestionBlock, setSharingQuestion, setQuestionid, questionid, messages, setMessages, editorData, setEditorData, editorBoxData, setEditorBoxData }) => {
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);
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
                console.log(messageData);
                const { editor = '', text: parsedText = '', questionid = '', setQuestion = false } = messageData;
                console.log("run");
                if (parsedText !== '') {
                    console.log("check 11");
                    const msgs = messages.concat({ senderId, text: parsedText });
                    console.log(msgs);
                    setMessages(msgs);
                }

                if (editor !== '') {
                    console.log("jyoti");
                    setEditorBoxData(editor);
                }

                if (questionid != '') {
                    setQuestionBlock(true);
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



    const sendChatToChannel = async () => {
        if (inputMessage.trim() === '') return;

        // Send the message as a JSON string
        await channel.sendMessage({ text: JSON.stringify({ text: inputMessage }) });

        // // Update the local message state
        setMessages([
            ...messages,
            { senderId: userId, text: inputMessage },
        ]);

        // Clear the input field
        setInputMessage('');
    };

    let sendEditorData;
    useEffect(() => {
        if (editorData != '') {

            sendEditorData = async (editorMsg) => {
                // Trim the message and check if it's empty
                if (editorMsg.trim() === '') return;
                console.log(editorMsg);

                // Send the message as a JSON string
                await channel.sendMessage({ text: JSON.stringify({ questionid: questionid, setQuestion: true, editor: editorMsg }) });
            }

            sendEditorData(editorData)
        }

    }, [editorData])


    useEffect(() => {
        console.log("sending question");
        if (questionid != '') {
            const sendQuestionStatus = async () => {
                if (localStorage.getItem('questionid')) {
                    const quesid = localStorage.getItem('questionid');
                    console.log("seding QUestion" + quesid);
                    const c = await channel.sendMessage({ text: JSON.stringify({ questionid: questionid, setQuestion: true }) });
                    console.log(c);
                }
            }

            sendQuestionStatus();
        }
    }, [questionid])


    // Messsage Pop Up 
    const [showMessage, setShowMessage] = useState(false);

    return (
        <>
            <div className='fixed bottom-6 right-6 bg-white p-3 rounded-full'
                onClick={() => { setShowMessage(true); }}>
                <AiOutlineMessage className='text-4xl' />
            </div>
            {/* message box   */}
            {showMessage &&
                <div className="fixed bottom-4 right-4 w-80 max-h-[36rem] p-4 bg-gray-800 text-white rounded-lg shadow-lg ">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold">Meeting Chats</h4>
                        <button onClick={() => setShowMessage(false)} className="text-lg font-bold focus:outline-none">&times;</button>
                    </div>
                    <div className="bg-primary-black mb-3 flex flex-col h-[28rem] design-scrollbar gap-2 overflow-scroll p-1 rounded-md">
                        {messages.map((chat, index) => (
                            <div key={index} className="p-2 bg-gray-700 rounded-lg">
                                <strong>{chat.senderId}:</strong> <span>{chat.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className='input-message flex w-full gap-1'>
                        <input type="text" className='rounded-full font-medium bg-gray-300 w-full text-gray-700 outline-none py-2 px-3 text-sm' name="" id="" value={inputMessage} onChange={(e) => { setInputMessage(e.target.value) }} />
                        <button className='p-2 rounded-full my-auto flex justify-center items-center bg-primary text-black ' onClick={() => sendChatToChannel()}>
                            <BsFillSendFill />
                        </button>
                    </div>
                </div>
            }

        </>
    );
};

export default RealTimeChat;
