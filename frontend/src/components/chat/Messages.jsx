// Messages.jsx
import React from "react";
import { Video } from "lucide-react";

// Helper to render message content with clickable links
const renderContentWithLinks = (content) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary-600 dark:text-brand-primary-400 underline hover:text-brand-primary-800 dark:hover:text-brand-primary-200 transition-colors"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const Messages = ({ messagesData, messagesLoading, currentUser, formatTime }) => (
  <section className="flex-1 overflow-y-auto px-6 md:px-14 py-8 space-y-6 bg-transparent scrollbar-thin">
    {messagesLoading ? (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-brand-primary-300 dark:border-brand-primary-600 border-b-transparent"></div>
      </div>
    ) : messagesData?.getMessages?.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-60 text-txt-muted-light dark:text-txt-muted-dark mt-10">
        <svg width="36" height="36" className="mb-2 opacity-50" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M7 13h10M7 9h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <span className="font-heading text-lg font-medium mb-1">No messages yet</span>
        <span className="text-sm">Start the conversation!</span>
      </div>
    ) : (
      messagesData?.getMessages?.map((msg, idx) => {
        const isSelf = msg.sender?.id === currentUser?.id;
        const nextMsg = messagesData.getMessages[idx + 1];
        const isTail = !nextMsg || nextMsg.sender?.id !== msg.sender?.id;
        const isVideoCallInvite = msg.content.startsWith("[Video Call Invitation]");

        return (
          <div key={msg.id} className={`w-full flex ${isSelf ? "justify-end" : "justify-start"}`}>
            <div className={`relative group flex flex-col items-end max-w-[80%] md:max-w-xl ${isSelf ? "items-end" : "items-start"}`}>
              <div className={`
                relative z-0 shadow-md rounded-3xl px-6 py-3 backdrop-blur-md
                text-base font-body whitespace-pre-line break-words transition-all duration-300
                ${isSelf
                  ? "bg-brand-accent-500 text-bg-primary-light" // Plain color for self messages
                  : "bg-bg-accent-light/80 dark:bg-bg-accent-dark/90 text-txt-primary-light dark:text-txt-primary-dark"
                }
                ${isSelf ? "ml-10" : "mr-10"}
              `}>
                <div className="flex items-center gap-3 mb-2">
                  {isSelf ? (
                    <span className="hidden md:inline font-heading text-xs uppercase tracking-widest opacity-60">You</span>
                  ) : (
                    <span className="font-heading font-medium text-sm text-heading-accent-light dark:text-heading-accent-dark">
                      {msg.sender?.username || "Unknown"}
                    </span>
                  )}
                  <span className="text-xs text-txt-muted-light dark:text-txt-muted-dark opacity-70">{formatTime(msg.createdAt)}</span>
                </div>
                {isVideoCallInvite ? (
                  // ✅ Improved: Extract URL properly and render as a full clickable button without breaking structure
                  <a
                    href={msg.content.split("Join this meeting: ")[1] || "#"} // ✅ Better URL extraction assuming the format
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-3 bg-brand-accent-500 text-white font-semibold rounded-lg shadow hover:brightness-110 transition-all gap-3 my-2 w-full justify-center" // ✅ Full-width for better structure
                  >
                    <Video className="w-6 h-6 opacity-90" />
                    Join Video Call
                  </a>
                ) : (
                  <div>{renderContentWithLinks(msg.content)}</div>
                )}
                {isTail && (
                  <span className={`absolute ${isSelf ? "bottom-0 -right-3" : "bottom-0 -left-3"} w-4 h-4 overflow-hidden`}>
                    <svg width="16" height="16" className={isSelf ? "text-brand-accent-500" : "text-bg-accent-light dark:text-bg-accent-dark"} viewBox="0 0 16 16" fill="currentColor">
                      <polygon points={isSelf ? "16,0 0,16 16,16" : "0,0 16,16 0,16"} />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })
    )}
  </section>
);

export default Messages;
