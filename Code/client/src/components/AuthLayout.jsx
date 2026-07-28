import { Link } from 'react-router-dom'
import { AUTH_ORIGIN } from '../config/api'
import GitHubMark from './GitHubMark'
import ballMark from '../assets/ball.png'
import ballFrame from '../assets/ball-frame.svg'

const AUTH_URL = `${AUTH_ORIGIN}/auth`

// Shared shell for /login and /signup — the two-column layout, brand marks,
// GitHub button and footer are pixel-identical between the two Figma frames;
// only the heading copy, form fields and spacing differ per page.
export default function AuthLayout({
  title,
  subtitle,
  paddingClassName,
  gapClassName,
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
  children,
}) {
  return (
    <div className="flex min-h-screen bg-dashboard">
      <div
        className={`flex w-full flex-col justify-between px-6 sm:px-10 lg:w-[600px] lg:shrink-0 lg:border-r lg:border-dash lg:px-16 ${paddingClassName}`}
      >
        <div className="flex items-center gap-2">
          <img src={ballMark} alt="" className="size-8 shrink-0" />
          <p className="whitespace-nowrap text-[22px] font-extrabold tracking-tight text-white">
            Match<span className="text-primary">L</span>ens
          </p>
        </div>

        <div className={`flex w-full flex-col ${gapClassName}`}>
          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-bold text-white">{title}</h1>
            <p className="text-[15px] text-secondary">{subtitle}</p>
          </div>

          {children}

          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-dash" />
            <p className="whitespace-nowrap text-[11px] font-semibold text-secondary">OR CONTINUE WITH</p>
            <div className="h-px flex-1 bg-dash" />
          </div>

          <a
            href={`${AUTH_URL}/github`}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-dash py-[14px] text-[14px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
          >
            <GitHubMark />
            Continue with GitHub
          </a>

          <p className="text-center text-[14px] font-semibold text-secondary">
            {footerPrompt} <Link to={footerLinkTo} className="text-primary">{footerLinkLabel}</Link>
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 pt-10 text-center text-secondary">
          <p className="text-[13px]">Terms of Service&nbsp;&nbsp;·&nbsp;&nbsp;Privacy Policy&nbsp;&nbsp;·&nbsp;&nbsp;Help Center</p>
          <p className="text-[11px]">v2.4.0-Stable&nbsp;&nbsp;·&nbsp;&nbsp;Systems Operational</p>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-center bg-dashboard/65 lg:flex">
        <div className="flex flex-col items-center gap-4">
          <img src={ballFrame} alt="" className="size-[120px]" />
          <p className="text-[36px] font-extrabold tracking-tight text-white">
            Match<span className="text-primary">L</span>ens
          </p>
          <p className="text-[16px] text-secondary">Your ultimate arena companion</p>
        </div>
      </div>
    </div>
  )
}
