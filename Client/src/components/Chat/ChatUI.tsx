import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ChatUI: React.FC = ({ isChatOpen, onClose,socket,hostId }) => {
  const [isOpen, setIsOpen] = useState(isChatOpen);
  const [message,setMessage] = useState('')
  const userName = useSelector((state:RootState)=>state.auth.user)
  const userId = useSelector((state:RootState)=>state.userDetails.userId)
  useEffect(() => {
    setIsOpen(isChatOpen);
  }, [isChatOpen]);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose();
    }
  };

  // useEffect(()=>{
  //   if(userId){
  //     socket.emit('setup',{
  //       userId:userId,
  //       hostId:hostId,
  //     })
  //   }
  // },[userId,socket])

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', {
        userId:userId,
        hostId:hostId,
        text: message,
        name: userName,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage('');
  };

  console.log('user',userName);
  console.log('message',message);
  console.log('socket',socket);
  

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent>
        <div className="flex flex-col h-full bg-white shadow-lg rounded-lg w-80">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-red-400 text-white rounded-t-lg">
            <h5 className="text-lg">Chat</h5>
          </div>

          {/* Chat messages */}
          {/* <div className="flex-1 overflow-y-auto p-3">
            <div className="flex items-start space-x-2 mb-4">
              <img
                src="https://via.placeholder.com/40"
                alt="avatar 1"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="bg-gray-200 p-2 rounded-md text-sm">Hi</p>
                <p className="bg-gray-200 p-2 rounded-md text-sm mt-1">
                  How are you ...???
                </p>
                <p className="bg-gray-200 p-2 rounded-md text-sm mt-1">
                  What are you doing tomorrow?
                </p>
                <p className="text-xs text-gray-500 mt-1">23:58</p>
              </div>
            </div> */}

            {/* Time indicator */}
            {/* <div className="text-center my-4 text-gray-400">Today</div>

            <div className="flex items-end justify-end space-x-2 mb-4">
              <div>
                <p className="bg-blue-500 text-white p-2 rounded-md text-sm">
                  I'm good.
                </p>
                <p className="bg-blue-500 text-white p-2 rounded-md text-sm mt-1">
                  How are you?
                </p>
                <p className="bg-blue-500 text-white p-2 rounded-md text-sm mt-1">
                  Free on Sunday.
                </p>
                <p className="text-xs text-gray-500 mt-1 text-right">00:06</p>
              </div>
              <img
                src="https://via.placeholder.com/40"
                alt="avatar 2"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div> */}

          {/* Input area */}
          <div className="fixed bottom-5  w-80 flex items-center p-3 bg-gray-100 rounded-b-lg">
            {/* <img
              src="https://via.placeholder.com/40"
              alt="avatar 3"
              className="w-10 h-10 rounded-full"
            /> */}
            <input
              type="text"
              className="flex-1 p-2 mx-2 border border-gray-300 rounded-lg focus:outline-none"
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              placeholder="Type message"
            />
            <button className="rounded-xl bg-red-400 px-4 py-2" onClick={handleSendMessage}><FontAwesomeIcon icon={faPaperPlane} className="text-white"/></button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatUI;
