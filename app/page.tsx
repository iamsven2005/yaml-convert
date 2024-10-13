'use client';

import { useChat } from 'ai/react';
import { Key } from 'react';
import ReactMarkdown from 'react-markdown';

// Function to detect code blocks in a message and extract language and content
const extractCodeBlocks = (message: string) => {
  const codeBlockRegex = /```(\w+)\n([\s\S]+?)```/g;
  let match;
  const codeBlocks = [];

  while ((match = codeBlockRegex.exec(message)) !== null) {
    const [, language, content] = match;
    codeBlocks.push({ language, content });
  }

  return codeBlocks;
};

// Function to trigger file download
const downloadFile = (content: BlobPart, language: string) => {
  const fileExtension = language; // Use the language directly as the file extension
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `code.${fileExtension}`; // Filename based on the language
  link.click();
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m: { id: Key | null | undefined; role: string; content: string | null | undefined; }) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          
          {/* Display AI message as markdown */}
          <ReactMarkdown>{m.content}</ReactMarkdown>
          {/* Detect and display code blocks with a download button */}
          {extractCodeBlocks(m.content ?? '').map((block, index) => (
            <div key={index} className="mt-4">
              <button
                onClick={() => downloadFile(block.content, block.language)}
                className="mt-2 p-2 bg-blue-500 text-white rounded shadow"
              >
                Download {block.language} Code
              </button>
            </div>
          ))}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
