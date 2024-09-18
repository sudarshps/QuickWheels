import { createSlice,PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
    user:string | null;
    email:string | null;
    profileUpdated:Boolean,
    isHost:Boolean
}



const initialState:AuthState = {
    user:null,
    email:null,
    profileUpdated:false,
    isHost:false
} 


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials:(state,action:PayloadAction<{userName:string,email:string,profileUpdated:boolean,isHost:boolean}>)=> {
            const {userName,email,profileUpdated,isHost} = action.payload
            state.user = userName
            state.email = email
            state.profileUpdated = profileUpdated
            state.isHost = isHost
        },
        setAuthorization:(state,action:PayloadAction<{profileUpdated:boolean,isHost:boolean}>)=>{
            const{profileUpdated,isHost} = action.payload
            state.profileUpdated = profileUpdated
            state.isHost = isHost
        },
        logOut:(state,action)=>{
            state.user = null
            state.email = null
            state.profileUpdated = false
            state.isHost = false
        }
    }

})


export const {setCredentials,setAuthorization,logOut} = authSlice.actions
export default authSlice.reducer

