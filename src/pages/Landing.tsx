import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageCircle, BookOpen, Bell, Sparkles, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-white animate-pulse-glow">
              R
            </div>
            <h1 className="text-2xl font-bold text-white">Reech</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Your AI Bro is
              <span className="block bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Here to Chat
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Chat with Reech like you would with a friend. Get reminders, keep a journal, 
              and have someone who's always there to listen. No signup required - just start chatting!
            </p>
            
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chat Like a Friend</h3>
              <p className="text-gray-300">
                Talk to Reech like you would with your best bro. Casual, supportive, and always there to listen.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Auto Journal</h3>
              <p className="text-gray-300">
                Your conversations automatically become simple, human diary entries. No fancy writing - just real talk.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Reminders</h3>
              <p className="text-gray-300">
                Set reminders naturally in conversation. "Remind me to call mom at 5 PM" - that's it!
              </p>
            </div>
          </motion.div>

          {/* How it Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-6">How it Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Start Chatting</h4>
                  <p className="text-gray-300 text-sm">Just start talking about your day, thoughts, or anything on your mind.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Get Responses</h4>
                  <p className="text-gray-300 text-sm">Reech responds like a supportive friend and remembers what you talk about.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">View Your Journal</h4>
                  <p className="text-gray-300 text-sm">Your conversations automatically become simple diary entries you can read and edit.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-gray-400">
          Made with ❤️ by the Reech team • No signup required • Start chatting now
        </p>
      </footer>
    </div>
  );
};

export default Landing;

