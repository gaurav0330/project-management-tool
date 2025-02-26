// import { useState } from "react";
// import { 
//   Clock, 
//   Calendar, 
//   AlertCircle, 
//   Users, 
//   Briefcase, 
//   Building2, 
//   ClipboardList,
//   Send
// } from "lucide-react";

// function ManageTask() {
//   const [task, setTask] = useState({
//     name: "",
//     description: "",
//     priority: "medium",
//     assignee: "",
//     role: "",
//     department: "",
//     deadline: "",
//     estimatedTime: "",
//   });

//   const handleChange = (e) => {
//     setTask({ ...task, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-50 sm:p-6 md:p-8">
//       <div className="max-w-lg mx-auto"> {/* Changed from max-w-2xl to max-w-lg */}
//         <div className="border border-blue-100 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl">
//           {/* Header */}
//           <div className="px-5 py-4 border-b border-blue-100"> {/* Adjusted padding */}
//             <h1 className="flex items-center gap-2 text-lg font-medium text-blue-900"> {/* Changed text-xl to text-lg */}
//               <ClipboardList className="w-4 h-4 text-blue-500" /> {/* Reduced icon size */}
//               Create Task
//             </h1>
//           </div>

//           {/* Form Content */}
//           <form className="p-5 space-y-4"> {/* Reduced padding and spacing */}
//             {/* Task Details Section */}
//             <div className="space-y-3"> {/* Reduced spacing */}
//               <div className="relative">
//                 <input
//                   type="text"
//                   name="name"
//                   value={task.name}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 transition-all border border-blue-200 rounded-lg outline-none bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-400"
//                   placeholder="Task Name"
//                 />
//               </div>

//               <div className="relative">
//                 <textarea
//                   name="description"
//                   value={task.description}
//                   onChange={handleChange}
//                   rows={3}
//                   className="w-full px-4 py-2 transition-all border border-blue-200 rounded-lg outline-none resize-none bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-400"
//                   placeholder="Task Description"
//                 />
//               </div>

//               {/* Priority Selection */}
//               <div className="flex items-center gap-3">
//                 <label className="flex items-center gap-1.5 text-blue-600 text-sm">
//                   <AlertCircle className="w-4 h-4" />
//                   Priority
//                 </label>
//                 <div className="flex gap-2">
//                   {["low", "medium", "high"].map((p) => (
//                     <label
//                       key={p}
//                       className={`
//                         cursor-pointer px-2.5 py-1 rounded-lg text-sm transition-all
//                         ${task.priority === p
//                           ? p === "high"
//                             ? "bg-red-50 text-red-600 border border-red-200"
//                             : p === "medium"
//                             ? "bg-blue-50 text-blue-600 border border-blue-200"
//                             : "bg-green-50 text-green-600 border border-green-200"
//                           : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-50"
//                         }
//                       `}
//                     >
//                       <input
//                         type="radio"
//                         name="priority"
//                         value={p}
//                         checked={task.priority === p}
//                         onChange={handleChange}
//                         className="hidden"
//                       />
//                       {p}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Assignment Details */}
//               <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
//                     <Users className="w-4 h-4 text-blue-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="assignee"
//                     value={task.assignee}
//                     onChange={handleChange}
//                     className="w-full py-2 pl-10 pr-4 transition-all border border-blue-200 rounded-lg outline-none bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-400"
//                     placeholder="Assignee"
//                   />
//                 </div>

//                 <div className="relative">
//                   <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
//                     <Briefcase className="w-4 h-4 text-blue-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="role"
//                     value={task.role}
//                     onChange={handleChange}
//                     className="w-full py-2 pl-10 pr-4 transition-all border border-blue-200 rounded-lg outline-none bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-400"
//                     placeholder="Role"
//                   />
//                 </div>

//                 <div className="relative">
//                   <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
//                     <Building2 className="w-4 h-4 text-blue-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="department"
//                     value={task.department}
//                     onChange={handleChange}
//                     className="w-full py-2 pl-10 pr-4 transition-all border border-blue-200 rounded-lg outline-none bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-400"
//                     placeholder="Department"
//                   />
//                 </div>

//                 <div className="relative">
//                   <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
//                     <Clock className="w-4 h-4 text-blue-400" />
//                   </div>
//                   <input
//                     type="number"
//                     name="estimatedTime"
//                     value={task.estimatedTime}
//                     onChange={handleChange}
//                     className="w-full py-2 pl-10 pr-4 transition-all border border-blue-200 rounded-lg outline-none bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-400"
//                     placeholder="Estimated Hours"
//                   />
//                 </div>

//                 <div className="relative md:col-span-2">
//                   <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
//                     <Calendar className="w-4 h-4 text-blue-400" />
//                   </div>
//                   <input
//                     type="date"
//                     name="deadline"
//                     value={task.deadline}
//                     onChange={handleChange}
//                     className="w-full py-2 pl-10 pr-4 transition-all border border-blue-200 rounded-lg outline-none bg-blue-50/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="flex items-center justify-center w-full gap-2 px-6 py-2 text-sm font-medium text-white transition-all duration-300 bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
//             >
//               <Send className="w-4 h-4" />
//               Create Task
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ManageTask;