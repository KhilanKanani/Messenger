import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import GetOtherUser from '../FindCurrentUser/GetOtherUser';
import { setSelectedUser } from '../Redux/UserSlice';
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from '../HomeComponent/SenderMessage';
import ReceiverMessage from '../HomeComponent/ReceiverMessage';
import axios from 'axios';
import { setMessages } from '../Redux/MessageSlice';
import toast from "react-hot-toast"
import GetMessages from '../FindCurrentUser/GetMessages';
import { SERVER_URL } from '../main';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { initiateCall } from "../Calling/Call";

const Home = () => {

    GetMessages();
    GetOtherUser();

    const [search, setsearch] = useState(false);
    const [SearchTerm, setSearchTerm] = useState("");
    const [showEmoji, setshowEmoji] = useState(false);
    const [input, setinput] = useState("");
    const [frontendImage, setfrontendImage] = useState("");
    const [backendImage, setbackendImage] = useState("");
    const image = useRef();
    const scrollMsgDesktop = useRef(null);
    const scrollMsgMobile = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const Userdata = useSelector(state => state.user.userdata);
    const otherUserData = useSelector(state => state.user.otherUserData);
    const selectedUser = useSelector(state => state.user?.selectedUser);
    const filterData = otherUserData?.user?.filter((otherUser) => otherUser?.fullName.toLowerCase().includes(SearchTerm.toLowerCase()));
    const { messages } = useSelector(state => state.message);
    const { socket, onlineUser } = useSelector(state => state.user);

    useEffect(() => {
        if (scrollMsgDesktop.current) {
            scrollMsgDesktop.current.scrollTop = scrollMsgDesktop.current.scrollHeight
        }
    }, [messages]);

    useEffect(() => {
        if (scrollMsgMobile.current) {
            scrollMsgMobile.current.scrollTop = scrollMsgMobile.current.scrollHeight
        }
    }, [messages]);

    function handleEmojiClick(emojiData) {
        setinput(prevInput => prevInput + emojiData.emoji);
    }

    function handleUploadImage(e) {
        const file = e.target.files[0];
        setbackendImage(file);
        setfrontendImage(URL.createObjectURL(file));
    }

    useEffect(() => {
        socket?.on("newMessage", (msg) => {
            dispatch(setMessages([...messages || [], msg]));
        })

        return () => {
            socket?.off("newMessage");
        }
    }, [messages])

    const handleSendMessage = async () => {
        try {
            let formData = new FormData();

            formData.append("message", input);
            if (backendImage) {
                formData.append("image", backendImage)
            }

            const result = await axios.post(`${SERVER_URL}/api/message/sendMessage/${selectedUser._id}`, formData, { withCredentials: true });
            dispatch(setMessages([...messages || [], result.data?.Messages]));


            setinput("");
            setfrontendImage("");
            setbackendImage("");
        }

        catch (err) {
            console.log("SendMessage Error :", err.message);
        }
    }

    return (
        <div className='w-full h-[100vh] overflow-auto flex'>
            {/* :: SideBar :: */}
            <div className='lg:w-[30%] w-[100%] h-full bg-green-100 overflow-hidden flex flex-col'>
                {/* Top */}
                <div className='outline-0 h-[250px] w-full p-5 bg-green-800 sm:rounded-b-[100px] rounded-b-[80px] flex flex-col'>
                    <div className='mb-[15px] flex items-center gap-1'>
                        <img src="ChatLogo.png" className='h-6.5 w-6' />
                        <p className='text-green-400 text-xl font-bold'>Messenger</p>
                    </div>
                    <div className='flex justify-between w-full items-center gap-5'>
                        <h2 className='text-white text-2xl font-extrabold '>Hey ,<span> {Userdata?.user?.fullName}</span></h2>
                        <img src={Userdata?.user?.image} className='h-10 w-10 cursor-pointer  rounded-full bg-green-800' onClick={() => navigate("/profile")} />
                    </div>

                    <div className='relative w-full cursor-pointer'>
                        <div className='mt-[20px]'>
                            {
                                search && <input type="text" className='p-2.5 pl-11 outline-0 w-full bg-white rounded-full' placeholder='Search User...' onChange={(e) => setSearchTerm(e.target.value)} />
                            }
                        </div>
                        <div>
                            {
                                search && <img src="CrossLogo.jpg" className='absolute top-7.5 right-2 h-6 w-6 rounded-full' onClick={() => (setsearch(false), setSearchTerm(""))} />
                            }
                        </div>
                        <img src="SearchLogo.jpg" className='absolute top-5 h-11 w-11 rounded-full overflow-hidden' onClick={() => setsearch(true)} />
                    </div>

                    <div className='flex gap-2 mt-[-6px] ml-[50px] xl:w-[91%] lg:w-[82%] md:w-[93%] w-[83.5%] overflow-scroll cursor-pointer outline-0'>
                        {
                            !search && otherUserData?.user?.map((otherUser) => (
                                onlineUser?.includes(otherUser?._id) &&
                                <div key={otherUser?._id} className="flex flex-col items-center gap-1 py-2" onClick={() => dispatch(setSelectedUser(otherUser))}>
                                    <div className='relative w-10'>
                                        <img src={otherUser?.image} className=" h-10 w-10 rounded-full" />
                                        {onlineUser && <div className='absolute bottom-0.5 left-7 h-2.5 w-2.5 rounded-full bg-green-500'></div>}
                                    </div>
                                    <p className="text-sm text-gray-300">{otherUser?.userName}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className='h-[70%] flex flex-col justify-between'>
                    {/* Ṃiddle */}
                    <div className='h-full w-full overflow-y-scroll mt-3 mb-3 outline-0'>
                        {
                            filterData?.length > 0 ? filterData.map((user) => {
                                return (
                                    <div key={user?._id} className='rounded-lg cursor-pointer border-b-1 border-green-800 flex items-center justify-between' onClick={() => (dispatch(setSelectedUser(user)), setSearchTerm(""), setsearch(false), setfrontendImage(""), setbackendImage(""), setshowEmoji(false))}>
                                        <div className='relative w-full flex gap-3 items-center border-green-300  rounded-xl duration-300 transition-all p-1.5 m-1 hover:bg-green-300'>
                                            <img src={user?.image} className="h-11 w-11 rounded-full" />
                                            {onlineUser?.includes(user?._id) && <div className='absolute bottom-2 left-9.5 h-3 w-3 rounded-full bg-green-500'></div>}
                                            <h1 className='text-lg mt-[-15px]'>{user?.fullName}</h1>
                                            {/* {
                                            selectedUser &&
                                            <p className='h-6 w-6 absolute right-2 bg-green-500 rounded-full flex justify-center items-center text-xs font-bold'>1</p>
                                        } */}
                                        </div>
                                    </div>
                                )
                            }) : <div className='flex justify-center'><p>User Not Found...</p></div>
                        }
                    </div>

                    {/* Down */}
                    <div className='bg-green-200 w-full flex items-center gap-3 h-17'>
                        <div className='bg-green-300 p-2 h-10 w-10 ml-[8px] rounded-full hover:shadow-2xl shadow-green-900 transition-all duration-400' onClick={() => navigate("/logout")}>
                            <img src="LogoutLogo.jpg" className='h-full w-full cursor-pointer rounded-full' />
                        </div>
                        <p className='opacity-80'>&copy;2025 - Present Kk's Pvt Ltd...</p>
                    </div>
                </div>
            </div>

            {/* :: MessageBar :: */}
            <div className='lg:w-[70%] border-l-1 relative border-green-500 lg:flex hidden h-[100vh] bg-green-50 flex-col justify-between'>
                {/* :: Top :: */}
                <div className=''>
                    {
                        selectedUser ? <div className=' bg-green-200 h-[70px] border-b-1 border-green-500 rounded-b-2xl flex items-center justify-between pr-5 pl-5'>
                            <div className='flex items-center gap-2 relative'>
                                <img src="backArrow.png" className="h-8 w-5 rounded-full cursor-pointer" onClick={() => (dispatch(setSelectedUser(null)), setfrontendImage(""), setshowEmoji(false))} />
                                <img src={selectedUser?.image || "ChatlyDp.png"} className="h-11 w-11 rounded-full bg-white cursor-pointer" onClick={() => window.open(selectedUser?.image, "_blank")} />
                                {onlineUser?.includes(selectedUser?._id) && <div className='absolute bottom-0.5 left-15 h-3 w-3 rounded-full bg-green-500'></div>}
                                <h1 className='text-xl font-bold text-black mt-[-15px]'>{selectedUser?.fullName || "User"}</h1>
                            </div>
                            {/* {
                                selectedUser &&
                                <div className='flex gap-2 '>
                                    <img src="MicroPhone.png" className='h-10 w-10 rounded-full bg-green-300 cursor-pointer' onClick={() => initiateCall(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)} />
                                    <img src="VcameraLogo.png" className='h-10 w-10 rounded-full bg-green-300 cursor-pointer' onClick={() => initiateCall(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)} />
                                </div>
                            } */}
                        </div> : <div className='h-[100vh] border-green-300 bg-green-50 flex flex-col items-center justify-center'>
                            <div className='flex flex-col gap-4'>
                                <h1 className='font-extrabold text-5xl text-green-800'>Welcome To Messenger</h1>
                                <p className='text-lg'>Chat Friendly...</p>
                                <p className='text-lg'>&copy;2025 - Present Kk's Pvt Ltd. All Right Reserved</p>
                            </div>
                        </div>
                    }
                </div>

                {/* :: Messages :: */}
                <div ref={scrollMsgDesktop} className='outline-0 h-[80%] flex flex-col overflow-auto' onClick={() => setshowEmoji(false)}>
                    {
                        messages?.length > 0 && messages?.map(msg => (
                            msg.sender === Userdata?.user?._id ?
                                <SenderMessage key={msg._id} image={msg.image} message={msg.message} /> :
                                <ReceiverMessage key={msg._id} image={msg.image} message={msg.message} />
                        ))
                    }
                </div>

                {/* :: Bottom - Input Area :: */}
                {selectedUser && <div className='relative px-2 py-2.5 flex items-center gap-2 border-t border-green-500 bg-green-100'>
                    <input type="file" accept='image/*' ref={image} onChange={handleUploadImage} hidden />

                    {frontendImage && (
                        <img src={frontendImage} className='h-12 w-12 absolute left-2 bottom-16 bg-green-200' />
                    )}

                    {showEmoji && (
                        <div className='absolute bottom-16 left-2 z-20'>
                            <EmojiPicker width={250} height={350} onEmojiClick={handleEmojiClick} />
                        </div>
                    )}

                    <img src="ImageLogo.png" className='h-6 w-6 cursor-pointer' onClick={() => (image.current.click(), setshowEmoji(false))} />
                    <img src="thinking.png" className='h-10 w-10 p-1 bg-green-200 rounded-full cursor-pointer' onClick={() => setshowEmoji(s => !s)} />

                    <input
                        type="text"
                        placeholder='Type a message...'
                        value={input}
                        onChange={(e) => (setinput(e.target.value), setshowEmoji(false))}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className='flex-1 outline-none px-3 py-2 rounded-md bg-green-100 border border-green-400'
                    />

                    <img src="SendLogo.png" className='h-10 w-10 p-2 rounded-full bg-green-300 cursor-pointer' onClick={handleSendMessage} />
                </div>}
            </div>

            {/* :: MoblieSize */}
            <div className='lg:hidden' >
                {
                    selectedUser &&
                    <div className='h-[100vh] w-[100vw] flex flex-col justify-between bg-green-50'>
                        {/* :: Top - User Info :: */}
                        <div className='flex items-center gap-2 bg-green-200 h-[70px] px-4 border-b border-green-500 z-10'>
                            <img src="backArrow.png" className="h-8 w-5 cursor-pointer" onClick={() => (dispatch(setSelectedUser(null)), setfrontendImage(""), setshowEmoji(false))} />
                            <img src={selectedUser?.image || "ChatlyDp.png"} className="h-11 w-11 rounded-full bg-white cursor-pointer" onClick={() => window.open(selectedUser?.image, "_blank")} />
                            {onlineUser?.includes(selectedUser?._id) && <div className='absolute bottom-0.5 left-15 h-3 w-3 rounded-full bg-green-500'></div>}
                            <h1 className='text-xl font-bold text-black'>{selectedUser?.fullName || "User"}</h1>
                        </div>

                        {/* :: Middle - Scrollable Messages :: */}
                        <div
                            ref={scrollMsgMobile}
                            className='flex-1 overflow-y-auto px-3  py-2'
                            onClick={() => setshowEmoji(false)}
                        >
                            {messages?.length > 0 && messages.map(msg =>
                                msg.sender == Userdata?.user?._id ?
                                    <SenderMessage key={msg._id} image={msg.image} message={msg.message} /> :
                                    <ReceiverMessage key={msg._id} image={msg.image} message={msg.message} />
                            )}
                        </div>

                        {/* :: Bottom - Input Area :: */}
                        <div className='relative px-2 py-2.5 flex items-center gap-2 border-t border-green-500 bg-green-100'>
                            <input type="file" accept='image/*' ref={image} onChange={handleUploadImage} hidden />

                            {frontendImage && (
                                <img src={frontendImage} className='h-12 w-12 absolute left-2 bottom-16 bg-green-200' />
                            )}

                            {showEmoji && (
                                <div className='absolute bottom-16 left-2 z-20'>
                                    <EmojiPicker width={250} height={350} onEmojiClick={handleEmojiClick} />
                                </div>
                            )}

                            <img src="ImageLogo.png" className='h-6 w-6 cursor-pointer' onClick={() => (image.current.click(), setshowEmoji(false))} />
                            <img src="thinking.png" className='h-10 w-10 p-1 bg-green-200 rounded-full cursor-pointer' onClick={() => setshowEmoji(s => !s)} />

                            <input
                                type="text"
                                placeholder='Type a message...'
                                value={input}
                                onChange={(e) => (setinput(e.target.value), setshowEmoji(false))}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className='flex-1 outline-none px-3 py-2 rounded-md bg-green-100 border border-green-400'
                            />

                            <img src="SendLogo.png" className='h-10 w-10 p-2 rounded-full bg-green-300 cursor-pointer' onClick={handleSendMessage} />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Home
