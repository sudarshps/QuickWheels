import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    dob:string | null;
    phone:string | null;
    drivingExpDate:string | null;
    address:string | null;
    drivingID:string|null;
    drivingIDFront:string|null;
    drivingIDBack:string|null;
    profileUpdated:boolean | null;
    isHost:boolean | null;
    status:string | null;
}

const initialState:UserState = {
    dob:null,
    phone:null,
    drivingExpDate:null,
    address:null,
    drivingID:null,
    drivingIDFront:null,   
    drivingIDBack:null,
    profileUpdated:false,
    isHost:false,
    status:null
}


const userDetailSlice = createSlice({
    name:'userDetails',
    initialState,
    reducers:{
        setUserDetails:(state,action:PayloadAction<UserState>) => {
            const {dob,phone,drivingExpDate,address,drivingID,drivingIDFront,drivingIDBack,profileUpdated,isHost,status} = action.payload

            state.dob = dob
            state.phone = phone
            state.drivingExpDate = drivingExpDate
            state.address = address
            state.drivingID = drivingID
            state.drivingIDFront = drivingIDFront
            state.drivingIDBack = drivingIDBack
            state.profileUpdated = profileUpdated
            state.isHost = isHost
            state.status = status
        }
    }
})


export const {setUserDetails} = userDetailSlice.actions
export default userDetailSlice.reducer