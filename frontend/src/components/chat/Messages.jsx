import React, { useEffect, useRef, useState } from "react";
import { Video } from "lucide-react";

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

const Messages = ({
  messagesData,
  messagesLoading,
  currentUser,
  formatTime,
  messagesEndRef,
}) => {
  const containerRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData, messagesEndRef]);

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollToBottom(!atBottom);
  };

  const safeFormatTime =
    formatTime ||
    ((timestamp) => {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      if (isNaN(date)) return "Invalid";
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    });

  return (
    <section
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-6 md:px-14 py-8 space-y-6 relative
        bg-gradient-to-br from-slate-50/80 via-white/60 to-blue-50/40
        dark:from-slate-900/90 dark:via-slate-800/85 dark:to-slate-900/90
        scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-brand-primary-300/60
        dark:scrollbar-thumb-brand-primary-600/60 scrollbar-track-transparent"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.06) 0%, transparent 50%),
          url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter></defs><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.02"/></svg>')
        `,
        backgroundSize: "100% 100%, 100% 100%, 80px 80px",
        paddingTop: "84px",
      }}
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messagesLoading ? (
        <div className="flex flex-col items-center justify-center h-60 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gradient-to-r from-brand-primary-400 to-brand-primary-600 border-t-transparent shadow-lg"></div>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark font-medium animate-pulse">
            Loading messages...
          </p>
        </div>
      ) : messagesData?.getMessages?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-72 text-center space-y-6 mt-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50">
              <svg
                width="48"
                height="48"
                className="text-brand-primary-500 dark:text-brand-primary-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                <path d="M7 13h10M7 9h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Conversation not started
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark max-w-sm leading-relaxed">
              Start the conversation and connect with your team members!
            </p>
          </div>
        </div>
      ) : (
        messagesData.getMessages.map((msg, idx) => {
          const isSelf = msg.sender?.id === currentUser?.id;
          const nextMsg = messagesData.getMessages[idx + 1];
          const isTail = !nextMsg || nextMsg.sender?.id !== msg.sender?.id;
          const isVideoCallInvite = msg.content.startsWith("[Video Call Invitation]");

          return (
            <React.Fragment key={msg.id}>
              <div className={`w-full flex ${isSelf ? "justify-end" : "justify-start"}`}>
                <div className={`relative group flex flex-col ${isSelf ? "items-end" : "items-start"} max-w-[85%] md:max-w-2xl`}>
                  <div
                    className={`
                      relative z-10 rounded-3xl px-6 py-4 backdrop-blur-sm
                      text-base font-body whitespace-pre-line break-words 
                      transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl
                      border border-gray-200 dark:border-slate-600
                      ${isSelf 
                        ? "bg-gradient-to-br from-white/90 via-slate-50/80 to-white/90 dark:from-slate-700/90 dark:via-slate-800/80 dark:to-slate-700/90 text-slate-800 dark:text-slate-100"
                        : "bg-gradient-to-br from-white/90 via-slate-50/80 to-white/90 dark:from-slate-700/90 dark:via-slate-800/80 dark:to-slate-700/90 text-slate-800 dark:text-slate-100"
                      }
                      ${isSelf ? "ml-8 md:ml-16" : "mr-8 md:mr-16"}
                    `}
                  >
                    {!isSelf && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-800 dark:to-brand-primary-900 text-brand-primary-700 dark:text-brand-primary-200 font-heading font-bold text-sm shadow-sm">
                          {(msg.sender?.username || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-heading font-semibold text-sm tracking-wide text-slate-700 dark:text-slate-300">
                          {msg.sender?.username || "Unknown"}
                        </span>
                      </div>
                    )}

                    {isVideoCallInvite ? (
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                          📹 Video Call Invitation
                        </p>
                        <p className="text-xs text-emerald-500 dark:text-emerald-300 mb-2">
                          Click below to join the ongoing video meeting.
                        </p>
                        <a
                          href={msg.content.split("Join this meeting: ")[1] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg w-full justify-center gap-3 transform hover:scale-105 transition-all duration-200"
                          aria-label="Join Video Call"
                        >
                          <Video className="w-5 h-5" />
                          <span>Join Video Call</span>
                        </a>
                      </div>
                    ) : (
                      <div className="leading-relaxed mb-2">{renderContentWithLinks(msg.content)}</div>
                    )}

                    <div className={`flex items-center justify-end gap-1 mt-2 ${isVideoCallInvite ? "mt-3" : ""}`}>
                      <span className={`text-xs font-medium ${isSelf ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
                        {safeFormatTime(msg.createdAt)}
                      </span>
                    </div>

                    {isTail && (
                      <div
                        className={`absolute ${isSelf ? "bottom-0 -right-2" : "bottom-0 -left-2"} w-4 h-4 overflow-hidden`}
                        aria-hidden="true"
                      >
                        <div
                          className={`w-4 h-4 rotate-45 ${
                            isSelf
                              ? "bg-gradient-to-br from-brand-primary-500 to-brand-primary-700"
                              : "bg-gradient-to-br from-white/90 to-slate-50/80 dark:from-slate-700/90 dark:to-slate-800/80"
                          }`}
                          style={{
                            transformOrigin: isSelf ? "bottom right" : "bottom left",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {idx === messagesData.getMessages.length - 1 && <div ref={messagesEndRef} className="h-1" />}
                </div>
              </div>
            </React.Fragment>
          );
        })
      )}

      {!messagesLoading && messagesData?.getMessages?.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={scrollToTop}
            className="px-4 py-2 rounded-full bg-slate-500 hover:bg-slate-700 text-white shadow transition duration-300"
            aria-label="Scroll to Top"
          >
            &uarr; Scroll to Top
          </button>
        </div>
      )}

      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-5 bg-brand-primary-600 hover:bg-brand-primary-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-400"
          aria-label="Scroll to Bottom"
        >
          &#8595;
        </button>
      )}
    </section>
  );
};

export default Messages;
