/**
 * Backend Sprint 5 — Session Booking Test Script
 * Run: node scripts/test-sprint5.mjs
 *
 * Prerequisites: backend running on port 5000
 * Tests the full session lifecycle: book → accept → complete
 *                              and: book → reject (slot freed)
 *                              and: book → cancel (slot freed)
 */

const BASE = 'http://localhost:5000/api/v1'

let learnerToken, mentorToken
let learnerId, mentorProfileId, slotId
let sessionId, sessionId2, sessionId3

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  return { status: res.status, ...json }
}

function pass(label) { console.log(`  ✅  ${label}`) }
function fail(label, detail) { console.error(`  ❌  ${label}`, detail); process.exit(1) }
function section(title) { console.log(`\n── ${title} ──`) }

// ─── Setup: register unique users ────────────────────────────────────────────

const ts = Date.now()
const LEARNER_EMAIL  = `learner_s5_${ts}@test.com`
const MENTOR_EMAIL   = `mentor_s5_${ts}@test.com`
const PASSWORD       = 'password123'

section('Setup — Register & Login')

{
  const r = await req('POST', '/auth/register', { name: 'S5 Learner', email: LEARNER_EMAIL, password: PASSWORD, role: 'LEARNER' })
  if (!r.success) fail('Learner register', r)
  pass('Learner registered')
}

{
  const r = await req('POST', '/auth/register', { name: 'S5 Mentor', email: MENTOR_EMAIL, password: PASSWORD, role: 'PEER_MENTOR' })
  if (!r.success) fail('Mentor register', r)
  pass('Mentor registered')
}

{
  const r = await req('POST', '/auth/login', { email: LEARNER_EMAIL, password: PASSWORD })
  if (!r.success) fail('Learner login', r)
  learnerToken = r.data.token
  pass('Learner logged in')
}

{
  const r = await req('POST', '/auth/login', { email: MENTOR_EMAIL, password: PASSWORD })
  if (!r.success) fail('Mentor login', r)
  mentorToken = r.data.token
  pass('Mentor logged in')
}

// ─── Create profiles ──────────────────────────────────────────────────────────

section('Profiles')

{
  const r = await req('POST', '/profiles/learner', { department: 'CSE', year: '3', bio: 'Sprint 5 tester', goals: 'Learn React' }, learnerToken)
  if (!r.success) fail('Create learner profile', r)
  learnerId = r.data.profile.id
  pass(`Learner profile created (${learnerId})`)
}

{
  const r = await req('POST', '/profiles/mentor', { bio: 'Sprint 5 mentor', experience: '2 years', specialization: 'React' }, mentorToken)
  if (!r.success) fail('Create mentor profile', r)
  mentorProfileId = r.data.profile.id
  pass(`Mentor profile created (${mentorProfileId})`)
}

// ─── Create availability slots ────────────────────────────────────────────────

section('Availability — Create 3 Slots')

async function createSlot(day, start, end) {
  const r = await req('POST', '/availability', { day, startTime: start, endTime: end }, mentorToken)
  if (!r.success) fail(`Create slot ${day} ${start}`, r)
  pass(`Slot created: ${day} ${start}–${end} (${r.data.slot.id})`)
  return r.data.slot.id
}

const slot1 = await createSlot('Monday',    '18:00', '19:00')
const slot2 = await createSlot('Wednesday', '19:00', '20:00')
const slot3 = await createSlot('Friday',    '17:00', '18:00')
slotId = slot1

// ─── Book Sessions ────────────────────────────────────────────────────────────

section('Book Sessions')

{
  const r = await req('POST', '/sessions', {
    mentorId: mentorProfileId,
    slotId: slot1,
    topic: 'React Hooks',
    description: 'Need help with useEffect',
  }, learnerToken)
  if (!r.success) fail('Book session 1', r)
  sessionId = r.data.session.id
  if (r.data.session.status !== 'PENDING') fail('Status should be PENDING', r.data.session.status)
  pass(`Session booked (${sessionId}) — status: PENDING`)
}

{
  // Attempt to double-book the same slot
  const r = await req('POST', '/sessions', {
    mentorId: mentorProfileId,
    slotId: slot1,
    topic: 'Double book attempt',
  }, learnerToken)
  if (r.success) fail('Double-booking should be rejected', r)
  if (r.status !== 409) fail('Expected 409 Conflict', r.status)
  pass('Double-booking correctly blocked (409)')
}

{
  const r = await req('POST', '/sessions', {
    mentorId: mentorProfileId,
    slotId: slot2,
    topic: 'Node.js Basics',
  }, learnerToken)
  if (!r.success) fail('Book session 2', r)
  sessionId2 = r.data.session.id
  pass(`Session 2 booked (${sessionId2}) — for reject test`)
}

{
  const r = await req('POST', '/sessions', {
    mentorId: mentorProfileId,
    slotId: slot3,
    topic: 'DSA Review',
  }, learnerToken)
  if (!r.success) fail('Book session 3', r)
  sessionId3 = r.data.session.id
  pass(`Session 3 booked (${sessionId3}) — for cancel test`)
}

// ─── GET sessions (role-aware) ────────────────────────────────────────────────

section('GET Sessions')

{
  const r = await req('GET', '/sessions', null, learnerToken)
  if (!r.success) fail('Learner get sessions', r)
  if (!r.data.sessions.length) fail('Learner should see their sessions', r.data)
  pass(`Learner sees ${r.data.sessions.length} session(s)`)
}

{
  const r = await req('GET', '/sessions', null, mentorToken)
  if (!r.success) fail('Mentor get sessions', r)
  pass(`Mentor sees ${r.data.sessions.length} session(s)`)
}

{
  const r = await req('GET', `/sessions?status=PENDING`, null, mentorToken)
  if (!r.success) fail('Filter by status', r)
  pass(`Filter by status=PENDING → ${r.data.sessions.length} result(s)`)
}

// ─── GET session by ID ────────────────────────────────────────────────────────

section('GET Session Detail')

{
  const r = await req('GET', `/sessions/${sessionId}`, null, learnerToken)
  if (!r.success) fail('Get session by ID', r)
  if (!r.data.session.learner) fail('Should include learner data', r.data.session)
  if (!r.data.session.mentor)  fail('Should include mentor data', r.data.session)
  if (!r.data.session.slot)    fail('Should include slot data', r.data.session)
  pass('Session detail includes learner, mentor, and slot data')
}

// ─── Accept session ───────────────────────────────────────────────────────────

section('Accept → Complete Flow')

{
  const r = await req('PATCH', `/sessions/${sessionId}/accept`, null, mentorToken)
  if (!r.success) fail('Accept session', r)
  if (r.data.session.status !== 'ACCEPTED') fail('Status should be ACCEPTED', r.data.session.status)
  pass(`Session accepted — status: ACCEPTED`)
}

{
  // Learner tries to accept (wrong role)
  const r = await req('PATCH', `/sessions/${sessionId}/accept`, null, learnerToken)
  if (r.success) fail('Learner should not be able to accept', r)
  if (r.status !== 403) fail('Expected 403 Forbidden', r.status)
  pass('Learner blocked from accepting (403)')
}

{
  const r = await req('PATCH', `/sessions/${sessionId}/complete`, null, mentorToken)
  if (!r.success) fail('Complete session', r)
  if (r.data.session.status !== 'COMPLETED') fail('Status should be COMPLETED', r.data.session.status)
  if (!r.data.session.completedAt) fail('completedAt should be set', r.data.session)
  pass(`Session completed — status: COMPLETED, completedAt set`)
}

{
  // Cannot complete again
  const r = await req('PATCH', `/sessions/${sessionId}/complete`, null, mentorToken)
  if (r.success) fail('Cannot complete an already-completed session', r)
  pass('Re-complete blocked correctly (invalid status)')
}

// ─── Reject session + slot freed ─────────────────────────────────────────────

section('Reject Flow — Slot Freed')

{
  const r = await req('PATCH', `/sessions/${sessionId2}/reject`, null, mentorToken)
  if (!r.success) fail('Reject session', r)
  if (r.data.session.status !== 'REJECTED') fail('Status should be REJECTED', r.data.session.status)
  pass('Session rejected — status: REJECTED')
}

{
  // Slot should be free again — book it again
  const r = await req('POST', '/sessions', {
    mentorId: mentorProfileId,
    slotId: slot2,
    topic: 'Re-book after reject',
  }, learnerToken)
  if (!r.success) fail('Slot should be freed after reject — re-book failed', r)
  pass('Slot freed after reject — re-booking succeeded')
  // Clean up: cancel this session
  await req('PATCH', `/sessions/${r.data.session.id}/cancel`, null, learnerToken)
}

// ─── Cancel session + slot freed ─────────────────────────────────────────────

section('Cancel Flow — Slot Freed')

{
  const r = await req('PATCH', `/sessions/${sessionId3}/cancel`, null, learnerToken)
  if (!r.success) fail('Cancel session (learner)', r)
  if (r.data.session.status !== 'CANCELLED') fail('Status should be CANCELLED', r.data.session.status)
  pass('Session cancelled by learner — status: CANCELLED')
}

{
  // Slot should be free again
  const r = await req('POST', '/sessions', {
    mentorId: mentorProfileId,
    slotId: slot3,
    topic: 'Re-book after cancel',
  }, learnerToken)
  if (!r.success) fail('Slot should be freed after cancel', r)
  pass('Slot freed after cancel — re-booking succeeded')
}

// ─── RBAC checks ─────────────────────────────────────────────────────────────

section('RBAC Checks')

{
  // Mentor tries to book (should be blocked)
  const r = await req('POST', '/sessions', {
    mentorId: mentorProfileId,
    slotId: slot1,
    topic: 'Mentor self-booking',
  }, mentorToken)
  if (r.success) fail('Mentor should not be able to book sessions', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Mentor blocked from booking (403)')
}

// ─── Mentor totalSessions incremented ────────────────────────────────────────

section('Mentor Statistics')

{
  const r = await req('GET', `/mentors/${mentorProfileId}`, null, learnerToken)
  if (!r.success) fail('Get mentor profile', r)
  if (r.data.mentor.totalSessions < 1) fail('totalSessions should be >= 1', r.data.mentor.totalSessions)
  pass(`Mentor totalSessions = ${r.data.mentor.totalSessions} (incremented after completion)`)
}

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log('\n🎉  Backend Sprint 5 — All tests passed!\n')
console.log('Endpoints verified:')
console.log('  POST   /api/v1/sessions              ✅')
console.log('  GET    /api/v1/sessions               ✅')
console.log('  GET    /api/v1/sessions/:id           ✅')
console.log('  PATCH  /api/v1/sessions/:id/accept    ✅')
console.log('  PATCH  /api/v1/sessions/:id/reject    ✅')
console.log('  PATCH  /api/v1/sessions/:id/cancel    ✅')
console.log('  PATCH  /api/v1/sessions/:id/complete  ✅')
