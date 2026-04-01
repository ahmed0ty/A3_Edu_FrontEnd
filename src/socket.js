import { io } from "socket.io-client";



const socket = io("https://a3-edu.onrender.com", {
  withCredentials: true,
});
export default socket;