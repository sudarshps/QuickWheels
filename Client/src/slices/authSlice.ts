import { createSlice,PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
    userId:string | null;
    user:string | null;
    email:string | null;
    profileUpdated:Boolean,
    isHost:Boolean,
    role:string[]
}



const initialState:AuthState = {
    userId:null,
    user:null,
    email:null,
    profileUpdated:false,
    isHost:false,
    role:[]
} 


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials:(state,action:PayloadAction<{userName:string,email:string,profileUpdated:boolean,isHost:boolean,role:string[]}>)=> {
            const {userName,email,profileUpdated,isHost,role} = action.payload
            state.user = userName
            state.email = email
            state.profileUpdated = profileUpdated
            state.isHost = isHost
            state.role = role
        },
        setAuthorization:(state,action:PayloadAction<{userId:string,profileUpdated:boolean,isHost:boolean,verifiedUser:boolean}>)=>{            
            const{profileUpdated,isHost,userId} = action.payload
            state.profileUpdated = profileUpdated
            state.isHost = isHost
            state.userId = userId
        },
        logOut:(state,action)=>{
            state.userId = null
            state.user = null
            state.email = null
            state.profileUpdated = false
            state.isHost = false
            state.role = []
        }
    }

})


export const {setCredentials,setAuthorization,logOut} = authSlice.actions
export default authSlice.reducer

