import React, { useRef } from "react";

const MessageForm = ({
  message,
  setMessage,
  handleSendMessage,
  currentUser,
}) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) handleSendMessage(e);
    }
  };

  return (
    <footer
      className="sticky bottom-0 z-10 bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/95 backdrop-blur-xl border-t border-brand-primary-100 dark:border-brand-primary-900 px-4 py-4 rounded-t-3xl w-full max-w-full"
      aria-label="Message Composer"
      style={{ position: "relative" }}
    >
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3"
        aria-label="Send message"
      >
        <textarea
          id="message-area"
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[44px] max-h-44 px-4 py-3 rounded-2xl border border-brand-primary-200 dark:border-brand-primary-800 bg-bg-primary-light/90 dark:bg-bg-primary-dark/80 text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-muted-light dark:placeholder-txt-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-400 dark:focus:ring-brand-primary-600 focus:ring-offset-1 shadow resize-none transition"
          aria-multiline="true"
          aria-label="Message input"
          disabled={!currentUser}
          spellCheck={false}
          autoComplete="off"
          rows={2}
          onKeyDown={handleKeyDown}
        />

        <button
          type="submit"
          disabled={!message.trim() || !currentUser}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-brand-primary-500 via-brand-primary-600 to-brand-primary-700 text-bg-primary-light rounded-full font-semibold shadow-md transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <span>Send</span>
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <path d="M4 10l10.5-5m0 0L16 10m-1.5-5V14" />
          </svg>
        </button>
      </form>
    </footer>
  );
};

export default MessageForm;
