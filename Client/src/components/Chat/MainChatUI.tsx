import React, { useEffect, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "../../components/ui/dialog";
import axiosInstance from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const ChatWidget:React.FC = ({isChatOpen,hostId,onClose,chatId,socket}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [userChatId, setUserChatId] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [chats,setChats] = useState<[object]|null>([])

  const userId = useSelector((state:RootState)=>state.userDetails.userId)

  const handleSendMessage = (receiver) => {
    if (message.trim()) {
        setMessage('');
      axiosInstance.post('/chat/sendmessage',{
        content:message,
        senderId:userId,
        chatId:userChatId
      }).then(res=>{
        if(res.data){
            socket.emit('message',res.data)
            setMessages([...messages,res.data])
        }
      })
    }
  };

    useEffect(()=>{  
    if(userId && isOpen){  
      socket.emit('setup',userId)
      socket.on('connection',()=>{
        setSocketConnected(true)
      })

      socket.on('get-users',(users)=>{        
        setActiveUsers(users)
      })
    }else{
      socket.emit('offline')
    }
  },[isOpen,userId])

  useEffect(()=>{
    setIsOpen(isChatOpen)
    setUserChatId(chatId)
  },[isChatOpen,userId,chatId])

  useEffect(()=>{
    if(isOpen){
        axiosInstance.get('/chat/getchat',{
            params:{
                userId
            }
        })
        .then(res=>{
            if(res.data){
                setChats(res.data)                
            }
        })
    }
    
  },[isOpen,userId])

  useEffect(()=>{
    if(hostId){
       chats?.find((chat)=>{
        const id = chat.users[0]._id.toString()
        if(id === hostId){
            setSelectedUser(chat.users[0])
        }
       })
    }
  },[hostId,chats])
  

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose();
    }
    onClose();

  }

  const handleUserSelection = (chat:string) => {    
    setUserChatId(chat._id)
    setSelectedUser(chat.users[0])
  }

  const fetchMessages = async() => {
    if(!selectedUser) return

    try {
        const{data} = await axiosInstance.get('/chat/getallmessage',{
            params:{
                userChatId
            }
        })

        setMessages(data)
        socket.emit('join chat',userChatId)
        
    } catch (error) {
        console.error('erron while fetching message',error);
        
    }
  }

  useEffect(()=>{
    fetchMessages()    
  },[selectedUser])

  useEffect(()=>{
    socket.on('message received',(message) => {            
        setMessages([...messages,message])
    })
  })

  

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-4xl p-0">
          <div className="flex h-[500px]">
            <div className="w-64 border-r bg-gray-50">
              <div className="p-4 border-b bg-white">
                <h2 className="font-semibold">Connections</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-60px)]">
                {chats?.map(user => (
                  <div
                    key={user.users[0]._id}
                    onClick={() => handleUserSelection(user)}
                    className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-colors
                      ${selectedUser?.id === user.users[0]._id ? 'bg-blue-50' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${activeUsers.some(activeUser=>activeUser.userId === user.users[0]._id) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="truncate">{user?.users[0].name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {!selectedUser ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select user to chat
                </div>
              ) : (
                <>
                  <div className="p-4 border-b flex items-center justify-between bg-white">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${activeUsers.some(user=>user.userId === selectedUser._id) ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="font-semibold">{selectedUser.name}</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {(messages?.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender._id === userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.sender._id === userId ? 'bg-red-500 text-white' : 'bg-gray-100'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    )))}
                  </div>

                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSendMessage(selectedUser._id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatWidget;