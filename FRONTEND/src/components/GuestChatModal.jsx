import { useState, useEffect, useRef } from "react"
import { X, Send, MessageSquare, RefreshCw } from "lucide-react"
import { Client } from "@stomp/stompjs"
import axios from "axios"

export default function GuestChatModal({ booking, guestName, onClose }) {
  const [messages, setMessages] = useState([])
  const [inputMsg, setInputMsg] = useState("")
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const stompClientRef = useRef(null)
  const subscriptionRef = useRef(null)
  const bottomRef = useRef(null)

  const bookingId = booking?.bookingId
  const propertyTitle = booking?.property?.title || "your stay"

  // Load chat history from backend
  const loadHistory = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:8086/api/v1/chat/booking/${bookingId}`)
      const data = res.data || []
      if (data.length > 0) {
        setMessages(data)
      } else {
        // Default welcome message
        setMessages([
          {
            sender: "host",
            text: `Hi ${guestName || "there"}! Welcome to ${propertyTitle}. Feel free to ask me anything about your stay.`,
            time: ""
          }
        ])
      }
    } catch (err) {
      console.warn("Could not load chat history:", err)
      setMessages([
        {
          sender: "host",
          text: `Hi! I'm your host for ${propertyTitle}. Feel free to ask me anything.`,
          time: ""
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Connect to WebSocket
  useEffect(() => {
    if (!bookingId) return

    loadHistory()

    const client = new Client({
      brokerURL: "ws://localhost:8086/ws-chat/websocket",
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        // Subscribe to this booking's topic
        const sub = client.subscribe(`/topic/booking/${bookingId}`, (message) => {
          const msg = JSON.parse(message.body)
          setMessages(prev => {
            // Deduplicate
            const exists = prev.some(m => m.text === msg.text && m.sender === msg.sender && m.time === msg.time)
            return exists ? prev : [...prev, msg]
          })
        })
        subscriptionRef.current = sub
      },
      onDisconnect: () => setConnected(false),
      onWebSocketError: () => setConnected(false),
      onStompError: () => setConnected(false),
    })

    client.activate()
    stompClientRef.current = client

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe()
      client.deactivate()
    }
  }, [bookingId])

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const handleSend = () => {
    if (!inputMsg.trim()) return
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const chatMsg = { sender: "guest", text: inputMsg.trim(), bookingId, time }

    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/app/chat/${bookingId}`,
        body: JSON.stringify(chatMsg)
      })
    } else {
      // Offline fallback — show locally
      setMessages(prev => [...prev, chatMsg])
    }
    setInputMsg("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      {/* Backdrop close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 flex flex-col w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in" style={{ height: "min(580px, 90vh)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare size={15} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground leading-none">Message Host</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[200px]">{propertyTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${connected ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
              {connected ? "Live" : "Offline"}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground cursor-pointer transition">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/5">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw size={20} className="animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-8">No messages yet. Say hi! 👋</div>
          ) : (
            messages.map((msg, i) => {
              const isGuest = msg.sender === "guest"
              return (
                <div key={i} className={`flex ${isGuest ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                    isGuest
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}>
                    <p>{msg.text}</p>
                    {msg.time && (
                      <span className={`block mt-1 text-[9px] ${isGuest ? "text-white/60" : "text-muted-foreground"}`}>
                        {msg.time}
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="shrink-0 px-3 py-3 border-t border-border bg-background flex items-end gap-2">
          <textarea
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message to your host..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition min-h-[38px] max-h-[100px]"
            style={{ fieldSizing: "content" }}
          />
          <button
            onClick={handleSend}
            disabled={!inputMsg.trim()}
            className="shrink-0 p-2.5 bg-primary hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
