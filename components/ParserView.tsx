import React, { useState, useContext } from 'react';
import { ArrowRight, Table as TableIcon, Sparkles, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { parseWeChatComments } from '../services/parserService';

export const ParserView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const { comments, setComments } = useContext(AppContext);
  const navigate = useNavigate();

  const handleConvert = () => {
    const parsed = parseWeChatComments(inputText);
    setComments(parsed);
  };

  const handleClear = () => {
    setInputText('');
    setComments([]);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-1 gap-4 h-full overflow-hidden">
        {/* Left Panel: Input */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-medium text-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <span>Raw Input</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden md:inline">Format: Name (Enter) Content (Enter)...</span>
                <button onClick={handleClear} className="text-slate-400 hover:text-red-500 transition-colors" title="Clear">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
          <div className="relative flex-1 bg-white">
            <textarea
                className="absolute inset-0 w-full h-full p-4 resize-none focus:outline-none text-base font-sans bg-white text-slate-900 placeholder:text-slate-400 leading-relaxed border-0"
                placeholder={`Paste your text here. Example:\n\n米草儿\n就应该这样。不能再跌了\n\n兰姐家政\n就应该这样...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                spellCheck={false}
            />
          </div>
        </div>

        {/* Middle Action */}
        <div className="flex flex-col justify-center items-center gap-4">
          <button
            onClick={handleConvert}
            disabled={!inputText.trim()}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:scale-110 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            title="Convert to Table"
          >
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Right Panel: Table */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
           <div className="p-4 border-b border-slate-100 bg-slate-50 font-medium text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4" />
                <span>Parsed Data</span>
            </div>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {comments.length} rows
            </span>
          </div>
          <div className="flex-1 overflow-auto bg-slate-50/50">
            {comments.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-slate-400 text-sm gap-2">
                <TableIcon className="w-8 h-8 opacity-20" />
                <p>No data parsed yet.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold border-b border-slate-200 w-1/3 bg-slate-50">Author</th>
                    <th className="px-4 py-3 font-semibold border-b border-slate-200 bg-slate-50">Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {comments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-900 align-top">
                        <div className="font-medium">{comment.author}</div>
                        {comment.isReply && (
                          <div className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-indigo-500 bg-indigo-50 inline-block px-1.5 py-0.5 rounded">
                            Reply to {comment.replyTo}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 align-top leading-relaxed break-words whitespace-pre-wrap">
                        {comment.content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="flex justify-end pt-2">
        <button
          disabled={comments.length === 0}
          onClick={() => navigate('/analysis')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
        >
          <Sparkles className="w-5 h-5" />
          <span>Analyze Sentiment with AI</span>
        </button>
      </div>
    </div>
  );
};