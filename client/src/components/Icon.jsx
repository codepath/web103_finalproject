const paths = {
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm4 5-2.5 5.5L8 16l2.5-5.5L16 8Z',
  map: 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15',
  calendar: 'M7 3v4m10-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 9h1m3 0h1m3 0h1m-9 3h1m3 0h1',
  wallet: 'M20 8H5a2 2 0 0 1 0-4h13v4M4 6v13a1 1 0 0 0 1 1h15V8m0 4h-5v4h5m-3-2h.01',
  people: 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 8v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-15a4 4 0 0 1 0 7m3 2a4 4 0 0 1 2 4v2',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  back: 'M19 12H5m6-6-6 6 6 6',
  plus: 'M12 5v14M5 12h14',
  pin: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Zm-7-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  ticket: 'M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5Zm10 0v3m0 3v2m0 3v3',
  heart: 'M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 8 15 8 15s13-10 8-15Z',
  check: 'm5 12 4 4L19 6',
  logout: 'M9 4H4v16h5m5-12 4 4-4 4m-6-4h10',
  leaf: 'M5 20C2 8 10 4 21 3c-1 11-5 19-16 14m0 3L17 8',
}

export default function Icon({ name = 'compass', className = '', ...props }) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}><path d={paths[name] || paths.compass} /></svg>
}
