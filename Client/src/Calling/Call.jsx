import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import  store  from "../Store/Store";

export const initiateCall = async (callingType) => {
    const Userdata = store.getState().user.userdata;
    const selectedUser = store.getState().user.selectedUser;

    const userID = Userdata?.user?._id;
    const userName = Userdata?.user?.fullName;
    const appId = 1002596675;
    const serverSecret = "18545322405ce1d5ad560b06e510d974";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        null,
        userID,
        userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.addPlugins({ ZIM });

    // ✅ Send invitation only after room is ready
    try {
        const res = await zp.sendCallInvitation({
            callees: [{
                userID: selectedUser._id,
                userName: selectedUser.fullName
            }],
            callType: callingType,
            timeout: 60,
        });
        console.warn("Call invitation sent:", res);
    } catch (err) {
        console.error("Call error:", err);
    }
};
