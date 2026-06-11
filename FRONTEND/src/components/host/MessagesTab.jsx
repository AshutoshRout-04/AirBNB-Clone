import { useState, useEffect } from "react"
import { MessageSquare, Calendar, Check, Send, Clock, BookOpen, ToggleLeft, ToggleRight, Sparkles, User, ShieldAlert, Plus, Trash2 } from "lucide-react"
import { useToast } from "../Toast"

export default function MessagesTab({ prefilledGuestName, prefilledMessage }) {
  const toast = useToast()
  
  // Conversations list
  const [conversations, setConversations] = useState([
    {
      id: 1,
      guestName: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80",
      lastMessage: "Thank you for the quick response! Can't wait to check-in.",
      time: "10:15 AM",
      unread: false,
      hasRequest: false,
      chatHistory: [
        { sender: "guest", text: "Hello! Is it possible to check in 1 hour early tomorrow?", time: "09:30 AM" },
        { sender: "host", text: "Hi Aarav, let me check with my cleaning crew. Yes, that should be absolutely fine! The keys will be in the lockbox.", time: "10:02 AM" },
        { sender: "guest", text: "Thank you for the quick response! Can't wait to check-in.", time: "10:15 AM" }
      ]
    },
    {
      id: 2,
      guestName: "Priya Patel",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
      lastMessage: "Sent you a booking request for June 15 - June 19.",
      time: "Yesterday",
      unread: true,
      hasRequest: true,
      requestDetails: {
        dates: "June 15 - June 19, 2026 (4 nights)",
        property: "Cozy Pine Cabin & Spa",
        payout: 18000,
        guests: 2,
        status: "PENDING"
      },
      chatHistory: [
        { sender: "guest", text: "Hi! Your cabin looks lovely. I just submitted a booking request. We are visiting Goa for our anniversary.", time: "08:14 PM" }
      ]
    },
    {
      id: 3,
      guestName: "Ryan Reynolds",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      lastMessage: "Do you have fiber internet at the loft?",
      time: "June 8",
      unread: false,
      hasRequest: false,
      chatHistory: [
        { sender: "guest", text: "Hi Ashutosh, do you have fiber internet at the loft? I will have to join a few video calls.", time: "02:11 PM" },
        { sender: "host", text: "Hi Ryan, yes! We have high-speed 200 Mbps fiber connection. You will have smooth connectivity.", time: "02:30 PM" }
      ]
    }
  ])

  const [activeConvId, setActiveConvId] = useState(1)
  const [activeSubTab, setActiveSubTab] = useState("chat") // 'chat' | 'scheduled'
  const [inputMsg, setInputMsg] = useState("")

  // Quick replies list (stored in state + templates modal option)
  const [quickReplies, setQuickReplies] = useState([
    { id: 1, name: "Check-in info", content: "Hi! Welcome to our stay. The keys are in the lockbox on the right side of the gate. The access code is 4829. WiFi name is StayBNB_WiFi and password is welcomehome! Let me know if you need anything." },
    { id: 2, name: "Check-out reminder", content: "Hi, hope you enjoyed your stay! A quick reminder that checkout is at 11:00 AM tomorrow. Please leave keys inside the lockbox, turn off the AC, and shut the door. Safe travels!" },
    { id: 3, name: "WiFi credentials", content: "WiFi Network: StayBNB_HighSpeed | Password: holidayvibes. The router is located next to the television." }
  ])
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [newReplyName, setNewReplyName] = useState("")
  const [newReplyText, setNewReplyText] = useState("")
  const [isAddingReply, setIsAddingReply] = useState(false)

  // Scheduled messages triggers list
  const [scheduledTriggers, setScheduledTriggers] = useState([
    { id: 1, label: "Check-in Instructions Autotext", triggerTime: "3 days before arrival", active: true, template: "Hi {guestName}, looking forward to hosting you soon! Check-in details: code is 4829, check-in starts at 3PM." },
    { id: 2, label: "Day After Check-in Followup", triggerTime: "1 day after check-in", active: true, template: "Hi {guestName}, hope you had a good night's sleep. Let me know if you need fresh towels or local restaurant recommendations!" },
    { id: 3, label: "Checkout Guideline Checklist", triggerTime: "Checkout day at 9:00 AM", active: false, template: "Hi {guestName}, friendly reminder checkout is today at 11:00 AM. Please lock the front door and let us know when you depart. Safe travels!" }
  ])
  
  // Custom Scheduler Form
  const [isAddingTrigger, setIsAddingTrigger] = useState(false)
  const [schedLabel, setSchedLabel] = useState("")
  const [schedTime, setSchedTime] = useState("3 days before arrival")
  const [schedText, setSchedText] = useState("")

  // Handle incoming prefilled messaging requests from TodayTab
  useEffect(() => {
    if (prefilledGuestName) {
      const existing = conversations.find(c => c.guestName.toLowerCase().includes(prefilledGuestName.toLowerCase()))
      if (existing) {
        setActiveConvId(existing.id)
        if (prefilledMessage) {
          setInputMsg(prefilledMessage)
        }
      } else {
        // Create new conversation block dynamically
        const newConv = {
          id: Date.now(),
          guestName: prefilledGuestName,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80",
          lastMessage: prefilledMessage || "Inquiry started",
          time: "Just now",
          unread: false,
          hasRequest: false,
          chatHistory: [
            { sender: "host", text: prefilledMessage || "Hello! How can I assist you with your booking?", time: "Just now" }
          ]
        }
        setConversations([newConv, ...conversations])
        setActiveConvId(newConv.id)
      }
    }
  }, [prefilledGuestName, prefilledMessage])

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0]

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return
    const newMsg = {
      sender: "host",
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedConversations = conversations.map(c => {
      if (c.id === activeConv.id) {
        return {
          ...c,
          lastMessage: inputMsg,
          time: "Just now",
          chatHistory: [...c.chatHistory, newMsg]
        }
      }
      return c
    })

    setConversations(updatedConversations)
    setInputMsg("")
    toast({
      type: "success",
      title: "Message Sent",
      message: `Sent to ${activeConv.guestName}.`
    })
  }

  const applyQuickReply = (text) => {
    setInputMsg(text)
    setShowQuickReplies(false)
  }

  const handleCreateQuickReply = () => {
    if (!newReplyName.trim() || !newReplyText.trim()) return
    const newReply = {
      id: Date.now(),
      name: newReplyName,
      content: newReplyText
    }
    setQuickReplies([...quickReplies, newReply])
    setNewReplyName("")
    setNewReplyText("")
    setIsAddingReply(false)
    toast({
      type: "success",
      title: "Quick Reply Saved",
      message: `Template "${newReplyName}" created successfully.`
    })
  }

  const handleDeleteQuickReply = (id) => {
    setQuickReplies(quickReplies.filter(q => q.id !== id))
  }

  const handleAcceptRequest = (convId) => {
    const updated = conversations.map(c => {
      if (c.id === convId && c.requestDetails) {
        return {
          ...c,
          hasRequest: false,
          unread: false,
          requestDetails: { ...c.requestDetails, status: "ACCEPTED" },
          chatHistory: [
            ...c.chatHistory,
            { sender: "host", text: "I have accepted your booking request! Welcome to candolim villa. Let me know if you need anything.", time: "Just now" }
          ]
        }
      }
      return c
    })
    setConversations(updated)
    
    // Simulate updating earnings
    try {
      const currentEarnings = parseFloat(localStorage.getItem("staybnb_simulated_earnings") || "36450")
      localStorage.setItem("staybnb_simulated_earnings", (currentEarnings + 18000).toString())
    } catch (_) {}

    toast({
      type: "success",
      title: "Request Approved",
      message: `Approved reservation request from Priya Patel. Payout added.`
    })
  }

  const handleDeclineRequest = (convId) => {
    const updated = conversations.map(c => {
      if (c.id === convId && c.requestDetails) {
        return {
          ...c,
          hasRequest: false,
          requestDetails: { ...c.requestDetails, status: "DECLINED" },
          chatHistory: [
            ...c.chatHistory,
            { sender: "host", text: "Unfortunately I cannot accommodate you for these dates as they are unavailable. Best of luck on your travels.", time: "Just now" }
          ]
        }
      }
      return c
    })
    setConversations(updated)
    toast({
      type: "info",
      title: "Request Declined",
      message: "Declined booking request."
    })
  }

  const toggleTriggerActive = (triggerId) => {
    setScheduledTriggers(
      scheduledTriggers.map(t => t.id === triggerId ? { ...t, active: !t.active } : t)
    )
    toast({
      type: "info",
      title: "Automation Updated",
      message: "Scheduled message trigger toggled."
    })
  }

  const handleAddScheduleTrigger = () => {
    if (!schedLabel.trim() || !schedText.trim()) return
    const newT = {
      id: Date.now(),
      label: schedLabel,
      triggerTime: schedTime,
      active: true,
      template: schedText
    }
    setScheduledTriggers([...scheduledTriggers, newT])
    setSchedLabel("")
    setSchedText("")
    setIsAddingTrigger(false)
    toast({
      type: "success",
      title: "Schedule Saved",
      message: "Automated trigger scheduled successfully."
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-[75vh]">
        
        {/* Left Sidebar: Conversations list */}
        <div className="w-80 border-r border-border flex flex-col shrink-0">
          
          {/* Subheader Selectors */}
          <div className="flex border-b border-border text-center text-xs font-bold font-sans">
            <button
              onClick={() => setActiveSubTab("chat")}
              className={`flex-1 py-4 border-b-2 transition cursor-pointer ${
                activeSubTab === "chat" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Conversations
            </button>
            <button
              onClick={() => setActiveSubTab("scheduled")}
              className={`flex-1 py-4 border-b-2 transition cursor-pointer ${
                activeSubTab === "scheduled" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Scheduled Auto-Texts
            </button>
          </div>

          {activeSubTab === "chat" ? (
            <div className="flex-1 overflow-y-auto divide-y divide-border/60">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-4 flex gap-3 hover:bg-muted/30 cursor-pointer select-none transition ${
                    activeConv.id === conv.id ? "bg-muted/50 border-l-4 border-primary pl-3" : ""
                  }`}
                >
                  <img
                    src={conv.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-xs text-foreground truncate">{conv.guestName}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{conv.time}</span>
                    </div>
                    <p className={`text-xs mt-1 truncate ${conv.unread ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                      {conv.lastMessage}
                    </p>
                    
                    {conv.hasRequest && (
                      <span className="inline-flex items-center text-[9px] bg-primary/10 text-primary font-black px-1.5 py-0.5 rounded mt-1.5 uppercase tracking-wide">
                        Pending Request
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Triggers</span>
                <button
                  onClick={() => setIsAddingTrigger(true)}
                  className="flex items-center gap-0.5 text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  <Plus size={12} /> Add new
                </button>
              </div>

              {scheduledTriggers.map((t) => (
                <div key={t.id} className="p-3 border border-border bg-muted/20 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-foreground">{t.label}</h5>
                      <span className="text-[9px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                        <Clock size={9} /> {t.triggerTime}
                      </span>
                    </div>
                    <button onClick={() => toggleTriggerActive(t.id)} className="cursor-pointer">
                      {t.active ? (
                        <ToggleRight className="text-primary" size={20} />
                      ) : (
                        <ToggleLeft className="text-muted-foreground" size={20} />
                      )}
                    </button>
                  </div>
                  <p className="italic text-muted-foreground/90 text-[10px] line-clamp-2">"{t.template}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Chat Pane / Config Workspace */}
        <div className="flex-1 flex flex-col justify-between bg-card min-w-0">
          
          {/* Active Header details */}
          <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={activeConv.avatar}
                alt=""
                className="h-10 w-10 rounded-full object-cover border"
              />
              <div>
                <h3 className="font-bold text-sm text-foreground">{activeConv.guestName}</h3>
                <span className="block text-[10px] text-muted-foreground">Active in Goa, India</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/5">
            
            {/* Booking request approval prompt card */}
            {activeConv.requestDetails && activeConv.requestDetails.status === "PENDING" && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 max-w-lg mx-auto shadow-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="text-primary mt-0.5 shrink-0" size={18} />
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">Review Booking Request</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Priya wishes to book your <strong className="text-foreground">{activeConv.requestDetails.property}</strong>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-card border border-border p-3 rounded-xl">
                  <div>
                    <span className="block text-[10px] text-muted-foreground uppercase font-bold">Dates</span>
                    <strong className="text-foreground">{activeConv.requestDetails.dates}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted-foreground uppercase font-bold">Payout</span>
                    <strong className="text-foreground">₹{activeConv.requestDetails.payout?.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(activeConv.id)}
                    className="flex-1 bg-primary hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(activeConv.id)}
                    className="flex-1 bg-card border border-border hover:bg-muted text-foreground text-xs font-bold py-2 rounded-xl transition cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Chat list */}
            {activeConv.chatHistory.map((msg, idx) => {
              const isHost = msg.sender === "host"
              return (
                <div
                  key={idx}
                  className={`flex ${isHost ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                      isHost
                        ? "bg-foreground text-background rounded-tr-none"
                        : "bg-muted border border-border/80 text-foreground rounded-tl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`block text-[8px] text-right mt-1 opacity-70 ${isHost ? "text-background/80" : "text-muted-foreground"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Typing box Area with Quick reply handles */}
          <div className="p-4 border-t border-border bg-card space-y-3 relative">
            
            {/* Quick replies slider panel */}
            {showQuickReplies && (
              <div className="absolute bottom-full left-0 right-0 bg-background border-t border-border shadow-2xl p-4 animate-fade-in space-y-3 max-h-56 overflow-y-auto">
                <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quick Reply Templates</span>
                  <button
                    onClick={() => setIsAddingReply(true)}
                    className="text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    Create Template
                  </button>
                </div>
                
                <div className="space-y-2">
                  {quickReplies.map((reply) => (
                    <div 
                      key={reply.id}
                      className="flex justify-between items-center hover:bg-muted/40 p-2 rounded-lg border border-border/40 text-xs"
                    >
                      <div 
                        onClick={() => applyQuickReply(reply.content)}
                        className="flex-1 cursor-pointer"
                      >
                        <strong className="text-foreground block">{reply.name}</strong>
                        <span className="text-[10px] text-muted-foreground line-clamp-1 italic">"{reply.content}"</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteQuickReply(reply.id)}
                        className="text-muted-foreground hover:text-red-500 p-1 cursor-pointer"
                        title="Delete template"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowQuickReplies(!showQuickReplies)}
                className="px-3.5 py-2.5 rounded-xl border border-border hover:bg-muted font-bold text-xs text-foreground cursor-pointer shrink-0 flex items-center gap-1"
              >
                <BookOpen size={13} className="text-primary" />
                Templates
              </button>

              <input
                type="text"
                placeholder={`Message ${activeConv.guestName}...`}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-medium"
              />

              <button
                onClick={handleSendMessage}
                className="p-3 bg-primary hover:bg-[var(--color-primary-hover)] text-white rounded-xl shadow-xs transition shrink-0 cursor-pointer"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Modal for Adding Automated Trigger */}
      {isAddingTrigger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-card rounded-2xl max-w-md w-full border border-border shadow-2xl overflow-hidden animate-fade-in flex flex-col">
            <div className="p-5 border-b border-border">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                Add Scheduled Message Automation
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">Automate messaging based on guest reservation timeline events.</p>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-foreground">Trigger Name</label>
                <input
                  type="text"
                  placeholder="e.g. WiFi code day after check-in"
                  value={schedLabel}
                  onChange={(e) => setSchedLabel(e.target.value)}
                  className="w-full rounded-xl border border-border p-2.5 text-xs bg-transparent text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-foreground">Trigger Schedule Event</label>
                <select
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className="w-full rounded-xl border border-border p-2.5 text-xs bg-transparent text-foreground"
                >
                  <option value="3 days before arrival">3 days before arrival</option>
                  <option value="1 day before arrival">1 day before arrival</option>
                  <option value="Day of arrival at 12:00 PM">Day of arrival at 12:00 PM</option>
                  <option value="1 day after check-in">1 day after check-in</option>
                  <option value="Checkout day at 9:00 AM">Checkout day at 9:00 AM</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-foreground">Message Template</label>
                <textarea
                  rows={4}
                  placeholder="Type message. Use {guestName} to automatically customize guest's name..."
                  value={schedText}
                  onChange={(e) => setSchedText(e.target.value)}
                  className="w-full rounded-xl border border-border p-3 text-xs bg-transparent text-foreground leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-2">
              <button 
                onClick={() => setIsAddingTrigger(false)}
                className="text-xs px-3.5 py-2 border border-border rounded-full hover:bg-muted font-bold text-foreground transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddScheduleTrigger}
                className="text-xs px-4.5 py-2 bg-foreground text-background rounded-full hover:opacity-90 font-bold transition cursor-pointer"
              >
                Schedule Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Modal for Adding Quick Reply Template */}
      {isAddingReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-card rounded-2xl max-w-md w-full border border-border shadow-2xl overflow-hidden animate-fade-in flex flex-col">
            <div className="p-5 border-b border-border">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                Add Quick Reply Template
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">Save pre-defined snippets you frequently text your guests.</p>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-foreground">Shortcut Tag Name</label>
                <input
                  type="text"
                  placeholder="e.g. WiFi Password"
                  value={newReplyName}
                  onChange={(e) => setNewReplyName(e.target.value)}
                  className="w-full rounded-xl border border-border p-2.5 text-xs bg-transparent text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-foreground">Message content</label>
                <textarea
                  rows={4}
                  placeholder="e.g. The wifi username is StayBNB..."
                  value={newReplyText}
                  onChange={(e) => setNewReplyText(e.target.value)}
                  className="w-full rounded-xl border border-border p-3 text-xs bg-transparent text-foreground leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-2">
              <button 
                onClick={() => setIsAddingReply(false)}
                className="text-xs px-3.5 py-2 border border-border rounded-full hover:bg-muted font-bold text-foreground transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateQuickReply}
                className="text-xs px-4.5 py-2 bg-foreground text-background rounded-full hover:opacity-90 font-bold transition cursor-pointer"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
