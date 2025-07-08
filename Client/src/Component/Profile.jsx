import axios from 'axios';
import { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserdata } from '../Redux/UserSlice';
import { SERVER_URL } from '../main';

const Profile = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Userdata = useSelector(state => state.user.userdata);

    const [fullName, setfullName] = useState(Userdata?.user?.fullName);
    const [frontendImage, setfrontendImage] = useState(Userdata?.user?.image);
    const [backendImage, setbackendImage] = useState("");
    const [loading, setloading] = useState(false);
    const image = useRef();

    function handleImageUpload(e) {
        const file = e.target.files[0];
        setbackendImage(file);
        setfrontendImage(URL.createObjectURL(file));
    }

    function handleReturnHome() {
        if (Userdata.user.fullName !== "") {
            navigate("/");
        }
        else {
            navigate('/profile');
            toast.error("Please Enter Your Name...");
        }
    }

    const saveProfile = async () => {
        setloading(true);

        try {
            if (fullName === "") {
                setloading(false);
                toast.error("Please Enter Your Name...");
                return;
            }

            let formData = new FormData();
            formData.append("fullName", fullName);

            if (backendImage) {
                formData.append("image", backendImage);
            }

            let result = await axios.put(`${SERVER_URL}/api/user/edit`, formData, { withCredentials: true });
            dispatch(setUserdata(result.data));

            navigate("/");
            toast.success("Profile Save Successfull...");
            setloading(false);
        }

        catch (err) {
            console.log("Profile Error :", err.message);
            setloading(false);
        }
    }

    return (
        <div className='bg-green-100 h-[100vh] w-[100vw] flex flex-col justify-center items-center gap-5'>
            <div className=' flex justify-center items-center relative'>
                <img src="backArrow.png" className="fixed h-8 w-7 top-2 left-2 cursor-pointer" onClick={handleReturnHome} />
                <div className='rounded-full bg-white shadow-lg border-4 border-green-800 relative flex justify-center items-center'>
                    <div className='sm:w-[200px] sm:h-[200px] h-[170px] w-[170px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
                        <img src={frontendImage || "ChatlyDp.png"} className="overflow-hidden sm:w-[200px] sm:h-[200px] h-[170px] w-[170px] " onClick={() => window.open(frontendImage, "_blank")} />
                    </div> 

                    {/* Handle Upload Image */}
                    <div>
                        <input type="file" accept="image/*" ref={image} onChange={handleImageUpload} hidden src='camera.png' />
                        <img src="camera.png" className='absolute sm:bottom-2 bottom-1 right-3 sm:h-[40px] sm:w-[40px] h-[35px] w-[35px] border-2 border-green-800 cursor-pointer rounded-full p-0.5 bg-green-100' onClick={() => image.current.click()} />
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-5 items-center'>
                <input type="text" value={fullName} className='p-2 border-2 border-green-800 rounded-lg shadow-lg sm:w-100 w-70' placeholder='Enter Your Name...' onChange={(e) => setfullName(e.target.value)} />
                <input type="text" value={Userdata?.user.userName || ''} className='p-2 border-2 border-green-800 rounded-lg shadow-lg sm:w-100 w-70 opacity-50' readOnly />
                <input type="email" value={Userdata?.user.email || ''} className='p-2 border-2 border-green-800 rounded-lg shadow-lg sm:w-100 w-70 opacity-50' readOnly />
                <button className='p-2 rounded-lg shadow-lg w-30  bg-green-800 hover:shadow-2xl text-white hover:bg-green-600 transition-all duration-500' disabled={loading} onClick={saveProfile}>{loading ? "Saving..." : "SaveProfile"}</button>
            </div>

        </div>
    )
}

export default Profile
