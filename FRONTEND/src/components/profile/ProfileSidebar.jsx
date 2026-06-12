import { Luggage, Users } from "lucide-react"

export default function ProfileSidebar({ activeTab, setActiveTab, userName }) {
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : "A"

  const tabs = [
    {
      id: "about",
      label: "About me",
      icon: (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e1f5eb] text-[#1c7844] text-[10px] font-bold">
          {firstLetter}
        </span>
      ),
    },
    {
      id: "trips",
      label: "Past trips",
      icon: <Luggage className="h-5 w-5 text-gray-500" />,
    },
    {
      id: "connections",
      label: "Connections",
      icon: <Users className="h-5 w-5 text-gray-500" />,
    },
  ]

  return (
    <div className="w-full md:w-64 shrink-0 pr-0 md:pr-8 md:border-r border-gray-100 flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile</h1>

      <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-3 md:pb-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3.5 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap md:w-full select-none
                ${
                  isActive
                    ? "bg-[#f3f3f3] text-gray-900 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
