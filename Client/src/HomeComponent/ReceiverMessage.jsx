const ReceiverMessage = ({ image, message }) => {
    return (
        <div>
            <div className='bg-green-300 w-fit p-1.5 rounded-r-lg rounded-bl-lg relative left-2 mr-auto'>
                {image && <img src={image} onClick={() => window.open(image , "_blank")} className='cursor-pointer h-50 w-50 rounded-md' alt="sent image" />}
                {message && <span>{message}</span>}
            </div>
        </div>
    )
}

export default ReceiverMessage
