import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from "./Component/Signup"
import Login from './Component/Login'
import Profile from './Component/Profile'
import { useDispatch, useSelector } from 'react-redux'
import Home from './Component/Home'
import Logout from './Component/Logout'
import { useEffect } from 'react'
import FetchCurrentUser from './FindCurrentUser/GetCurrentUser'
import { io } from "socket.io-client"
import { setOnlineUser, setSocket } from './Redux/UserSlice'
import { SERVER_URL } from './main'

function App() {

  const dispatch = useDispatch();
  const { userdata, isLoading } = useSelector(state => state.user || {});

  useEffect(() => {
    dispatch(FetchCurrentUser());
  }, []);

  useEffect(() => {
    if (userdata?.user) {
      // Connect Socket To Backend
      const socketIo = io(`${SERVER_URL}`, {
        query: {
          userId: userdata?.user?._id
        }
      });

      dispatch(setSocket(socketIo));

      socketIo.on("getOnlineUser", (onUsers) => {
        dispatch(setOnlineUser(onUsers));
      })

      return () => {
        socketIo.close();
      }
    }
  }, [userdata?.user?._id])


  if (isLoading) {
    return <div className='animate-pulse flex flex-col h-[100vh] items-center justify-center bg-green-100'><p className='font-extrabold text-2xl text-green-800 font-serif'>Loading<span className='animate-ping'>...</span></p></div>
    // return <div className='flex'>
    //   <div className='lg:w-[30%] w-[100vw] h-full bg-green-100 overflow-hidden '>

    //     <div className='h-[250px] p-5 bg-green-200 rounded-bl-[100px] rounded-br-[100px] flex flex-col gap-4 '>
    //       <div className='flex gap-0.5'>
    //         <img className="rounded-full bg-white p-3.5" />
    //         <h1 className='text-xl font-bold text-black w-35 rounded-full h-6.5 bg-white'></h1>
    //       </div>

    //       <div className='mb-[15px] flex items-center justify-between gap-1'>
    //         <h1 className='text-xl font-bold text-black w-70 rounded-full h-10 bg-green-50 animate-pulse'></h1>
    //         <img className="h-11 w-11 rounded-full bg-green-50 ml-10 p-5.5 animate-pulse" />
    //       </div>

    //       <div className='flex gap-2 mt-[-10px]'>
    //         <div className='flex flex-col items-center gap-1'><img className="h-11 w-11 rounded-full bg-white  p-5.5 animate-pulse" /> <h1 className='w-10 h-3 rounded-full bg-white animate-pulse'></h1></div>
    //         <div className='flex flex-col items-center gap-1'><img className="h-11 w-11 rounded-full bg-white  p-5.5 animate-pulse" /> <h1 className='w-10 h-3 rounded-full bg-white animate-pulse'></h1></div>
    //         <div className='flex flex-col items-center gap-1'><img className="h-11 w-11 rounded-full bg-white  p-5.5 animate-pulse" /> <h1 className='w-10 h-3 rounded-full bg-white animate-pulse'></h1></div>
    //         <div className='flex flex-col items-center gap-1'><img className="h-11 w-11 rounded-full bg-white  p-5.5 animate-pulse" /> <h1 className='w-10 h-3 rounded-full bg-white animate-pulse'></h1></div>
    //         <div className='flex flex-col items-center gap-1'><img className="h-11 w-11 rounded-full bg-white  p-5.5 animate-pulse" /> <h1 className='w-10 h-3 rounded-full bg-white animate-pulse'></h1></div>

    //       </div>
    //     </div>

    //     <div className='h-[60vh] w-full overflow-auto scroll-smooth mt-3 mb-3 outline-0 flex flex-col gap-1'>
    //       <p className='bg-green-200 h-15 w-[96%] ml-2 rounded-full border-green-300 border-b-1 flex items-center gap-2'><img className="h-11 w-11 rounded-full bg-white ml-2 p-5.5 animate-pulse" />    <h1 className='text-xl font-bold mt-[-15px] text-black w-40 rounded-full h-6 bg-white animate-pulse '></h1>  </p>
    //       <p className='bg-green-200 h-15 w-[96%] ml-2 rounded-full border-green-300 border-b-1 flex items-center gap-2'><img className="h-11 w-11 rounded-full bg-white ml-2 p-5.5 animate-pulse" />    <h1 className='text-xl font-bold mt-[-15px] text-black w-40 rounded-full h-6 bg-white animate-pulse '></h1>  </p>
    //       <p className='bg-green-200 h-15 w-[96%] ml-2 rounded-full border-green-300 border-b-1 flex items-center gap-2'><img className="h-11 w-11 rounded-full bg-white ml-2 p-5.5 animate-pulse" />    <h1 className='text-xl font-bold mt-[-15px] text-black w-40 rounded-full h-6 bg-white animate-pulse '></h1>  </p>
    //       <p className='bg-green-200 h-15 w-[96%] ml-2 rounded-full border-green-300 border-b-1 flex items-center gap-2'><img className="h-11 w-11 rounded-full bg-white ml-2 p-5.5 animate-pulse" />    <h1 className='text-xl font-bold mt-[-15px] text-black w-40 rounded-full h-6 bg-white animate-pulse '></h1>  </p>
    //       <p className='bg-green-200 h-15 w-[96%] ml-2 rounded-full border-green-300 border-b-1 flex items-center gap-2'><img className="h-11 w-11 rounded-full bg-white ml-2 p-5.5 animate-pulse" />    <h1 className='text-xl font-bold mt-[-15px] text-black w-40 rounded-full h-6 bg-white animate-pulse'></h1>  </p>
    //       <p className='bg-green-200 h-15 w-[96%] ml-2 rounded-full border-green-300 border-b-1 flex items-center gap-2'><img className="h-11 w-11 rounded-full bg-white ml-2 p-5.5 animate-pulse" />    <h1 className='text-xl font-bold mt-[-15px] text-black w-40 rounded-full h-6 bg-white animate-pulse'></h1>  </p>
    //       <p className='bg-green-200 h-15 w-[96%] ml-2 rounded-full border-green-300 border-b-1 flex items-center gap-2'><img className="h-11 w-11 rounded-full bg-white ml-2 p-5.5 animate-pulse" />    <h1 className='text-xl font-bold mt-[-15px] text-black w-40 rounded-full h-6 bg-white animate-pulse '></h1>  </p>
    //       <p className='bg-green-200 h-15 w-[96%] ml-2 rounded-full border-green-300 border-b-1 flex items-center gap-2'><img className="h-11 w-11 rounded-full bg-white ml-2 p-5.5 animate-pulse" />    <h1 className='text-xl font-bold mt-[-15px] text-black w-40 rounded-full h-6 bg-white animate-pulse'></h1>  </p>
    //     </div>

    //     <div className='h-25 bg-green-200 flex gap-2 pt-2 pl-4'>
    //       <img className="h-11 w-11 rounded-full bg-white p-5.5" />
    //       <h1 className='text-xl font-bold text-black w-90 rounded-full h-7 mt-2 bg-white'></h1>
    //     </div>
    //   </div>

    //   <div className='lg:w-[70%] border-l-1 border-green-300 lg:flex hidden h-[100vh] bg-green-100 flex-col justify-between'>

    //     <div className='flex items-center gap-2 relative bg-green-200 h-15 border-b-1 border-green-300 rounded-b-2xl animate-pulse'>
    //       <img className="h-11 w-11 rounded-full bg-green-50 ml-10 p-5.5 animate-pulse" />
    //       <h1 className='text-xl font-bold text-black mt-[-15px] w-40 rounded-full h-5 bg-green-50 animate-pulse'></h1>
    //     </div>

    //     <div className='flex items-center justify-center ml-2 mr-2 relative'>
    //       <input type="text" className=' w-full outline-0 mb-4 py-3 border-green-300 border-1 bg-green-200 bg-green-100 rounded-full p-5' />
    //     </div>
    //   </div>
    // </div>
  }

  const router = createBrowserRouter([
    {
      path: "/signup",
      element:
        <div>
          {
            !userdata ? <Signup /> : <Profile />
          }
        </div>
    },

    {
      path: "/login",
      element:
        <div>
          {
            !userdata ? <Login /> : <Home />
          }
        </div>
    },

    {
      path: "/profile",
      element:
        <div>
          {
            userdata ? <Profile /> : <Login />
          }
        </div>
    },

    {
      path: "/",
      element:
      <div>
        {
          userdata ? <Home /> : <Login />
        }
      </div>
    },

    {
      path: "/logout",
      element:
        <div>
          {
            userdata ? <Logout /> : <Login />
          }
        </div>
    }
  ])

  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
