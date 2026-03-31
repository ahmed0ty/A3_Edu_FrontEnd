// import { useEffect, useState, useRef } from "react";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";
// import api from "../api/axios";

// const reactionsList = [
//   { type: "like", emoji: "👍" },
//   { type: "love", emoji: "❤️" },
//   { type: "haha", emoji: "😂" },
//   { type: "wow", emoji: "😮" },
//   { type: "sad", emoji: "😢" },
//   { type: "angry", emoji: "😡" },
// ];

// export default function LessonComments({ lessonId, lesson }) {
//   const [comments, setComments] = useState([]);
//   const [content, setContent] = useState("");

//   const [replyText, setReplyText] = useState("");
//   const [activeReplyId, setActiveReplyId] = useState(null);

//   const [editingComment, setEditingComment] = useState(null);
//   const [editContent, setEditContent] = useState("");

//   const [showReactions, setShowReactions] = useState(false);
//   const [selectedComment, setSelectedComment] = useState(null);
//   const [selectedReactionType, setSelectedReactionType] = useState(null);
//   const [showCommentsPanel, setShowCommentsPanel] = useState(false);
//   const [showReactionsPanel, setShowReactionsPanel] = useState(false);

//   const socketRef = useRef(null);

//   // ================= SOCKET INIT =================
//   useEffect(() => {
//     socketRef.current = io("http://localhost:3000");

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, []);

//   const socket = socketRef.current;

//   const token = localStorage.getItem("token");

//   let user = null;
//   if (token) {
//     try {
//       user = JSON.parse(atob(token.split(".")[1]));
//     } catch {}
//   }

//   // ================= FETCH COMMENTS =================
//   const fetchComments = async () => {
//     try {
//       const res = await api.get(`/comments/lesson/${lessonId}`);

//       setComments((res.data?.data?.comments || []).reverse());
//     } catch (err) {
//       console.error(err);
//       setComments([]);

//       if (err.response?.status === 401) {
//         toast.error("Session expired, please login again");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to load comments");
//       }
//     }
//   };

//   // ================= SOCKET + FETCH =================
//   useEffect(() => {
//     if (!lessonId || !socket) return;

//     fetchComments();

//     socket.emit("joinLessonRoom", lessonId);

//     const handleNewComment = (comment) => {
//       setComments((prev) => {
//         const exists = prev.some((c) => c._id === comment._id);
//         if (exists) return prev;
//         return [comment, ...prev];
//       });
//     };

//     const handleReactComment = (updatedComment) => {
//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === updatedComment._id ? updatedComment : c
//         )
//       );
//     };

//     const handleCommentUpdated = (updatedComment) => {
//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === updatedComment._id ? updatedComment : c
//         )
//       );
//     };

//     const handleCommentDeleted = ({ commentId }) => {
//       setComments((prev) =>
//         prev.filter((c) => c._id !== commentId)
//       );
//     };

//     // listeners
//     socket.on("newComment", handleNewComment);
//     socket.on("reactComment", handleReactComment);
//     socket.on("commentUpdated", handleCommentUpdated);
//     socket.on("commentDeleted", handleCommentDeleted);

//     // cleanup
//     return () => {
//       socket.off("newComment", handleNewComment);
//       socket.off("reactComment", handleReactComment);
//       socket.off("commentUpdated", handleCommentUpdated);
//       socket.off("commentDeleted", handleCommentDeleted);

//       socket.emit("leaveLessonRoom", lessonId);
//     };
//   }, [lessonId, socket]);
//   // ================= ADD =================import api from "../api/axios"; // 👈 مهم

// const addComment = async () => {
//   if (!content.trim()) return;

//   const currentContent = content.trim();
// if (!currentContent) return;
//   setContent(""); // ✅ امسحه فورًا (optimistic UI)

//   try {
//     const res = await api.post(`/comments/${lessonId}`, {
//       content: currentContent,
//     });

//     const newComment =
//       res.data?.comment || res.data?.data?.comment;

//     if (!newComment) return;

//     setComments((prev) => {
//       const exists = prev.some((c) => c._id === newComment._id);
//       if (exists) return prev;
//       return [newComment, ...prev];
//     });

//   } catch (err) {
//     console.error(err);

//     // ❗ رجّع الكلام لو حصل error
//     setContent(currentContent);

//     if (err.response?.status === 401) {
//       toast.error("Session expired, please login again");
//     } else {
//       toast.error("Something went wrong");
//     }
//   }
// };

//   // ================= DELETE =================
//  const deleteComment = async (id) => {
//   try {
//     await api.delete(`/comments/${id}`);

//     // ✅ حذف من الـ UI مباشرة (optimistic update)
//     // setComments((prev) => prev.filter((c) => c._id !== id));
//     // socket.on("commentDeleted", handleDelete);

//   } catch (err) {
//     console.error(err);

//     if (err.response?.status === 401) {
//       toast.error("Session expired, please login again");
//     } else {
//       toast.error(err.response?.data?.message || "Failed to delete comment");
//     }
//   }
// };
//   // ================= EDIT =================
// const saveEdit = async () => {
//   if (!editingComment?._id) return;

//   try {
//     const res = await api.patch(`/comments/${editingComment._id}`, {
//       content: editContent,
//     });

//     const updatedComment =
//       res.data?.comment || res.data?.data?.comment;

//     // ✅ تحديث مباشر في الـ UI
//     if (updatedComment) {
//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === updatedComment._id ? updatedComment : c
//         )
//       );
//     }

//     setEditingComment(null);

//   } catch (err) {
//     console.error(err);

//     if (err.response?.status === 401) {
//       toast.error("Session expired, please login again");
//     } else {
//       toast.error(err.response?.data?.message || "Failed to update comment");
//     }
//   }
// };

//   // ================= REACT =================
//   const reactWithType = async (commentId, type) => {
//   try {
//     const res = await api.patch(`/comments/${commentId}/react`, {
//       type,
//     });

//     const updatedComment =
//       res.data?.comment || res.data?.data?.comment;

//     // ✅ تحديث مباشر في الـ UI
//     if (updatedComment) {
//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === updatedComment._id ? updatedComment : c
//         )
//       );
//     }

//   } catch (err) {
//     console.error(err);

//     if (err.response?.status === 401) {
//       toast.error("Session expired, please login again");
//     } else {
//       toast.error(err.response?.data?.message || "Failed to react");
//     }
//   }
// };

//   // ================= REPLY =================
//   const sendReply = async (commentId) => {
//   if (!replyText.trim()) return;

//   const currentReply = replyText;
//   setReplyText("");

//   try {
//     const res = await api.patch(`/comments/${commentId}/reply`, {
//       reply: currentReply,
//     });

//     const updatedComment =
//       res.data?.comment || res.data?.data?.comment;

//     // ✅ تحديث مباشر للـ UI
//     if (updatedComment) {
//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === updatedComment._id ? updatedComment : c
//         )
//       );
//     }

//     setActiveReplyId(null);

//   } catch (err) {
//     console.error(err);

//     // ❗ رجّع الريپلاي لو حصل خطأ
//     setReplyText(currentReply);

//     if (err.response?.status === 401) {
//       toast.error("Session expired, please login again");
//     } else {
//       toast.error(err.response?.data?.message || "Failed to send reply");
//     }
//   }
// };
//   // ================= HELPERS =================
//   const getUserReaction = (reactions = []) => {
//   return reactions.find((r) => r.user?._id === user?.id);
// };
//   const getReactionCounts = (reactions = []) => {
//     const counts = {};
//     reactions.forEach((r) => {
//       counts[r.type] = (counts[r.type] || 0) + 1;
//     });
//     return counts;
//   };

//   const getReactionEmoji = (type) =>
//     reactionsList.find((r) => r.type === type)?.emoji || "👍";

//   // ================= UI =================
// if (!lessonId) return null;

// if (!lesson || (lesson.type !== "video")) {
//   return null;
// }
// return (
//   <>

//     {/* 🎥 VIDEO (مكان الفيديو عندك) */}
//     {/* <video src={videoUrl} controls /> */}

//     {/* 💬 BUTTON UNDER VIDEO */}
//     <div className="flex justify-center mt-4">
//       <button
//         onClick={() => setShowCommentsPanel(true)}
//         className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-full text-lg shadow-lg flex items-center gap-2"
//       >
//         💬 Comments
//       </button>
//     </div>

//     {/* OVERLAY */}
//     {showCommentsPanel && (
//       <div
//         className="fixed inset-0 bg-black/50 z-50"
//         onClick={() => setShowCommentsPanel(false)}
//       />
//     )}

//     {/* SLIDE UP PANEL */}
//     <div
//       className={`fixed bottom-0 left-0 w-full bg-[#18191a] text-white rounded-t-2xl shadow-2xl z-50 transform transition-transform duration-300 ${
//         showCommentsPanel ? "translate-y-0" : "translate-y-full"
//       }`}
//     >

//       <div className="max-w-3xl mx-auto p-5 flex flex-col h-[85vh]">

//         {/* HEADER */}
//         <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
//           <h2 className="text-xl font-bold">💬 Discussion</h2>

//           <button
//             onClick={() => setShowCommentsPanel(false)}
//             className="text-lg"
//           >
//             ❌
//           </button>
//         </div>

//         {/* ADD COMMENT */}
//         <div className="flex gap-3 mb-4">
//           <input
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             className="flex-1 p-3 rounded-full bg-[#3A3B3C] outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Write a comment..."
//           />
//           <button
//             onClick={addComment}
//             className="bg-blue-600 hover:bg-blue-700 transition px-5 rounded-full font-semibold"
//           >
//             Post
//           </button>
//         </div>

//         {/* COMMENTS LIST */}
//         <div className="flex-1 overflow-y-auto pr-2 space-y-4">

//           {comments.map((c) => {
//             const counts = getReactionCounts(c.reactions);
//             const totalReactions = c.reactions?.length || 0;

//             const isOwner = c.user?._id === user?.id;
//             const isInstructor = user?.role === "instructor";

//             return (
//               <div
//                 key={c._id}
//                 className="flex gap-3 bg-[#242526] p-4 rounded-xl hover:bg-[#2c2d2e] transition"
//               >

//                 {/* avatar */}
//                 <img
//                   src={c.user?.profileImage || "https://i.pravatar.cc/40"}
//                   alt="user"
//                   className="w-10 h-10 rounded-full object-cover"
//                 />

//                 <div className="flex-1">

//                   {/* NAME */}
//                   <div className="text-sm font-semibold">{c.user?.name}</div>

//                   {/* EDIT MODE */}
//                   {editingComment?._id === c._id ? (
//                     <div className="mt-2">
//                       <input
//                         value={editContent}
//                         onChange={(e) => setEditContent(e.target.value)}
//                         className="w-full p-2 rounded bg-[#3A3B3C] outline-none"
//                       />

//                       <div className="flex gap-2 mt-2">
//                         <button
//                           onClick={saveEdit}
//                           className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
//                         >
//                           Save
//                         </button>

//                         <button
//                           onClick={() => setEditingComment(null)}
//                           className="bg-gray-500 hover:bg-gray-600 px-4 py-1 rounded"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-[#3A3B3C] p-3 rounded-lg mt-2 text-sm">
//                       {c.content}
//                     </div>
//                   )}

//                   {/* ACTIONS */}
//                   <div className="flex gap-4 text-xs mt-2 text-gray-400">

//                     {isOwner && (
//                       <button
//                         onClick={() => {
//                           setEditingComment(c);
//                           setEditContent(c.content);
//                         }}
//                         className="hover:text-blue-400 transition"
//                       >
//                         Edit
//                       </button>
//                     )}

//                     {(isOwner || isInstructor) && (
//                       <button
//                         onClick={() => deleteComment(c._id)}
//                         className="hover:text-red-400 transition"
//                       >
//                         Delete
//                       </button>
//                     )}

//                     {/* REPLY */}
//                     {isInstructor && (
//                       activeReplyId === c._id ? (
//                         <div className="flex gap-2 w-full">
//                           <input
//                             value={replyText}
//                             onChange={(e) => setReplyText(e.target.value)}
//                             className="flex-1 p-2 bg-[#3A3B3C] rounded outline-none"
//                           />
//                           <button
//                             onClick={() => sendReply(c._id)}
//                             className="bg-green-600 px-3 rounded"
//                           >
//                             Send
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => setActiveReplyId(c._id)}
//                           className="hover:text-blue-400 transition"
//                         >
//                           Reply
//                         </button>
//                       )
//                     )}

//                   </div>

//                   {/* REPLY DISPLAY */}
//                   {c.reply && (
//                     <div className="mt-3 ml-4 border-l-2 border-blue-500 pl-3 text-sm text-gray-300">
//                       <span className="text-blue-400 font-semibold">
//                         {c.replyBy?.name}:
//                       </span>{" "}
//                       {c.reply}
//                     </div>
//                   )}

//                   {/* REACTIONS */}
//                   <div className="flex items-center gap-3 mt-3 flex-wrap">

//                     <span
//                       className="text-sm cursor-pointer hover:text-blue-400 transition"
//                       onClick={() => {
//                         setSelectedComment(c);
//                         setSelectedReactionType(null);
//                         setShowReactions(true);
//                       }}
//                     >
//                       {totalReactions} Reactions
//                     </span>

//                     {Object.entries(counts).map(([type, count]) => (
//                       <div
//                         key={type}
//                         className="flex items-center gap-1 bg-[#3A3B3C] px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-600 transition"
//                       >
//                         <span>{getReactionEmoji(type)}</span>
//                         <span>{count}</span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* REACTION BUTTONS */}
//                   <div className="flex gap-2 mt-3 flex-wrap">

//                     {reactionsList.map((r) => {
//                       const userReaction = getUserReaction(c.reactions);
//                       const isActive = userReaction?.type === r.type;

//                       return (
//                         <button
//                           key={r.type}
//                           onClick={() => reactWithType(c._id, r.type)}
//                           className={`text-lg transition hover:scale-125 ${
//                             isActive ? "bg-blue-600 px-2 rounded" : ""
//                           }`}
//                         >
//                           {r.emoji}
//                         </button>
//                       );
//                     })}

//                   </div>

//                 </div>
//               </div>
//             );
//           })}

//         </div>

//       </div>
//     </div>

//     {/* REACTIONS MODAL */}
//     {showReactions && selectedComment && (
//       <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

//         <div className="bg-[#242526] p-5 rounded-xl w-96 max-h-[400px] overflow-auto shadow-xl">

//           <div className="flex justify-between mb-3">
//             <h3 className="font-bold">
//               {selectedReactionType
//                 ? getReactionEmoji(selectedReactionType)
//                 : "All Reactions"}
//             </h3>
//             <button onClick={() => setShowReactions(false)}>❌</button>
//           </div>

//           {(selectedComment.reactions || [])
//             .filter((r) =>
//               selectedReactionType ? r.type === selectedReactionType : true
//             )
//             .map((r, i) => (
//               <div key={i} className="flex items-center gap-3 mb-2">

//                 <img
//                   src={r.user?.profileImage || "https://i.pravatar.cc/40"}
//                   className="w-8 h-8 rounded-full object-cover"
//                 />

//                 <p className="text-sm">{r.user?.name}</p>

//                 <span className="ml-auto">
//                   {getReactionEmoji(r.type)}
//                 </span>

//               </div>
//             ))}

//         </div>
//       </div>
//     )}

//   </>
// );
// }





































import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import api from "../api/axios";

const reactionsList = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "haha", emoji: "😂", label: "Haha" },
  { type: "wow", emoji: "😮", label: "Wow" },
  { type: "sad", emoji: "😢", label: "Sad" },
  { type: "angry", emoji: "😡", label: "Angry" },
];

export default function LessonComments({ lessonId, lesson }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [showReactions, setShowReactions] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedReactionType, setSelectedReactionType] = useState(null);

  const [showCommentsPanel, setShowCommentsPanel] = useState(false);

  const socketRef = useRef(null);

  // ================= SOCKET INIT =================
  useEffect(() => {
    socketRef.current = io("https://a3-edu.onrender.com");

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const token = localStorage.getItem("token");

  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1]));
    } catch {
      user = null;
    }
  }

  // ================= FETCH COMMENTS =================
  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/lesson/${lessonId}`);
      setComments((res.data?.data?.comments || []).reverse());
    } catch (err) {
      console.error(err);
      setComments([]);

      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
      } else {
        toast.error(err.response?.data?.message || "Failed to load comments");
      }
    }
  };

  // ================= SOCKET + FETCH =================
  useEffect(() => {
    const socket = socketRef.current;
    if (!lessonId || !socket) return;

    fetchComments();

    socket.emit("joinLessonRoom", lessonId);

    const handleNewComment = (comment) => {
      setComments((prev) => {
        const exists = prev.some((c) => c._id === comment._id);
        if (exists) return prev;
        return [comment, ...prev];
      });
    };

    const handleReactComment = (updatedComment) => {
      setComments((prev) =>
        prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
      );
    };

    const handleCommentUpdated = (updatedComment) => {
      setComments((prev) =>
        prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
      );
    };

    const handleCommentDeleted = ({ commentId }) => {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    };

    socket.on("newComment", handleNewComment);
    socket.on("reactComment", handleReactComment);
    socket.on("commentUpdated", handleCommentUpdated);
    socket.on("commentDeleted", handleCommentDeleted);

    return () => {
      socket.off("newComment", handleNewComment);
      socket.off("reactComment", handleReactComment);
      socket.off("commentUpdated", handleCommentUpdated);
      socket.off("commentDeleted", handleCommentDeleted);
      socket.emit("leaveLessonRoom", lessonId);
    };
  }, [lessonId]);

  // ================= ADD =================
  const addComment = async () => {
    const currentContent = content.trim();
    if (!currentContent) return;

    setContent("");

    try {
      const res = await api.post(`/comments/${lessonId}`, {
        content: currentContent,
      });

      const newComment = res.data?.comment || res.data?.data?.comment;
      if (!newComment) return;

      setComments((prev) => {
        const exists = prev.some((c) => c._id === newComment._id);
        if (exists) return prev;
        return [newComment, ...prev];
      });
    } catch (err) {
      console.error(err);
      setContent(currentContent);

      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  // ================= DELETE =================
  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
      } else {
        toast.error(err.response?.data?.message || "Failed to delete comment");
      }
    }
  };

  // ================= EDIT =================
  const saveEdit = async () => {
    if (!editingComment?._id || !editContent.trim()) return;

    try {
      const res = await api.patch(`/comments/${editingComment._id}`, {
        content: editContent.trim(),
      });

      const updatedComment = res.data?.comment || res.data?.data?.comment;

      if (updatedComment) {
        setComments((prev) =>
          prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
        );
      }

      setEditingComment(null);
      setEditContent("");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
      } else {
        toast.error(err.response?.data?.message || "Failed to update comment");
      }
    }
  };

  // ================= REACT =================
  const reactWithType = async (commentId, type) => {
    try {
      const res = await api.patch(`/comments/${commentId}/react`, { type });

      const updatedComment = res.data?.comment || res.data?.data?.comment;

      if (updatedComment) {
        setComments((prev) =>
          prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
        );
      }
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
      } else {
        toast.error(err.response?.data?.message || "Failed to react");
      }
    }
  };

  // ================= REPLY =================
  const sendReply = async (commentId) => {
    const currentReply = replyText.trim();
    if (!currentReply) return;

    setReplyText("");

    try {
      const res = await api.patch(`/comments/${commentId}/reply`, {
        reply: currentReply,
      });

      const updatedComment = res.data?.comment || res.data?.data?.comment;

      if (updatedComment) {
        setComments((prev) =>
          prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
        );
      }

      setActiveReplyId(null);
    } catch (err) {
      console.error(err);
      setReplyText(currentReply);

      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
      } else {
        toast.error(err.response?.data?.message || "Failed to send reply");
      }
    }
  };

  // ================= HELPERS =================
  const getUserReaction = (reactions = []) => {
    return reactions.find((r) => r.user?._id === user?.id);
  };

  const getReactionCounts = (reactions = []) => {
    const counts = {};
    reactions.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  };

  const getReactionEmoji = (type) =>
    reactionsList.find((r) => r.type === type)?.emoji || "👍";

  // ================= UI =================
  if (!lessonId) return null;
  if (!lesson || lesson.type !== "video") return null;

  return (
    <>
      {/* Trigger Button */}
      <div className="flex justify-center mt-5">
        <button
          onClick={() => setShowCommentsPanel(true)}
          className="
            inline-flex items-center gap-2
            px-5 py-3 rounded-2xl
            bg-blue-600 hover:bg-blue-500
            text-white font-semibold text-sm
            shadow-lg hover:shadow-blue-500/25
            transition-all duration-200 hover:scale-[1.02]
          "
        >
          <span className="text-base">💬</span>
          Open Discussion
        </button>
      </div>

      {/* Overlay */}
      {showCommentsPanel && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
          onClick={() => setShowCommentsPanel(false)}
        />
      )}

      {/* Slide Panel */}
      <div
        className={`
          fixed bottom-0 left-0 w-full z-50
          transform transition-transform duration-300
          ${showCommentsPanel ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div
          className="
            max-w-4xl mx-auto h-[85vh]
            rounded-t-3xl
            border border-gray-200 dark:border-gray-800
            bg-white/95 dark:bg-gray-950/95
            backdrop-blur-xl
            shadow-2xl
            overflow-hidden
          "
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div
              className="
                flex items-center justify-between
                px-6 py-4
                border-b border-gray-200 dark:border-gray-800
                bg-white/80 dark:bg-gray-950/80
              "
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Lesson Discussion
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask, discuss, react, and reply in real time
                </p>
              </div>

              <button
                onClick={() => setShowCommentsPanel(false)}
                className="
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  bg-gray-100 hover:bg-gray-200
                  dark:bg-gray-800 dark:hover:bg-gray-700
                  text-gray-500 dark:text-gray-300
                  transition-all
                "
              >
                ✕
              </button>
            </div>

            {/* Add Comment */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addComment();
                  }}
                  placeholder="Write a comment..."
                  className="
                    flex-1 h-12 px-4 rounded-2xl
                    border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-900
                    text-gray-900 dark:text-gray-100
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    outline-none
                    focus:ring-2 focus:ring-blue-500/30
                    focus:border-blue-500
                    transition-all
                  "
                />

                <button
                  onClick={addComment}
                  className="
                    h-12 px-5 rounded-2xl
                    bg-blue-600 hover:bg-blue-500
                    text-white font-semibold
                    shadow-md hover:shadow-blue-500/25
                    transition-all duration-200
                  "
                >
                  Post
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {comments.length === 0 ? (
                <div
                  className="
                    h-full flex flex-col items-center justify-center text-center
                    rounded-3xl border border-dashed border-gray-300 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-900/50
                    p-10
                  "
                >
                  <div className="text-4xl mb-3">💭</div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    No comments yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Start the discussion with the first comment.
                  </p>
                </div>
              ) : (
                comments.map((c) => {
                  const counts = getReactionCounts(c.reactions);
                  const totalReactions = c.reactions?.length || 0;

                  const isOwner = c.user?._id === user?.id;
                  const isInstructor = user?.role === "instructor";
                  const userReaction = getUserReaction(c.reactions);

                  return (
                    <div
                      key={c._id}
                      className="
                        group flex gap-3
                        rounded-2xl border border-gray-200 dark:border-gray-800
                        bg-white dark:bg-gray-900
                        p-4
                        shadow-sm hover:shadow-md
                        transition-all duration-200
                      "
                    >
                      {/* Avatar */}
                      <img
                        src={c.user?.profileImage || "https://i.pravatar.cc/40"}
                        alt={c.user?.name || "user"}
                        className="w-11 h-11 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                      />

                      <div className="flex-1 min-w-0">
                        {/* Top */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {c.user?.name || "Unknown User"}
                            </h4>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Comment
                            </p>
                          </div>
                        </div>

                        {/* Content / Edit */}
                        {editingComment?._id === c._id ? (
                          <div className="mt-3">
                            <input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="
                                w-full h-11 px-4 rounded-xl
                                border border-gray-200 dark:border-gray-700
                                bg-gray-50 dark:bg-gray-800
                                text-gray-900 dark:text-gray-100
                                outline-none
                                focus:ring-2 focus:ring-blue-500/30
                                focus:border-blue-500
                              "
                            />

                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={saveEdit}
                                className="
                                  px-4 py-2 rounded-xl text-sm font-medium
                                  bg-emerald-600 hover:bg-emerald-500
                                  text-white transition-all
                                "
                              >
                                Save
                              </button>

                              <button
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditContent("");
                                }}
                                className="
                                  px-4 py-2 rounded-xl text-sm font-medium
                                  bg-gray-200 hover:bg-gray-300
                                  dark:bg-gray-700 dark:hover:bg-gray-600
                                  text-gray-800 dark:text-gray-100
                                  transition-all
                                "
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="
                              mt-3 rounded-2xl px-4 py-3
                              bg-gray-50 dark:bg-gray-800/80
                              text-sm leading-relaxed
                              text-gray-700 dark:text-gray-200
                              border border-gray-100 dark:border-gray-700/60
                            "
                          >
                            {c.content}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                          {isOwner && (
                            <button
                              onClick={() => {
                                setEditingComment(c);
                                setEditContent(c.content);
                              }}
                              className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                            >
                              Edit
                            </button>
                          )}

                          {(isOwner || isInstructor) && (
                            <button
                              onClick={() => deleteComment(c._id)}
                              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition"
                            >
                              Delete
                            </button>
                          )}

                          {isInstructor &&
                            (activeReplyId === c._id ? (
                              <div className="flex items-center gap-2 w-full mt-1">
                                <input
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Write a reply..."
                                  className="
                                    flex-1 h-10 px-3 rounded-xl
                                    border border-gray-200 dark:border-gray-700
                                    bg-gray-50 dark:bg-gray-800
                                    text-gray-900 dark:text-gray-100
                                    outline-none
                                    focus:ring-2 focus:ring-blue-500/30
                                  "
                                />
                                <button
                                  onClick={() => sendReply(c._id)}
                                  className="
                                    px-4 h-10 rounded-xl
                                    bg-blue-600 hover:bg-blue-500
                                    text-white text-sm font-medium
                                  "
                                >
                                  Send
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setActiveReplyId(c._id)}
                                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                              >
                                Reply
                              </button>
                            ))}
                        </div>

                        {/* Reply Display */}
                        {c.reply && (
                          <div
                            className="
                              mt-4 ml-1
                              rounded-2xl
                              border-l-4 border-blue-500
                              bg-blue-50 dark:bg-blue-500/10
                              px-4 py-3
                            "
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {c.replyBy?.name || "Instructor"}:
                              </span>{" "}
                              {c.reply}
                            </p>
                          </div>
                        )}

                        {/* Reactions Summary */}
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                          <button
                            onClick={() => {
                              setSelectedComment(c);
                              setSelectedReactionType(null);
                              setShowReactions(true);
                            }}
                            className="
                              text-xs font-medium
                              px-3 py-1.5 rounded-full
                              bg-gray-100 hover:bg-gray-200
                              dark:bg-gray-800 dark:hover:bg-gray-700
                              text-gray-600 dark:text-gray-300
                              transition
                            "
                          >
                            {totalReactions} Reactions
                          </button>

                          {Object.entries(counts).map(([type, count]) => (
                            <button
                              key={type}
                              onClick={() => {
                                setSelectedComment(c);
                                setSelectedReactionType(type);
                                setShowReactions(true);
                              }}
                              className="
                                inline-flex items-center gap-1.5
                                px-2.5 py-1 rounded-full text-xs
                                bg-gray-100 hover:bg-gray-200
                                dark:bg-gray-800 dark:hover:bg-gray-700
                                text-gray-700 dark:text-gray-200
                                transition
                              "
                            >
                              <span>{getReactionEmoji(type)}</span>
                              <span>{count}</span>
                            </button>
                          ))}
                        </div>

                        {/* Reaction Buttons */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {reactionsList.map((r) => {
                            const isActive = userReaction?.type === r.type;

                            return (
                              <button
                                key={r.type}
                                onClick={() => reactWithType(c._id, r.type)}
                                title={r.label}
                                className={`
                                  w-10 h-10 rounded-xl text-lg
                                  flex items-center justify-center
                                  transition-all duration-200 hover:scale-110
                                  ${
                                    isActive
                                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                                  }
                                `}
                              >
                                {r.emoji}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reactions Modal */}
      {showReactions && selectedComment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="
              w-full max-w-md max-h-[75vh] overflow-hidden
              rounded-3xl
              border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900
              shadow-2xl
            "
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {selectedReactionType
                    ? `${getReactionEmoji(selectedReactionType)} Reactions`
                    : "All Reactions"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  People who reacted to this comment
                </p>
              </div>

              <button
                onClick={() => {
                  setShowReactions(false);
                  setSelectedReactionType(null);
                }}
                className="
                  w-9 h-9 rounded-xl
                  flex items-center justify-center
                  bg-gray-100 hover:bg-gray-200
                  dark:bg-gray-800 dark:hover:bg-gray-700
                  text-gray-500 dark:text-gray-300
                  transition
                "
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[55vh] space-y-3">
              {(selectedComment.reactions || [])
                .filter((r) =>
                  selectedReactionType ? r.type === selectedReactionType : true
                )
                .map((r, i) => (
                  <div
                    key={i}
                    className="
                      flex items-center gap-3
                      rounded-2xl
                      border border-gray-200 dark:border-gray-800
                      bg-gray-50 dark:bg-gray-800/60
                      px-3 py-3
                    "
                  >
                    <img
                      src={r.user?.profileImage || "https://i.pravatar.cc/40"}
                      alt={r.user?.name || "user"}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                    />

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {r.user?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Reacted with {r.type}
                      </p>
                    </div>

                    <span className="ml-auto text-xl">
                      {getReactionEmoji(r.type)}
                    </span>
                  </div>
                ))}

              {(selectedComment.reactions || []).filter((r) =>
                selectedReactionType ? r.type === selectedReactionType : true
              ).length === 0 && (
                <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                  No reactions found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}