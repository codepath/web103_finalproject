import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom'
import FeedbackProvider from '../context/FeedbackProvider.jsx'
import { useAsyncAction, useFeedback } from '../context/useFeedback.js'
import TripForm from '../components/TripForm.jsx'
import SlideOver from '../components/SlideOver.jsx'
import Spinner from '../components/Spinner.jsx'
import { api } from '../api.js'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const initial = { title: 'Seattle weekend', destination: 'Seattle', start_date: '2026-12-01', end_date: '2026-12-03', budget: '500' }
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
function OtherAction({ onClick }) {
  const { busy, run } = useAsyncAction()
  return <button disabled={busy} onClick={() => run(onClick)}>Other action</button>
}

describe('request feedback', () => {
  it('blocks repeated submissions and other mutations until save finishes', async () => {
    const saving = deferred()
    const onSubmit = vi.fn(() => saving.promise)
    const otherAction = vi.fn()
    const { container } = render(<FeedbackProvider>
      <TripForm initial={initial} submitLabel="Save changes" onSubmit={onSubmit} />
      <OtherAction onClick={otherAction} />
    </FeedbackProvider>)
    const form = container.querySelector('form')
    // Programmatic submit events also bypass neither the synchronous lock nor the disabled UI.
    fireEvent.submit(form)
    fireEvent.submit(form)
    fireEvent.click(screen.getByText('Other action'))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(otherAction).not.toHaveBeenCalled()
    expect(container.querySelector('fieldset').disabled).toBe(true)
    expect(screen.getByText('Other action').disabled).toBe(true)
    expect(form.getAttribute('aria-busy')).toBe('true')
    expect(container.querySelector('.spinner')).not.toBeNull()
    await act(async () => saving.resolve())
    expect(container.querySelector('fieldset').disabled).toBe(false)
    expect(screen.getByText('Save changes').disabled).toBe(false)
  })

  it('keeps field values, shows validation feedback, and unlocks the form after failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 400, json: async () => ({ error: 'End date must be on or after the start date.' }) })))
    const { container } = render(<FeedbackProvider>
      <TripForm initial={initial} submitLabel="Save changes" onSubmit={(body) => api('/trips/1', { method: 'PATCH', body })} />
    </FeedbackProvider>)
    await act(async () => fireEvent.submit(container.querySelector('form')))
    const notifications = screen.getByRole('region', { name: 'Notifications' })
    expect(within(notifications).getByRole('alert').textContent).toContain('End date')
    expect(container.querySelector('form [role="alert"]').textContent).toContain('End date')
    expect(screen.getByLabelText('Title').value).toBe(initial.title)
    expect(container.querySelector('fieldset').disabled).toBe(false)
  })

  it('turns a network failure into a recoverable error toast', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch') }))
    render(<FeedbackProvider><span>Ready</span></FeedbackProvider>)
    await act(async () => {
      await expect(api('/trips')).rejects.toThrow('Could not reach the server')
    })
    expect(screen.getByRole('alert').textContent).toContain('Check your connection')
  })

  it('keeps success toasts across navigation, pauses expiry on hover, and allows dismissal', async () => {
    vi.useFakeTimers()
    function Create() {
      const { notify } = useFeedback()
      const navigate = useNavigate()
      return <button onClick={() => { notify('Trip created.'); navigate('/trips') }}>Create</button>
    }
    render(<MemoryRouter initialEntries={['/new']}><FeedbackProvider><Routes>
      <Route path="/new" element={<Create />} />
      <Route path="/trips" element={<h1>Trips</h1>} />
    </Routes></FeedbackProvider></MemoryRouter>)
    fireEvent.click(screen.getByText('Create'))
    expect(screen.getByRole('heading').textContent).toBe('Trips')
    const toast = screen.getByRole('status').closest('.toast')
    fireEvent.mouseEnter(toast)
    act(() => vi.advanceTimersByTime(10000))
    expect(screen.getByRole('status').textContent).toBe('Trip created.')
    fireEvent.mouseLeave(toast)
    act(() => vi.advanceTimersByTime(6000))
    expect(screen.queryByText('Trip created.')).toBeNull()
  })

  it('keeps an activity panel open during save and restores closing when the request settles', async () => {
    const saving = deferred()
    const onClose = vi.fn()
    const { container } = render(<FeedbackProvider><SlideOver title="Edit activity" onClose={onClose}>
      <TripForm initial={initial} submitLabel="Save" onSubmit={() => saving.promise} />
    </SlideOver></FeedbackProvider>)
    fireEvent.submit(container.ownerDocument.querySelector('form'))
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.click(screen.getByLabelText('Close panel'))
    expect(onClose).not.toHaveBeenCalled()
    await act(async () => saving.resolve())
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('announces page loading while keeping the decorative spinner hidden from screen readers', () => {
    const { container } = render(<Spinner label="Loading trips…" />)
    expect(screen.getByRole('status').textContent).toContain('Loading trips')
    expect(container.querySelector('.spinner').getAttribute('aria-hidden')).toBe('true')
  })
})
