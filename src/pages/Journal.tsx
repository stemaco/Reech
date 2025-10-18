import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getJournalEntries, JournalEntry } from "../utils/storage";
import { getMoodEmoji } from "../utils/messageParser";
import { diaryWriterService, DiaryEntry } from "../utils/diaryWriter";
import { BookOpen, Sparkles, Calendar, ChevronLeft, ChevronRight, Edit3, Save, X, Trash2 } from "lucide-react";

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'conversations' | 'diary'>('diary');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    setEntries(getJournalEntries().reverse());
    const allDiaries = diaryWriterService.getAllDiaryEntries();
    // Sort diaries by date (newest first)
    const sortedDiaries = allDiaries.sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime());
    setDiaryEntries(sortedDiaries);
    
    // Set today's diary as the first page (index 0)
    setCurrentPageIndex(0);
  }, []);

  const generateTodayDiary = async () => {
    setIsGenerating(true);
    try {
      const todayDiary = await diaryWriterService.generateTodayDiary();
      const allDiaries = diaryWriterService.getAllDiaryEntries();
      // Sort diaries by date (newest first)
      const sortedDiaries = allDiaries.sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime());
      setDiaryEntries(sortedDiaries);
      
      // Set today's diary as current page (index 0)
      setCurrentPageIndex(0);
    } catch (error) {
      console.error('Error generating diary:', error);
    }
    setIsGenerating(false);
  };

  const goToNextPage = () => {
    if (currentPageIndex < diaryEntries.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const startEditing = () => {
    if (diaryEntries[currentPageIndex]) {
      setEditedContent(diaryEntries[currentPageIndex].content);
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    if (diaryEntries[currentPageIndex]) {
      const updatedEntry = { ...diaryEntries[currentPageIndex], content: editedContent };
      diaryWriterService.updateDiaryEntry(updatedEntry);
      
      // Update local state
      const updatedDiaries = [...diaryEntries];
      updatedDiaries[currentPageIndex] = updatedEntry;
      setDiaryEntries(updatedDiaries);
      
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const deleteDiaryEntry = () => {
    if (diaryEntries[currentPageIndex]) {
      const entryToDelete = diaryEntries[currentPageIndex];
      diaryWriterService.deleteDiaryEntry(entryToDelete.id);
      
      // Update local state
      const updatedDiaries = diaryEntries.filter((_, index) => index !== currentPageIndex);
      setDiaryEntries(updatedDiaries);
      
      // Adjust current page index if needed
      if (currentPageIndex >= updatedDiaries.length && updatedDiaries.length > 0) {
        setCurrentPageIndex(updatedDiaries.length - 1);
      } else if (updatedDiaries.length === 0) {
        setCurrentPageIndex(0);
      }
    }
  };

  const goToToday = () => {
    // Today's diary is always at index 0 (newest first)
    setCurrentPageIndex(0);
  };

  if (entries.length === 0 && diaryEntries.length === 0) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center text-center p-6">
        <BookOpen className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Personal Diary</h2>
        <p className="text-muted-foreground max-w-md">
          Start chatting with Reech, and I'll write beautiful daily diaries based on our conversations.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">📖 Your Personal Diary</h1>
            <p className="text-muted-foreground">
              AI-generated diaries based on your conversations with Reech
            </p>
          </div>
          <button
            onClick={generateTodayDiary}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Updating...' : 'Update Today\'s Diary'}
          </button>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('diary')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'diary' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            AI Diaries
          </button>
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'conversations' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Conversations ({entries.length})
          </button>
        </div>
      </header>

      {activeTab === 'diary' ? (
        <div className="flex flex-col items-center justify-center min-h-[600px]">
          {diaryEntries.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Diaries Yet</h3>
              <p className="text-muted-foreground mb-4">
                Chat with Reech and then generate your first AI-written diary!
              </p>
              <button
                onClick={generateTodayDiary}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Create Today's Diary
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Book Container */}
              <div className="relative w-[400px] h-[600px] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg shadow-2xl border-4 border-amber-200 dark:border-amber-800">
                {/* Book Spine */}
                <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-amber-600 to-orange-600 rounded-l-lg"></div>
                
                {/* Page Content */}
                <div className="absolute inset-0 p-8 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPageIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col"
                    >
                      {diaryEntries[currentPageIndex] && (
                        <>
                          {/* Header */}
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2 font-serif">
                              {diaryEntries[currentPageIndex].title}
                            </h2>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">{diaryEntries[currentPageIndex].date}</span>
                              </div>
                              <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
                                <span className="text-lg">{getMoodEmoji(diaryEntries[currentPageIndex].mood)}</span>
                                <span className="capitalize font-medium">{diaryEntries[currentPageIndex].mood}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 overflow-hidden">
                            {isEditing ? (
                              <div className="h-full flex flex-col">
                                <textarea
                                  value={editedContent}
                                  onChange={(e) => setEditedContent(e.target.value)}
                                  className="flex-1 w-full p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg text-amber-800 dark:text-amber-200 leading-relaxed text-sm font-serif resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  placeholder="Write your diary entry..."
                                />
                                <div className="flex gap-2 mt-4">
                                  <button
                                    onClick={saveEdit}
                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    <Save className="w-4 h-4" />
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex flex-col">
                                <div className="flex-1 text-amber-800 dark:text-amber-200 leading-relaxed text-sm font-serif overflow-y-auto">
                                  {diaryEntries[currentPageIndex].content}
                                </div>
                                <div className="mt-4 flex gap-2">
                                  <button
                                    onClick={startEditing}
                                    className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={deleteDiaryEntry}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {diaryEntries[currentPageIndex].highlights.length > 0 && (
                              <div className="mt-6 pt-4 border-t border-amber-300 dark:border-amber-700">
                                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-1">
                                  <Sparkles className="w-4 h-4" />
                                  Highlights
                                </h4>
                                <div className="space-y-2">
                                  {diaryEntries[currentPageIndex].highlights.map((highlight, idx) => (
                                    <div key={idx} className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                                      <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                                      <span>{highlight}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Page Numbers */}
                <div className="absolute bottom-4 right-4 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {currentPageIndex + 1} of {diaryEntries.length}
                </div>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex items-center justify-between w-full max-w-[400px] mt-6">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPageIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm"
                >
                  Today
                </button>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPageIndex === diaryEntries.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 max-w-3xl">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-journal p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground/90">
                      {entry.date}
                    </p>
                    {entry.mood && (
                      <p className="text-xs text-foreground/70 capitalize">
                        Feeling {entry.mood}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-foreground/90 leading-relaxed">{entry.text}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
