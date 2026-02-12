import React from 'react';
import { ChatProvider, useChatStore } from './store/chatStore';
import { ChatLayout } from './components/ChatLayout';
import { FileUploader } from './components/FileUploader';

const ChatContent = () => {
  const { messages, metadata } = useChatStore();

  if (!metadata) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <FileUploader />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.type === 'system' ? 'justify-center' : (msg.isCurrentUser ? 'justify-end' : 'justify-start')}`}
        >
          <div
            className={`max-w-[85%] sm:max-w-[70%] p-2 rounded-lg text-sm shadow-sm ${
              msg.type === 'system'
                ? 'bg-amber-50 text-amber-800 text-xs px-4 py-1 rounded-md shadow-none border border-amber-100 max-w-[90%] text-center'
                : (msg.isCurrentUser
                  ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-gray-800 dark:text-gray-100'
                  : 'bg-white dark:bg-[#202c33] text-gray-800 dark:text-gray-100')
            }`}
          >
            {msg.type !== 'system' && (
              <div className="font-bold text-xs text-gray-500 mb-1">{msg.sender}</div>
            )}
            {msg.type !== 'system' && (
              <div className="flex justify-between items-end gap-2 mt-1">
                <div className="whitespace-pre-wrap flex-1">{msg.content}</div>
                <div className="text-[10px] text-gray-400 min-w-fit leading-none pb-0.5">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
            {msg.type === 'system' && (
              <div className="whitespace-pre-wrap">{msg.content}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const SidebarContent = () => {
  const { metadata, clearChat } = useChatStore();

  if (!metadata) {
    return (
      <div className="p-4 text-center text-gray-500">
        No chat loaded
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="font-bold text-lg mb-4 truncate" title={metadata.fileName}>
        {metadata.fileName}
      </h2>
      <div className="space-y-2 mb-8">
        <p className="text-sm text-gray-600">Messages: {metadata.messageCount}</p>
        <p className="text-sm text-gray-600 font-medium">Participants:</p>
        <ul className="text-xs text-gray-500 list-disc list-inside">
          {metadata.participants.map(p => <li key={p}>{p}</li>)}
        </ul>
      </div>
      <button
        onClick={clearChat}
        className="mt-auto w-full py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm font-medium"
      >
        Close Chat
      </button>
    </div>
  );
};

function App() {
  return (
    <ChatProvider>
      <ChatLayout
        sidebar={<SidebarContent />}
        content={<ChatContent />}
      />
    </ChatProvider>
  );
}

export default App;
