// MessageForm.jsx
import React from "react";

const MessageForm = ({ message, setMessage, handleSendMessage, currentUser }) => (
  <footer className="sticky bottom-0 z-10 bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/95 backdrop-blur-xl border-t border-brand-primary-100 dark:border-brand-primary-900 px-10 py-5">
    <form onSubmit={handleSendMessage} className="flex items-center gap-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-6 py-3 rounded-full border border-brand-primary-100 dark:border-brand-primary-900 bg-bg-primary-light/90 dark:bg-bg-primary-dark/80 text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-muted-light dark:placeholder-txt-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-300 dark:focus:ring-brand-primary-500 focus:ring-offset-1 shadow"
        disabled={!currentUser}
        spellCheck={false}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!message.trim() || !currentUser}
        className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-brand-primary-500 via-brand-primary-600 to-brand-primary-700 text-bg-primary-light rounded-full font-button font-semibold shadow-lg transition-all hover:brightness-110 active:scale-95 ring-0 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span>Send</span>
        <svg width="20" height="20" fill="none" className="text-bg-primary-light" viewBox="0 0 20 20"><path d="M4 10l10.5-5m0 0L16 10m-1.5-5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
    </form>
  </footer>
);

export default MessageForm;
