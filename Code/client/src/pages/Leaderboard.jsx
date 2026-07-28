import StandingsTable from '../components/StandingsTable'
import { leaderboard } from '../mocks/leaderboard'

const steps = [
  { title: '1. Predict', body: 'Submit score predictions on World Cup matches' },
  { title: '2. Earn', body: 'Correct predictions earn points. Following a team doubles points.' },
  { title: '3. Climb', body: 'Rise through global rankings and unlock legendary badges.' },
]

const recentTopEarners = [
  { username: 'TacticalPro_99', result: '+450 pts', match: 'on Brazil vs Serbia (2-0)' },
  { username: 'GoalMachine', result: '+380 pts', match: 'on Argentina vs France (2-1)' },
  { username: 'DerKaiser', result: '+300 pts', match: 'on Germany vs Japan (3-0)' },
]

const predictionHistory = [
  { matchup: 'ARG 3-1 MEX', result: '✅ +320 pts', won: true },
  { matchup: 'FRA vs GER', result: '❌ -200 pts', won: false },
  { matchup: 'ESP 2-0 MAR', result: '✅ +280 pts', won: true },
]

export default function Leaderboard() {
  return (
    <div className="flex gap-6 p-6">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1 text-white">Fan Leaderboard</h1>
          <p className="text-[13px] text-secondary">
            2026 FIFA World Cup Edition — Compete with fans worldwide
          </p>
        </div>

        {/* Mechanics banner */}
        <div className="flex flex-col gap-4 rounded-2xl border border-primary bg-dashboard p-5">
          <p className="text-[16px] font-bold text-primary">How To Earn Points &amp; Climb</p>
          <div className="flex gap-5">
            {steps.map((step) => (
              <div key={step.title} className="flex flex-1 flex-col gap-1.5">
                <p className="text-[13px] font-bold text-white">{step.title}</p>
                <p className="text-[12px] text-secondary">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Your stats */}
        <div className="flex items-center gap-6 rounded-2xl border border-dash bg-dashboard p-5">
          <div className="flex size-[70px] shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
            <p className="text-[20px] font-extrabold text-primary">#47</p>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold text-white">Your Predictions Progress</p>
              <p className="text-[14px] font-semibold text-primary">8,230 pts</p>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-dash-input">
              <div className="h-full w-[47%] rounded-full bg-primary" />
            </div>
            <p className="text-[11px] text-secondary">
              Top Earning Team: <span className="font-bold text-white">Arsenal</span>
            </p>
          </div>
        </div>

        {/* Global leaderboard */}
        <StandingsTable variant="leaderboard" rows={leaderboard} />
      </div>

      {/* Right sidebar */}
      <aside className="flex w-[320px] shrink-0 flex-col gap-5 rounded-2xl border border-dash bg-dash-sidebar p-6">
        <div className="flex flex-col gap-3 rounded-xl border border-dash bg-dashboard p-4">
          <p className="text-[13px] font-bold uppercase text-primary">🔥 Recent Top Earners</p>
          <div className="flex flex-col">
            {recentTopEarners.map((earner, index) => (
              <div key={earner.username}>
                {index > 0 && <div className="my-2.5 h-px w-full bg-dash" />}
                <p className="text-[12px] font-semibold text-white">{earner.username}</p>
                <p className="text-[11px] text-secondary">
                  Won <span className="font-bold text-primary">{earner.result}</span> {earner.match}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-dash bg-dashboard p-4">
          <p className="text-[13px] font-bold uppercase text-white">⚡ Your Prediction History</p>
          <div className="flex flex-col gap-2">
            {predictionHistory.map((entry) => (
              <div key={entry.matchup} className="flex items-center justify-between">
                <p className="text-[12px] font-medium text-white">{entry.matchup}</p>
                <p className={`text-[11px] font-bold ${entry.won ? 'text-primary' : 'text-dash-live'}`}>
                  {entry.result}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg bg-primary p-3.5 text-[13px] font-bold uppercase text-dash-sidebar"
        >
          Submit Prediction
        </button>

        <div className="flex flex-col gap-2 rounded-xl border border-dash bg-dashboard p-4 text-[11px] text-secondary">
          <p className="font-bold uppercase">🏆 FIFA World Cup 2026</p>
          <p>
            Host Cities:{' '}
            <span className="font-semibold text-white">
              New York, Los Angeles, Mexico City, Toronto, Dallas, Atlanta
            </span>{' '}
            and 10 others across NA.
          </p>
        </div>
      </aside>
    </div>
  )
}
