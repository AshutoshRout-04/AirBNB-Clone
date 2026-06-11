import { Map } from "lucide-react"

export default function FloatingMapButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs font-bold text-background shadow-xl transition hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
    >
      <Map size={15} className="stroke-[2.5]" />
      <span>Show map</span>
    </button>
  )
}
