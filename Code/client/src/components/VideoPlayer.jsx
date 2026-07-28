// Static placeholder pending the real video embed (Video Highlights, #8).
// Swap the contents of the thumbnail block for a real player/embed —
// the surrounding title prop and layout can stay as-is.
export default function VideoPlayer({ title = 'Match Highlights' }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dash bg-dash-card p-4">
      <div className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-lg bg-black/40">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary">
          <span className="ml-0.5 text-[18px] text-black">▶</span>
        </div>
      </div>
      <p className="text-[13px] font-bold text-white">{title}</p>
    </div>
  )
}
