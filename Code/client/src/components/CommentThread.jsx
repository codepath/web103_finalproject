import Avatar from './Avatar'

// Static placeholder pending real comment data + posting (Match Comments,
// #7). No Figma reference exists for this yet, so it's a minimal mock
// list matching the app's existing card styling — swap the mock array
// and wire the input up when that's ready.
const mockComments = [
  { id: 1, author: 'AlbicelesteArmy', text: 'What a finish from Álvarez, that lead feels safe now.' },
  { id: 2, author: 'LesBleusForever', text: "Mbappé's equalizer came out of nowhere, still anyone's game." },
  { id: 3, author: 'MessiFanatic', text: 'Midfield control has been all Argentina since the 60th minute.' },
]

export default function CommentThread() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-dash bg-dash-card p-5">
      <p className="text-[16px] font-bold text-white">💬 Match Comments</p>
      <div className="flex flex-col gap-4">
        {mockComments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar name={comment.author} className="size-8 shrink-0 rounded-full" textClassName="text-[10px]" />
            <div className="flex flex-col gap-1">
              <p className="text-[12px] font-bold text-white">{comment.author}</p>
              <p className="text-[12px] text-secondary">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-dash bg-dash-sidebar p-3">
        <p className="text-[12px] text-secondary">Add a comment...</p>
      </div>
    </div>
  )
}
