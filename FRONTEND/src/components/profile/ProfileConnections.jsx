import { useState } from "react"
import { CheckCircle2, ShieldCheck, Mail, Phone, Lock, Link2, Info } from "lucide-react"
import { useToast } from "../Toast"

export default function ProfileConnections() {
  const toast = useToast()
  
  const [connections, setConnections] = useState({
    google: { connected: true, name: "Asif Rout" },
    facebook: { connected: false, name: "" },
    apple: { connected: false, name: "" },
  })

  const toggleConnection = (provider, label) => {
    const isConnected = connections[provider].connected
    if (isConnected) {
      setConnections({
        ...connections,
        [provider]: { connected: false, name: "" },
      })
      toast({
        type: "info",
        title: "Account disconnected",
        message: `Your ${label} profile has been disconnected from your Airbnb account.`,
      })
    } else {
      setConnections({
        ...connections,
        [provider]: { connected: true, name: "Asif Rout" },
      })
      toast({
        type: "success",
        title: "Account connected",
        message: `Successfully linked your ${label} profile!`,
      })
    }
  }

  return (
    <div className="flex-1 animate-fade-in">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Connections</h2>
        <p className="text-sm text-gray-500 mt-1">Verify your info and link external profiles to show trust to other hosts and guests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Verified Info */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <ShieldCheck className="text-green-600 h-6 w-6" />
              <h3 className="text-lg font-bold text-gray-900">Verified information</h3>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              When hosts see verified details, it shows you are committed to safe interactions, making bookings easier.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Email address</p>
                    <p className="text-[10px] text-gray-500">asif****@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-700 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  <CheckCircle2 size={12} className="stroke-[3]" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Phone number</p>
                    <p className="text-[10px] text-gray-500">+91 *******890</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-700 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  <CheckCircle2 size={12} className="stroke-[3]" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Government ID</p>
                    <p className="text-[10px] text-gray-500">Provided &amp; matching identity check</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-700 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  <CheckCircle2 size={12} className="stroke-[3]" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-2 bg-blue-50/50 border border-blue-100 p-3.5 rounded-2xl">
            <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Your actual contact info is private and only shared once a booking is confirmed.
            </p>
          </div>
        </div>

        {/* Right Card: Connected Profiles */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <Link2 className="text-primary h-6 w-6" />
            <h3 className="text-lg font-bold text-gray-900">Connected accounts</h3>
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            Linking social accounts shares your verified status, helping build confidence in the community.
          </p>

          <div className="space-y-4">
            {/* Google */}
            <div className="flex items-center justify-between p-4.5 rounded-2xl border border-gray-150 shadow-sm hover:shadow transition">
              <div>
                <p className="text-sm font-bold text-gray-800">Google</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {connections.google.connected ? `Connected as ${connections.google.name}` : "Not connected"}
                </p>
              </div>
              <button
                onClick={() => toggleConnection("google", "Google")}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer select-none border shadow-sm active:scale-95
                  ${
                    connections.google.connected
                      ? "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                      : "bg-black hover:bg-neutral-850 border-black text-white"
                  }
                `}
              >
                {connections.google.connected ? "Disconnect" : "Connect"}
              </button>
            </div>

            {/* Facebook */}
            <div className="flex items-center justify-between p-4.5 rounded-2xl border border-gray-150 shadow-sm hover:shadow transition">
              <div>
                <p className="text-sm font-bold text-gray-800">Facebook</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {connections.facebook.connected ? `Connected as ${connections.facebook.name}` : "Not connected"}
                </p>
              </div>
              <button
                onClick={() => toggleConnection("facebook", "Facebook")}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer select-none border shadow-sm active:scale-95
                  ${
                    connections.facebook.connected
                      ? "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                      : "bg-black hover:bg-neutral-850 border-black text-white"
                  }
                `}
              >
                {connections.facebook.connected ? "Disconnect" : "Connect"}
              </button>
            </div>

            {/* Apple */}
            <div className="flex items-center justify-between p-4.5 rounded-2xl border border-gray-150 shadow-sm hover:shadow transition">
              <div>
                <p className="text-sm font-bold text-gray-800">Apple</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {connections.apple.connected ? `Connected as ${connections.apple.name}` : "Not connected"}
                </p>
              </div>
              <button
                onClick={() => toggleConnection("apple", "Apple")}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer select-none border shadow-sm active:scale-95
                  ${
                    connections.apple.connected
                      ? "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                      : "bg-black hover:bg-neutral-850 border-black text-white"
                  }
                `}
              >
                {connections.apple.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
