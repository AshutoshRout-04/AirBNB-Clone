import { MessageSquare, Edit3 } from "lucide-react"

export default function ProfileAboutMeView({ profile, onEdit, onGetStarted, promptConfigs }) {
  const firstLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "A"

  // Check if any prompt or bio has been completed
  const hasPrompts = Object.values(profile.prompts).some((val) => val && val.trim() !== "")
  const hasBio = profile.bio && profile.bio.trim() !== ""

  return (
    <div className="flex-1 animate-fade-in">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">About me</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow active:scale-95 transition cursor-pointer select-none"
        >
          <Edit3 size={12} />
          <span>Edit</span>
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Main Grid: Avatar Card + Complete Profile Call to Action */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Column 1: Avatar Card */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 flex flex-col items-center justify-center text-center py-10">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-24 w-24 rounded-full object-cover shadow-md border border-gray-100"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-[#fae2f5] text-[#8e2e7b] text-4xl font-extrabold flex items-center justify-center shadow-inner select-none">
                {firstLetter}
              </div>
            )}
            <h3 className="text-2xl font-bold mt-4 text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">{profile.role}</p>
          </div>

          {/* Column 2 & 3: Complete Profile Call to Action */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <h4 className="text-xl font-bold text-gray-900">Complete your profile</h4>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                Your Airbnb profile is an important part of every reservation. Create yours to help other hosts and guests get to know you.
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white text-sm font-bold px-6 py-3 rounded-xl shadow hover:shadow-md active:scale-95 transition cursor-pointer select-none whitespace-nowrap"
            >
              Get started
            </button>
          </div>
        </div>

        {/* Dynamic Display of Bio and Prompts if filled */}
        {(hasBio || hasPrompts) && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-8 flex flex-col gap-6">
            {hasBio && (
              <div className="border-b border-gray-100 pb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">My biography</h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            )}

            {hasPrompts && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">My details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(profile.prompts).map(([key, val]) => {
                    if (!val || val.trim() === "") return null
                    const config = promptConfigs[key]
                    if (!config) return null

                    return (
                      <div key={key} className="flex items-center gap-3.5 py-2.5 px-3 rounded-xl bg-gray-50/50">
                        <span className="text-gray-500 shrink-0">{config.icon}</span>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                            {config.label}
                          </p>
                          <p className="text-sm font-semibold text-gray-700">{val}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews section */}
        <div className="border-t border-gray-100 pt-6">
          <button
            onClick={() => alert("Review display placeholder: You have not written any reviews yet.")}
            className="inline-flex items-center gap-2.5 text-gray-700 hover:text-gray-900 hover:underline text-sm font-semibold cursor-pointer select-none"
          >
            <MessageSquare size={16} className="text-gray-500" />
            <span>Show reviews I've written</span>
          </button>
        </div>
      </div>
    </div>
  )
}
