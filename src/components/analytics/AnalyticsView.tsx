import React, { useMemo } from 'react';
import { Message } from '../../types/message';
import { BarChart3, Users, MessageCircle, Clock, Calendar, Image as ImageIcon, MessageSquare } from 'lucide-react';
import dayjs from 'dayjs';

interface AnalyticsViewProps {
  messages: Message[];
  participants: string[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = React.memo(({ messages, participants }) => {
  const stats = useMemo(() => {
    const totalMessages = messages.length;
    const textMessages = messages.filter((m: any) => m.type === 'text').length;
    const mediaMessages = messages.filter((m: any) => ['image', 'video', 'audio', 'document'].includes(m.type)).length;
    
    // Message count per participant
    const perUser = participants.reduce((acc: any, user: string) => {
      acc[user] = messages.filter((m: any) => m.sender === user).length;
      return acc;
    }, {} as Record<string, number>);

    // Messages by hour
    const byHour = new Array(24).fill(0);
    messages.forEach((m: any) => {
      const hour = m.timestamp.getHours();
      byHour[hour]++;
    });

    // Message by day of week
    const byDay = new Array(7).fill(0); // 0 = Sunday
    messages.forEach((m: any) => {
      const day = m.timestamp.getDay();
      byDay[day]++;
    });

    // Busy hours
    const topHours = byHour
      .map((count: number, hour: number) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Emoji breakdown
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    const emojiFreq: Record<string, number> = {};
    messages.forEach((m: any) => {
      const emojis = m.content.match(emojiRegex);
      if (emojis) {
        emojis.forEach((emoji: string) => {
          emojiFreq[emoji] = (emojiFreq[emoji] || 0) + 1;
        });
      }
    });
    const topEmojis = Object.entries(emojiFreq)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 10);

    // Word frequency (excluding short common words)
    const commonWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'person', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'am', 'been', 'has', 'had']);
    const wordFreq: Record<string, number> = {};
    messages.filter((m: any) => m.type === 'text').forEach((m: any) => {
      const words = m.content.toLowerCase().match(/\b(\w+)\b/g);
      if (words) {
        words.forEach((word: string) => {
          if (word.length > 2 && !commonWords.has(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
          }
        });
      }
    });
    const topWords = Object.entries(wordFreq)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 10);

    return { totalMessages, textMessages, mediaMessages, perUser, byHour, byDay, topWords, topEmojis, topHours };
  }, [messages, participants]);

  const maxByHour = Math.max(...stats.byHour);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-1 overflow-y-auto bg-[#efeae2] dark:bg-[#0b141a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-[#e9edef] mb-6 flex items-center gap-2">
          <BarChart3 className="text-green-600" />
          Chat Analytics
        </h2>

        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard 
            icon={<MessageCircle className="text-blue-500" />} 
            label="Total Messages" 
            value={stats.totalMessages.toLocaleString()} 
          />
          <StatCard 
            icon={<Users className="text-purple-500" />} 
            label="Participants" 
            value={participants.length.toString()} 
          />
          <StatCard 
            icon={<Clock className="text-orange-500" />} 
            label="Media Files" 
            value={stats.mediaMessages.toLocaleString()} 
          />
        </div>

        {/* Highlight Stats */}
        <div className="bg-white dark:bg-[#202c33] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-[#8696a0] uppercase mb-4 flex items-center gap-2">
            <BarChart3 size={16} />
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                 <Clock size={20} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 dark:text-[#8696a0]">Busiest Time</p>
                 <p className="text-sm font-bold text-gray-800 dark:text-[#e9edef]">
                   {stats.topHours[0].hour}:00 - {stats.topHours[0].hour}:59 
                   <span className="text-[10px] font-normal text-gray-400 ml-2">({stats.topHours[0].count} messages)</span>
                 </p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                 <span className="text-xl">❤️</span>
               </div>
               <div>
                 <p className="text-xs text-gray-500 dark:text-[#8696a0]">Top Emoji</p>
                 <p className="text-sm font-bold text-gray-800 dark:text-[#e9edef]">
                   {stats.topEmojis[0]?.[0] || 'None'} 
                   <span className="text-[10px] font-normal text-gray-400 ml-2">({stats.topEmojis[0]?.[1] || 0} times)</span>
                 </p>
               </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Messages per User */}
          <div className="bg-white dark:bg-[#202c33] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-[#8696a0] uppercase mb-4 flex items-center gap-2">
              <Users size={16} />
              Messages per User
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.perUser)
                .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                .map(([user, count]: [string, any]) => (
                  <div key={user}>
                    <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-[#e9edef]">
                      <span className="truncate mr-2">{user}</span>
                      <span className="font-semibold">{count.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(count / stats.totalMessages) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Activity by Hour */}
          <div className="bg-white dark:bg-[#202c33] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-[#8696a0] uppercase mb-4 flex items-center gap-2">
              <Clock size={16} />
              Activity by Hour
            </h3>
            <div className="flex items-end justify-between h-40 gap-1 pt-6 relative group/container">
              {stats.byHour.map((count, hour) => (
                <div key={hour} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  <div 
                    className="w-full bg-green-500/40 group-hover:bg-green-500 transition-colors rounded-t-sm relative"
                    style={{ height: `${(count / maxByHour) * 100 || 2}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl font-bold border border-white/10">
                      {count} msgs
                    </div>
                  </div>
                  <span className="text-[8px] text-gray-400 mt-1 flex-shrink-0">
                    {hour % 6 === 0 ? `${hour}h` : ''}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-4 text-center italic">Hover over bars to see message counts</p>
          </div>

          {/* Activity by Day */}
          <div className="bg-white dark:bg-[#202c33] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-[#8696a0] uppercase mb-4 flex items-center gap-2">
              <Calendar size={16} />
              Activity by Day
            </h3>
            <div className="space-y-3">
              {stats.byDay.map((count, dayIndex) => (
                <div key={dayIndex} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 dark:text-[#8696a0] w-8">{days[dayIndex]}</span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-teal-500 h-full transition-all duration-1000" 
                      style={{ width: `${(count / Math.max(...stats.byDay)) * 100 || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-[#e9edef] w-10 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Words */}
          <div className="bg-white dark:bg-[#202c33] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-[#8696a0] uppercase mb-4 flex items-center gap-2">
              <MessageCircle size={16} />
              Most Used Words
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.topWords.length > 0 ? (
                stats.topWords.map(([word, count]) => (
                  <div 
                    key={word} 
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-2 border border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-[#e9edef]">{word}</span>
                    <span className="text-[10px] bg-green-500 text-white px-1.5 rounded-full">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No word data available</p>
              )}
            </div>
          </div>

          {/* Top Emojis */}
          <div className="bg-white dark:bg-[#202c33] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-[#8696a0] uppercase mb-4 flex items-center gap-2">
              <span className="text-lg">😀</span>
              Top Emojis
            </h3>
            <div className="flex flex-wrap gap-3">
              {stats.topEmojis.length > 0 ? (
                stats.topEmojis.map(([emoji, count]) => (
                  <div 
                    key={emoji} 
                    className="flex flex-col items-center p-2 bg-gray-50 dark:bg-[#2a3942] rounded-lg border border-gray-100 dark:border-gray-700 min-w-[50px]"
                  >
                    <span className="text-2xl mb-1">{emoji}</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-[#8696a0]">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No emoji data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white dark:bg-[#202c33] p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-[#8696a0] uppercase font-bold tracking-wider">{label}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-[#e9edef]">{value}</p>
    </div>
  </div>
);
