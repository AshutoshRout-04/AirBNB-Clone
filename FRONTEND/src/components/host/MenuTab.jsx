import { useState, useEffect } from "react"
import { DollarSign, Shield, ArrowDownToLine, Star, Sparkles, TrendingUp, Sliders, Users, Award, Percent, Landmark } from "lucide-react"
import { useToast } from "../Toast"

export default function MenuTab() {
  const toast = useToast()

  const [activeSubTab, setActiveSubTab] = useState("earnings") // 'earnings' | 'insights' | 'settings'

  // Simulating state-bound earnings that updates when booking request is approved
  const [totalEarnings, setTotalEarnings] = useState(36450)
  
  // Settings values
  const [coHostEmail, setCoHostEmail] = useState("")
  const [coHostShare, setCoHostShare] = useState(15)
  const [donationPct, setDonationPct] = useState(5)
  const [payoutRoute, setPayoutRoute] = useState("bank")
  const [hasTaxDocument, setHasTaxDocument] = useState(true)

  useEffect(() => {
    // Read simulated earnings from local storage if available
    try {
      const stored = localStorage.getItem("staybnb_simulated_earnings")
      if (stored) {
        setTotalEarnings(parseFloat(stored))
      }
    } catch (_) {}
  }, [])

  // Simulate file download
  const handleDownloadReport = (format) => {
    toast({
      type: "info",
      title: "Generating Statement",
      message: `Compiling earnings details into ${format.toUpperCase()}...`
    })

    setTimeout(() => {
      const csvContent = [
        "StayBNB Payout Statement - June 2026",
        "Transaction ID,Date,Property,Guest,Payout Amount,Status",
        "TXN-9023,2026-06-08,Sunset Beachfront Villa,Aarav Sharma,12500,PAID",
        "TXN-9024,2026-06-10,Cozy Pine Cabin & Spa,Ananya Iyer,18000,PAID",
        "TXN-9025,2026-06-11,Modern Skyline Loft,Ryan Reynolds,5950,PAID",
        `Generated Total,,,,,₹${totalEarnings}`
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `staybnb_host_statement_june_2026.${format}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        type: "success",
        title: "Download Complete",
        message: `Your ${format.toUpperCase()} statement was saved.`
      })
    }, 1000)
  }

  // Earnings data for chart: 6 months history, 5 months projection
  // Dec, Jan, Feb, Mar, Apr, May (history) | Jun, Jul, Aug, Sep, Oct (projection)
  const chartData = [
    { month: "Dec", amount: 24000, isProjection: false },
    { month: "Jan", amount: 28500, isProjection: false },
    { month: "Feb", amount: 31000, isProjection: false },
    { month: "Mar", amount: 22000, isProjection: false },
    { month: "Apr", amount: 35000, isProjection: false },
    { month: "May", amount: 36450, isProjection: false },
    { month: "Jun", amount: totalEarnings, isProjection: true },
    { month: "Jul", amount: 48000, isProjection: true },
    { month: "Aug", amount: 42000, isProjection: true },
    { month: "Sep", amount: 39000, isProjection: true },
    { month: "Oct", amount: 46000, isProjection: true }
  ]

  const maxChartAmt = 50000

  // Insights Ratings
  const ratingFactors = [
    { name: "Cleanliness", score: 4.93, average: 4.75 },
    { name: "Accuracy of listing", score: 4.88, average: 4.68 },
    { name: "Communication speed", score: 4.96, average: 4.80 },
    { name: "Location appeal", score: 4.81, average: 4.70 },
    { name: "Check-in convenience", score: 4.78, average: 4.65 },
    { name: "Overall value", score: 4.85, average: 4.62 }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      
      {/* Sub tabs switcher */}
      <div className="flex bg-muted p-0.5 rounded-full text-xs font-bold w-full max-w-md mx-auto">
        <button
          onClick={() => setActiveSubTab("earnings")}
          className={`flex-1 py-2 rounded-full transition cursor-pointer text-center ${
            activeSubTab === "earnings" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Earnings
        </button>
        <button
          onClick={() => setActiveSubTab("insights")}
          className={`flex-1 py-2 rounded-full transition cursor-pointer text-center ${
            activeSubTab === "insights" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Performance & Insights
        </button>
        <button
          onClick={() => setActiveSubTab("settings")}
          className={`flex-1 py-2 rounded-full transition cursor-pointer text-center ${
            activeSubTab === "settings" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Account Settings
        </button>
      </div>

      {/* Main tab context */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        
        {/* 1. EARNINGS DASHBOARD VIEW */}
        {activeSubTab === "earnings" && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Cards info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-linear-to-b from-neutral-900 to-neutral-800 p-5 rounded-2xl text-white shadow-sm space-y-2 relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] text-white/5 opacity-50 font-sans font-black text-8xl">₹</div>
                <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Earnings This Month (June)</span>
                <h3 className="font-extrabold text-3xl">₹{totalEarnings?.toLocaleString()}</h3>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                  <TrendingUp size={12} /> +12% vs last month average
                </p>
              </div>

              <div className="border border-border p-5 rounded-2xl space-y-2">
                <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Next Scheduled Payout</span>
                <h3 className="font-extrabold text-2xl text-foreground">₹12,500</h3>
                <p className="text-xs text-muted-foreground">Releasing to Bank account ending 4829 on June 14, 2026.</p>
              </div>

              <div className="border border-border p-5 rounded-2xl space-y-2 flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Payout Documents</span>
                  <h3 className="font-bold text-sm text-foreground mt-1">Tax Year 2025 Forms Ready</h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownloadReport("csv")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-border bg-card hover:bg-muted text-[10px] font-bold text-foreground rounded-lg transition cursor-pointer"
                  >
                    <ArrowDownToLine size={12} /> CSV report
                  </button>
                  <button 
                    onClick={() => handleDownloadReport("pdf")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-foreground text-background hover:opacity-90 text-[10px] font-bold rounded-lg transition cursor-pointer"
                  >
                    <ArrowDownToLine size={12} /> PDF summary
                  </button>
                </div>
              </div>

            </div>

            {/* SVG Interactive Earnings Chart */}
            <div className="border border-border rounded-2xl p-5 space-y-4">
              <div>
                <h4 className="font-bold text-sm text-foreground">Earnings History & Projections</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Solid bars indicate actual past payouts, dashed bars represent projected future reservations.</p>
              </div>

              {/* Chart SVG Canvas */}
              <div className="w-full overflow-x-auto no-scrollbar">
                <div className="min-w-[700px] h-64 flex items-end justify-between px-4 pb-6 border-b border-border/80 relative">
                  
                  {/* Grid Lines */}
                  {[0, 10000, 20000, 30000, 40000, 50000].map((gridVal) => (
                    <div 
                      key={gridVal}
                      className="absolute left-0 right-0 border-t border-dashed border-border/40 text-[9px] font-semibold text-muted-foreground/80 pl-2"
                      style={{ bottom: `${(gridVal / maxChartAmt) * 100}%` }}
                    >
                      ₹{gridVal.toLocaleString()}
                    </div>
                  ))}

                  {/* Render Chart Bars */}
                  {chartData.map((data, idx) => {
                    const barHeightPct = (data.amount / maxChartAmt) * 100
                    return (
                      <div 
                        key={idx}
                        className="flex flex-col items-center gap-2 group relative z-10 w-12"
                        style={{ height: "100%" }}
                      >
                        {/* Interactive tooltip */}
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded shadow-md transition pointer-events-none whitespace-nowrap z-30">
                          {data.isProjection ? "Projected: " : "Payout: "} ₹{data.amount.toLocaleString()}
                        </div>

                        {/* Bar Shape */}
                        <div 
                          className={`w-8 rounded-t-md transition duration-300 mt-auto ${
                            data.isProjection 
                              ? "bg-primary/20 border-2 border-dashed border-primary hover:bg-primary/30" 
                              : "bg-primary hover:bg-[var(--color-primary-hover)] shadow-xs"
                          }`}
                          style={{ height: `${barHeightPct}%` }}
                        />

                        {/* Label */}
                        <span className="text-[10px] font-bold text-muted-foreground select-none">
                          {data.month}
                          {data.isProjection && "*"}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Recent Transaction Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Completed Transactions</h4>
              <div className="border border-border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 font-bold border-b border-border text-muted-foreground">
                      <th className="p-3">Reference ID</th>
                      <th className="p-3">Payout Date</th>
                      <th className="p-3">Accommodation</th>
                      <th className="p-3">Guest</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payout Pinned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr className="hover:bg-muted/10">
                      <td className="p-3 font-semibold">TXN-9023</td>
                      <td className="p-3">June 08, 2026</td>
                      <td className="p-3">Sunset Beachfront Villa</td>
                      <td className="p-3">Aarav Sharma</td>
                      <td className="p-3 font-bold">₹12,500</td>
                      <td className="p-3"><span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">SUCCESS</span></td>
                    </tr>
                    <tr className="hover:bg-muted/10">
                      <td className="p-3 font-semibold">TXN-9024</td>
                      <td className="p-3">June 10, 2026</td>
                      <td className="p-3">Cozy Pine Cabin & Spa</td>
                      <td className="p-3">Ananya Iyer</td>
                      <td className="p-3 font-bold">₹18,000</td>
                      <td className="p-3"><span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">SUCCESS</span></td>
                    </tr>
                    <tr className="hover:bg-muted/10">
                      <td className="p-3 font-semibold">TXN-9025</td>
                      <td className="p-3">June 11, 2026</td>
                      <td className="p-3">Modern Skyline Loft</td>
                      <td className="p-3">Ryan Reynolds</td>
                      <td className="p-3 font-bold">₹5,950</td>
                      <td className="p-3"><span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px]">PROCESSING</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. INSIGHTS & PERFORMANCE VIEW */}
        {activeSubTab === "insights" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Left 2 cols: Ratings Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Star size={18} className="text-primary fill-primary" />
                  Your Rating Analysis: 4.88
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Rating scores based on guests leaving overall feedback over the last 12 months.</p>
              </div>

              {/* Progress meters */}
              <div className="space-y-4">
                {ratingFactors.map((fact) => {
                  const percentWidth = (fact.score / 5.0) * 100
                  return (
                    <div key={fact.name} className="space-y-1.5">
                      <div className="flex justify-between items-baseline text-xs font-semibold">
                        <span className="text-foreground">{fact.name}</span>
                        <div className="flex gap-2">
                          <span className="text-foreground">{fact.score} ★</span>
                          <span className="text-emerald-500 font-bold text-[10px]">
                            (+{(fact.score - fact.average).toFixed(2)} vs local avg)
                          </span>
                        </div>
                      </div>

                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden relative border border-border/10">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${percentWidth}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right col: Pro Recommendations */}
            <div className="space-y-6">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Sparkles size={18} className="text-amber-500" />
                Performance Boosters
              </h3>

              <div className="space-y-4">
                <div className="bg-[#f7faf9] border border-[#d2e0dc] p-4 rounded-xl space-y-1.5">
                  <h4 className="font-bold text-xs text-[#166534] uppercase tracking-wider">Superhost Goal Progress</h4>
                  <p className="text-xs text-neutral-800 font-bold">Response Rate: 98% (Target: &gt;90%)</p>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">Excellent work! Keep replying within 24 hours. Your response speed is in the top 5% of candidate hosts in candolim.</p>
                </div>

                <div className="bg-[#fffbeb] border border-[#fef3c7] p-4 rounded-xl space-y-1.5">
                  <h4 className="font-bold text-xs text-[#92400e] uppercase tracking-wider">Check-in Improvement Tip</h4>
                  <p className="text-xs text-neutral-800 font-bold">Check-in Rating: 4.78 (Target: &gt;4.85)</p>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">Some guests reported lockbox dials getting jammed in high humidity. Upgrading to a digital smart lock will automate code routing and boost check-in ratings.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 3. ACCOUNT & SETTINGS VIEW */}
        {activeSubTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Co-hosting */}
              <div className="space-y-4 border border-border p-5 rounded-2xl bg-muted/5">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Users size={18} className="text-primary" /> Co-Host Network
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Delegate tasks (like key handovers or cleaning schedules) to other experienced hosts. They receive direct payout routing percentages.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-foreground">Co-Host Email address</label>
                    <input
                      type="email"
                      placeholder="cohost@gmail.com"
                      value={coHostEmail}
                      onChange={(e) => setCoHostEmail(e.target.value)}
                      className="w-full rounded-xl border border-border px-3.5 py-2 text-xs bg-transparent outline-none focus:border-primary text-foreground font-semibold"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-foreground">
                      <span>Co-Host Share commission</span>
                      <span>{coHostShare}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="5"
                      value={coHostShare}
                      onChange={(e) => setCoHostShare(parseInt(e.target.value))}
                      className="w-full accent-primary cursor-pointer mt-1"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!coHostEmail) return
                      toast({
                        type: "success",
                        title: "Invitation Sent",
                        message: `Sent co-host invite to ${coHostEmail} with a ${coHostShare}% commission split.`
                      })
                      setCoHostEmail("")
                    }}
                    className="w-full py-2 bg-foreground text-background text-xs font-extrabold rounded-xl hover:opacity-90 transition cursor-pointer"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>

              {/* Payout & Taxes Settings */}
              <div className="space-y-4 border border-border p-5 rounded-2xl bg-muted/5 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Landmark size={18} className="text-primary" /> Payout Routing & Taxes
                  </h4>
                  
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-foreground">Default Payment Destination</label>
                    <select
                      value={payoutRoute}
                      onChange={(e) => setPayoutRoute(e.target.value)}
                      className="w-full rounded-xl border border-border px-3 py-2 text-xs bg-transparent outline-none text-foreground font-semibold"
                    >
                      <option value="bank">HDFC Bank account (ending 4829)</option>
                      <option value="paypal">PayPal Direct Routing (ashutosh@pay.com)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">Tax reporting document</span>
                      <span className="text-[10px] text-muted-foreground">Form 1099 filing sync status</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      VERIFIED SYNC
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toast({ type: "success", title: "Settings Saved", message: "Payout routing rules successfully updated." })}
                  className="w-full py-2.5 bg-neutral-800 text-white text-xs font-extrabold rounded-xl hover:bg-neutral-900 transition cursor-pointer"
                >
                  Save Payout Routing
                </button>
              </div>

            </div>

            {/* Airbnb.org Donations */}
            <div className="border border-border p-5 rounded-2xl bg-[#fffaf5] border-[#fdecd5] space-y-4">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-full shrink-0">
                  <Percent size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#7c2d12]">Airbnb.org Donation Percentage</h4>
                  <p className="text-xs text-[#9a3412] mt-1 leading-relaxed">
                    Donate a portion of your payouts to help fund temporary housing for people in crisis, such as evacuees fleeing natural disasters. Contributions are tax-deductible.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
                <div className="flex-1 max-w-sm space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#7c2d12]">
                    <span>Donation Level</span>
                    <span>{donationPct}% of each payout</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={donationPct}
                    onChange={(e) => setDonationPct(parseInt(e.target.value))}
                    className="w-full accent-[#f97316] cursor-pointer mt-1"
                  />
                </div>

                <button
                  onClick={() => toast({
                    type: "success",
                    title: "Donation Level Saved",
                    message: `Thank you! ${donationPct}% of all future reservation payouts will be routed directly to Airbnb.org.`
                  })}
                  className="px-5 py-2.5 bg-foreground text-background text-xs font-extrabold rounded-xl hover:opacity-90 transition cursor-pointer"
                >
                  Confirm Donation Percent
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  )
}
