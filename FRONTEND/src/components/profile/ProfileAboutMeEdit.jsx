import { useRef } from "react"
import { Camera } from "lucide-react"
import ProfilePromptInput from "./ProfilePromptInput"

export default function ProfileAboutMeEdit({
  profile,
  onChangeProfile,
  onDone,
  leftPrompts,
  rightPrompts,
}) {
  const fileInputRef = useRef(null)
  const firstLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "A"

  const handlePromptChange = (key, newValue) => {
    onChangeProfile({
      ...profile,
      prompts: {
        ...profile.prompts,
        [key]: newValue,
      },
    })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onChangeProfile({
          ...profile,
          avatar: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex-1 pb-24 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Avatar Section */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center relative">
          <div className="relative group">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-44 w-44 rounded-full object-cover shadow-md border border-gray-100"
              />
            ) : (
              <div className="h-44 w-44 rounded-full bg-[#e8e9fd] text-[#5659e0] text-6xl font-extrabold flex items-center justify-center shadow-inner select-none">
                {firstLetter}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />

            {/* Overlapping Add Button */}
            <button
              onClick={handleAddClick}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-md hover:shadow-lg rounded-full px-4 py-2 flex items-center gap-1.5 text-xs font-bold transition active:scale-95 cursor-pointer select-none"
            >
              <Camera size={14} className="text-gray-700" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Right Column: Prompts Grid */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-3xl font-bold text-gray-900">My profile</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed pb-6 border-b border-gray-100">
            Hosts and guests can see your profile and it may appear across Airbnb to help us build trust in our community.{" "}
            <a href="#" className="underline font-semibold text-gray-800 hover:text-black">
              Learn more
            </a>
          </p>

          {/* Grid of Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 mt-6">
            {/* Column 1 Prompts */}
            <div className="flex flex-col gap-1.5">
              {leftPrompts.map((prompt) => (
                <ProfilePromptInput
                  key={prompt.key}
                  label={prompt.label}
                  value={profile.prompts[prompt.key]}
                  icon={prompt.icon}
                  onChange={(val) => handlePromptChange(prompt.key, val)}
                />
              ))}
            </div>

            {/* Column 2 Prompts */}
            <div className="flex flex-col gap-1.5">
              {rightPrompts.map((prompt) => (
                <ProfilePromptInput
                  key={prompt.key}
                  label={prompt.label}
                  value={profile.prompts[prompt.key]}
                  icon={prompt.icon}
                  onChange={(val) => handlePromptChange(prompt.key, val)}
                />
              ))}
            </div>
          </div>

          {/* About me Bio section */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">About me</h3>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => onChangeProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself, your travels, or what you enjoy..."
              rows={4}
              className="w-full rounded-2xl border border-gray-300 p-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition resize-none bg-gray-50/20"
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Done Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4.5 px-6 md:px-12 flex justify-end z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl w-full mx-auto flex justify-end">
          <button
            onClick={onDone}
            className="bg-black hover:bg-neutral-800 text-white text-sm font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition cursor-pointer select-none"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
