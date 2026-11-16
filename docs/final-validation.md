# Final validation and recording guide

Live app: https://triptogether-planner.onrender.com

Use the live site for final evidence. Existing GIFs demonstrate the six core
features but predate the final design and GitHub authentication. The new single-account recording is described below. Do not mark the remaining
checks complete until someone actually performs them.

## Test preparation

- Use two real GitHub accounts in separate browser profiles, labeled A and B below.
- For the starter-trip demonstration, at least one account must never have signed
  into this database. Logging out, clearing cookies, or changing browsers does not
  turn an existing account into a new user.
- Ask teammates whether someone they know is willing to test with their own
  account. Testers need only the live link, not database credentials or OAuth secrets.
- Use a disposable trip you create yourself. Do not reset the shared database or
  remove anyone else's account to manufacture a first-login demonstration.

## Live acceptance checklist

- [ ] **Login and refresh:** A signs in with GitHub, sees their avatar/name, and
  refreshes `/trips` without losing the session.
- [ ] **Starter trip:** A genuinely new account sees one `Your first trip` with
  three sample activities, upcoming dates and organizer access. After logout/login,
  the same starter trip remains and no additional copy appears.
- [ ] **Trip CRUD and redirect:** A creates `Final demo trip` with a destination,
  future dates and a budget, reaches its details page, and edits its settings.
- [ ] **Join and relationships:** B joins A's trip with its invite code. Both
  accounts see the updated member list; A is organizer and B is member.
- [ ] **Activity CRUD and slide-out:** A adds an activity in the side panel, closes
  it, edits it, and later deletes the disposable activity. Check Escape, the close
  button and keyboard Tab/Shift+Tab while the panel is open.
- [ ] **Daily filter:** Add activities on different trip days and show the date
  selector filtering the list without changing the page URL.
- [ ] **Voting:** B votes for A's activity, removes the vote and votes again.
  Verify the count and selected button state. Refresh to confirm persistence.
- [ ] **Permissions:** B cannot edit A's activity/expense or change trip settings.
  A can manage the trip, and each participant can manage their own suggestions.
- [ ] **Expense CRUD:** Add an expense with a member as payer, edit its amount,
  observe total/remaining/over-budget feedback, then delete the test expense.
- [ ] **Server validation failure:** In trip settings, submit an end date earlier
  than the start date. Show the returned error/Toast and unchanged saved dates,
  correct the dates, and submit successfully. This reaches server validation;
  an empty required field or negative number blocked only by HTML is insufficient
  evidence of server-side validation.
- [ ] **Pending controls and spinner:** Use Slow 3G in developer tools. Navigate to
  a page to show its spinner; submit an activity once, then try clicking again.
  Inputs/actions/close controls should stay disabled until completion, only one
  record should appear, and a success Toast should follow. Restore normal networking.
- [ ] **Error recovery:** Use an invalid invite code and show the error Toast.
  Dismiss it; form values remain available for correction.
- [ ] **Navigation and layout:** Refresh itinerary, expenses and settings directly;
  check that no page is blank and the mobile layout has no horizontal overflow.
- [ ] **Logout protection:** Log out, refresh a protected URL, and confirm it
  redirects to login. Log back in and confirm the requested page is restored.
- [ ] **Cleanup:** Delete only the disposable records/trip created for this test.

## Final walkthrough outline

Yugant's tracking issue: https://github.com/codepath-12/web103_finalproject/issues/32

1. Show the live URL, GitHub login and authenticated account area.
2. Show a new user's starter trip and its activities, if a first-time tester is available.
3. Create a test trip, show the redirect and share the invite code with B.
4. Show B joining, member roles and a restricted organizer option.
5. Add/edit an activity in the slide-out, filter by date and show voting.
6. Record/edit/delete an expense and show the budget changing.
7. Demonstrate the rejected invalid date submission and successful correction.
8. Briefly show a spinner, disabled pending controls and success/error Toasts.
9. Finish with logout and protected-page behavior.

Keep the capture readable and limited to relevant app windows. Do not record
OAuth client secrets, database connection strings or private account settings.
Schema relationships and reset scripts can be linked as source evidence; never
reset the shared live database while recording.

## Recording files to add

The login recording now exists. Starter-trip, pending-state polish and a complete
acceptance walkthrough remain to be recorded. The current partial walkthrough
and validation recording are linked in the evidence section below.

| Evidence | Proposed file |
| --- | --- |
| GitHub login/logout (added) | `docs/gifs/github-login.gif` |
| New-user starter trip | `docs/gifs/starter-trip.gif` |
| Toasts, spinner and pending controls | `docs/gifs/polish.gif` |
| Complete live walkthrough | `docs/gifs/final-walkthrough.gif` |

The existing `docs/gifs/activity-slideout.gif` can already be linked. Prefer
recording the final walkthrough using the current UI so the submitted evidence
matches the live app. Add actual image links to README and `milestone5.md` only
when the files exist.

## Current recording evidence — November 15, 2026

- [Current UI walkthrough](gifs/current-ui-walkthrough.gif): single existing account;
  trip creation/settings, activity creation/editing, voting, date filtering,
  expense creation/editing, invalid dates/recovery, invalid invite, logout/login
  and non-organizer settings restriction.
- [GitHub login/logout](gifs/github-login.gif): existing GitHub session returns
  through OAuth; this is not first-time account authorization or registration.
- [Validation and Toasts](gifs/validation-feedback.gif): rejected end date,
  corrected save, invalid invite and preserved input.

These are sampled real UI screenshots assembled into GIFs, cropped to remove
browser tabs/bookmarks. They are not continuous screen recordings. Spinner and
pending-control states were not clearly captured. No first-login, two-account,
deletion, mobile or complete keyboard acceptance is claimed. The live demo trip
`Coastal weekend demo` (trip 4) is retained for follow-up; no existing trip data was changed.
