import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, Plus, MessageSquare, User, Bot, Image as ImageIcon, X, Loader2, LogOut, ArrowRight, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { sendMessageToAI } from './services/ai';
import { auth, signInWithGoogle, logout, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Chat State
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return unsubscribe;
    }, []);

    // Firestore Real-time Listener
    useEffect(() => {
        if (!user) {
            setMessages([]);
            return;
        }

        // Reference to the user's messages collection
        const messagesRef = collection(db, 'users', user.uid, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // If history is empty, show welcome message locally (optional)
            if (fetchedMessages.length === 0) {
                setMessages([{ role: 'assistant', content: 'Hello! I am your professional AI assistant. How can I help you today?' }]);
            } else {
                setMessages(fetchedMessages);
            }
        });

        return () => unsubscribe();
    }, [user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if ((!input.trim() && !image) || isLoading || !user) return;

        const textPayload = input;
        const imagePayload = image;

        setInput('');
        setImage(null);
        setIsLoading(true);

        try {
            // 1. Save User Message to Firestore
            const messagesRef = collection(db, 'users', user.uid, 'messages');
            await addDoc(messagesRef, {
                role: 'user',
                content: textPayload,
                attachment: imagePayload,
                createdAt: serverTimestamp()
            });

            // 2. Get AI Response
            // We pass local messages as history context.
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await sendMessageToAI(textPayload, imagePayload, history);

            // 3. Save AI Response to Firestore
            await addDoc(messagesRef, {
                role: response.role, // 'assistant'
                content: response.content, // 'response text'
                createdAt: serverTimestamp()
            });

        } catch (e) {
            console.error(e);
            const messagesRef = collection(db, 'users', user.uid, 'messages');
            await addDoc(messagesRef, {
                role: 'assistant',
                content: "⚠️ **Error:** I couldn't get a response. \n\n1. Check your `VITE_GEMINI_API_KEY` in `.env`. \n2. Check your internet connection.",
                createdAt: serverTimestamp()
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
        e.target.value = null; // reset
    };

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            alert("Login Failed. Please check your Firebase Config in .env");
        }
    }

    if (authLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
                <Loader2 className="animate-spin" size={48} />
            </div>
        )
    }

    // LOGIN SCREEN
    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
                {/* Abstract Background Decoration */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />

                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in-up">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                            <Sparkles className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Sign in to continue to ProBot AI</p>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-white text-slate-900 font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all hover:scale-[1.02] shadow-xl group"
                    >
                        {/* Google Icon SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // CHAT APP
    return (
        <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-[#0f172a] text-slate-300 transition-all duration-300 flex flex-col overflow-hidden whitespace-nowrap border-r border-slate-800 shadow-2xl z-20`}>
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 font-bold text-white tracking-wide">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Bot size={22} className="text-white" />
                        </div>
                        <span className="text-lg">ProBot AI</span>
                    </div>
                </div>

                <div className="px-4 py-3">
                    <button onClick={() => setMessages([{ role: 'assistant', content: 'Hello. I am your professional assistant. How can I help you achieve your goals today?' }])} className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-medium border border-blue-500/50">
                        <Plus size={18} /> New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">Recent History</div>
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left truncate group">
                            <MessageSquare size={16} className="group-hover:text-blue-400 transition-colors" /> Previous Session...
                        </button>
                    </div>
                </div>

                {/* User Profile in Sidebar */}
                <div className="p-4 border-t border-slate-800/50 bg-[#0B1120]">
                    <div className="flex items-center gap-3 mb-3">
                        {user?.photoURL ? (
                            <img src={user.photoURL} className="w-8 h-8 rounded-full border border-slate-600" alt="User" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                                <User size={16} />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.displayName || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative bg-[#f8fafc]">

                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shrink-0 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-sm font-semibold text-slate-800">Current Session</h1>
                            <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Header Tools */}
                    </div>
                </header>

                {/* Chat Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-gradient-to-br from-slate-50 to-slate-100/50">
                    <div className="max-w-4xl mx-auto space-y-6 pb-4">
                        {messages.map((msg, idx) => {
                            const isUser = msg.role === 'user';
                            return (
                                <div key={idx} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start group`}>

                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${isUser ? 'bg-white border-slate-200' : 'bg-blue-600 border-blue-600 text-white'
                                        }`}>
                                        {isUser ? (
                                            user?.photoURL ? <img src={user.photoURL} className="w-full h-full rounded-full" alt="Me" /> : <User size={16} className="text-slate-500" />
                                        ) : <Bot size={18} />}
                                    </div>

                                    <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                                        {/* Name Label */}
                                        <span className={`text-[10px] font-medium text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                                            {isUser ? 'You' : 'ProBot AI'}
                                        </span>

                                        <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${isUser
                                            ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tr-sm'
                                            : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-sm'
                                            }`}>
                                            {msg.attachment && (
                                                <img src={msg.attachment} alt="Attachment" className="max-w-xs rounded-lg mb-3 border border-slate-100" />
                                            )}
                                            <div className="prose prose-slate prose-sm max-w-none">
                                                <Markdown>{msg.content}</Markdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex gap-4 items-start animate-pulse">
                                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 opacity-50">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <div className="flex items-center gap-1.5 h-9 px-2">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </main>

                {/* Input Area */}
                <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 shrink-0">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col gap-2 relative bg-white border border-slate-200 shadow-sm rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-400 transition-all">

                            {image && (
                                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                                    <img src={image} alt="Preview" className="h-12 w-12 object-cover rounded-lg" />
                                    <button onClick={() => setImage(null)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-end gap-2 p-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`p-2.5 rounded-xl transition-all ${image ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                    title="Attach Image"
                                >
                                    <ImageIcon size={20} />
                                </button>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message to ProBot..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 resize-none max-h-32 py-2.5 text-sm"
                                    rows={1}
                                    style={{ minHeight: '44px' }}
                                />

                                <button
                                    onClick={handleSend}
                                    disabled={(!input.trim() && !image) || isLoading}
                                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 active:scale-95"
                                >
                                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-slate-400 mt-3">AI generates responses. Check for accuracy.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
