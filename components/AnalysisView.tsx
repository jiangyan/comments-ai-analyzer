import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { analyzeSentiment } from '../services/geminiService';
import { AnalyzedComment, SentimentType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader2, ThumbsUp, ThumbsDown, MinusCircle, Quote } from 'lucide-react';

const COLORS = {
  [SentimentType.SUPPORT]: '#22c55e', // Green
  [SentimentType.OPPOSE]: '#ef4444',  // Red
  [SentimentType.NEUTRAL]: '#94a3b8', // Gray
};

export const AnalysisView: React.FC = () => {
  const { comments, analyzedData, setAnalyzedData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have comments but no analysis yet, run it.
    if (comments.length > 0 && analyzedData.length === 0 && !loading) {
      setLoading(true);
      analyzeSentiment(comments)
        .then(data => {
          setAnalyzedData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to analyze comments. Check API Key or Try again.");
          setLoading(false);
        });
    }
  }, [comments, analyzedData.length, loading, setAnalyzedData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-lg font-medium">Gemini is analyzing {comments.length} comments...</p>
        <p className="text-sm opacity-75">Identifying landlords, buyers, and bystanders.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (analyzedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        No data to analyze. Please parse comments first.
      </div>
    );
  }

  // Calculate Stats
  const stats = {
    support: analyzedData.filter(c => c.sentiment === SentimentType.SUPPORT).length,
    oppose: analyzedData.filter(c => c.sentiment === SentimentType.OPPOSE).length,
    neutral: analyzedData.filter(c => c.sentiment === SentimentType.NEUTRAL).length,
  };

  const chartData = [
    { name: 'Landlords/Sellers (Support)', value: stats.support, color: COLORS[SentimentType.SUPPORT] },
    { name: 'Buyers/Critics (Oppose)', value: stats.oppose, color: COLORS[SentimentType.OPPOSE] },
    { name: 'Neutral', value: stats.neutral, color: COLORS[SentimentType.NEUTRAL] },
  ];

  const renderList = (type: SentimentType, title: string, icon: React.ReactNode, colorClass: string) => {
    const list = analyzedData.filter(c => c.sentiment === type);
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-w-[300px]">
        <div className={`p-4 border-b border-slate-100 ${colorClass} bg-opacity-10 flex items-center gap-2 font-bold`}>
          {icon}
          <span>{title} ({list.length})</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {list.map(item => (
            <div key={item.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-slate-900">{item.author}</span>
                {item.isReply && <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">Reply</span>}
              </div>
              <p className="text-sm text-slate-700 mb-2">{item.content}</p>
              <div className="text-xs text-slate-500 italic flex gap-1">
                 <Quote className="w-3 h-3 inline" /> {item.reasoning}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Top Section: Summary & Chart */}
      <div className="h-1/3 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex">
        <div className="flex-1 flex flex-col justify-center pl-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sentiment Analysis Result</h2>
          <p className="text-slate-500 mb-6">Analysis based on {analyzedData.length} comments regarding property price conspiracy.</p>
          
          <div className="grid grid-cols-3 gap-4 max-w-md text-center">
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600">{stats.support}</div>
              <div className="text-xs text-green-800 uppercase tracking-wide font-semibold">Support</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="text-2xl font-bold text-red-600">{stats.oppose}</div>
              <div className="text-xs text-red-800 uppercase tracking-wide font-semibold">Oppose</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-2xl font-bold text-slate-600">{stats.neutral}</div>
              <div className="text-xs text-slate-800 uppercase tracking-wide font-semibold">Neutral</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Categorized Lists */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {renderList(SentimentType.SUPPORT, "Landlords / Support", <ThumbsUp className="w-5 h-5 text-green-600" />, "bg-green-500")}
        {renderList(SentimentType.OPPOSE, "Buyers / Critics", <ThumbsDown className="w-5 h-5 text-red-600" />, "bg-red-500")}
        {renderList(SentimentType.NEUTRAL, "Neutral / Observers", <MinusCircle className="w-5 h-5 text-slate-600" />, "bg-slate-500")}
      </div>
    </div>
  );
};