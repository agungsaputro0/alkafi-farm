import React from "react";
import { FaUserCircle, FaPaperPlane, FaMicrophone } from "react-icons/fa";

const FloatingChatbotPanel: React.FC = () => {
  return (
    <div
      className="
        absolute 
        bottom-6 
        right-6 
        z-10
        bg-white/10 
        backdrop-blur-md 
        border border-white/20 
        rounded-2xl 
        px-5 
        py-4 
        text-white 
        shadow-2xl 
        w-[320px] 
        space-y-4
        transition 
        duration-300 
        hover:scale-[1.02]
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
          {/* Placeholder avatar digital human */}
          <FaUserCircle className="text-4xl text-blue-300" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">RCE Digital Assistant</h3>
          <p className="text-xs opacity-70">Tanyakan seputar fiskal & ekonomi regional</p>
        </div>
      </div>

      {/* Placeholder Chat Bubble */}
      <div className="bg-white/10 rounded-xl p-3 text-sm opacity-90">
        👋 Halo, saya asisten AI RCE.  
        Silakan ajukan pertanyaan Anda.
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ketik pertanyaan Anda..."
          className="
            flex-1 
            bg-white/10 
            rounded-lg 
            px-3 
            py-2 
            text-sm 
            placeholder-white/50
            focus:outline-none
          "
        />
        {/* Mic Button */}
        <button
          className="
            p-2 
            rounded-lg 
            bg-white/10 
            hover:bg-white/20 
            transition
          "
          title="Voice Command"
        >
          <FaMicrophone className="text-lg text-red-400" />
        </button>
        {/* Send Button */}
        <button
          className="
            p-2 
            rounded-lg 
            bg-blue-500 
            hover:bg-blue-600 
            transition
          "
          title="Kirim"
        >
          <FaPaperPlane className="text-white text-lg" />
        </button>
      </div>
    </div>
  );
};

export default FloatingChatbotPanel;
