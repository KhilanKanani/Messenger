import { useSelector } from "react-redux";

const SenderMessage = ({ image, message }) => {

    const { selectedUser, onlineUser } = useSelector(state => state.user);

    return (
        <div>
            <div className='bg-green-300 mt-1.5 w-fit p-1.5 rounded-l-lg rounded-br-lg relative right-2 ml-auto'>
                {image && <img src={image} onClick={() => window.open(image, "_blank")} className='cursor-pointer h-50 w-50 rounded-md' alt="sent image" />}
                {message && <span>{message}</span>}
            </div>
            {/* {onlineUser.includes(selectedUser?._id) &&  <p className="text-xs font-sans relative w-fit right-2.5 ml-auto mt-[-3px] text-green-800">seen</p>} */}
        </div >
    );
};

export default SenderMessage;
