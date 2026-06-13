/**
 * Backend Sprint 7A — Reviews & Ratings Test Script
 * Run: node scripts/test-sprint7a.mjs
 * Prerequisites: backend running on port 5000
 */

const BASE = 'http://localhost:5000/api/v1'

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  return { status: res.status, ...json }
}

function pass(label) { console.log(`  ✅  ${label}`) }
function fail(label, detail) { console.error(`  ❌  ${label}`, JSON.stringify(detail, null, 2)); process.exit(1) }
function section(title) { console.log(`\n── ${title} ──`) }

// ─── Setup ────────────────────────────────────────────────────────────────────

const ts = Date.now()
const LEARNER_EMAIL  = `learner_7a_${ts}@test.com`
const LEARNER2_EMAIL = `learner2_7a_${ts}@test.com`
const MENTOR_EMAIL   = `mentor_7a_${ts}@test.com`
const PWD = 'password123'

let learnerToken, learner2Token, mentorToken
let learnerProfileId, mentorProfileId
let slotId, sessionId, reviewId

section('Setup — Register, login, create profiles')

// Register
for (const [email, role] of [
  [LEARNER_EMAIL, 'LEARNER'],
  [LEARNER2_EMAIL, 'LEARNER'],
  [MENTOR_EMAIL, 'PEER_MENTOR'],
]) {
  const r = await req('POST', '/auth/register', { name: `7A ${role}`, email, password: PWD, role })
  if (!r.success) fail(`Register ${role}`, r)
}
pass('3 users registered')

// Login
{ const r = await req('POST', '/auth/login', { email: LEARNER_EMAIL, password: PWD }); learnerToken = r.data.token }
{ const r = await req('POST', '/auth/login', { email: LEARNER2_EMAIL, password: PWD }); learner2Token = r.data.token }
{ const r = await req('POST', '/auth/login', { email: MENTOR_EMAIL, password: PWD }); mentorToken = r.data.token }
pass('All users logged in')

// Profiles
{ const r = await req('POST', '/profiles/learner', { department: 'CSE', year: '3' }, learnerToken); learnerProfileId = r.data.profile.id }
await req('POST', '/profiles/learner', { department: 'ECE', year: '2' }, learner2Token)
{ const r = await req('POST', '/profiles/mentor', { bio: '7A Mentor', specialization: 'React' }, mentorToken); mentorProfileId = r.data.profile.id }
pass('Profiles created')

// Availability slot
{ const r = await req('POST', '/availability', { day: 'Tuesday', startTime: '14:00', endTime: '15:00' }, mentorToken); slotId = r.data.slot.id }
pass('Availability slot created')

// Book and complete a session
{ const r = await req('POST', '/sessions', { mentorId: mentorProfileId, slotId, topic: 'React Hooks', description: 'Test' }, learnerToken); sessionId = r.data.session.id }
await req('PATCH', `/sessions/${sessionId}/accept`, null, mentorToken)
await req('PATCH', `/sessions/${sessionId}/complete`, null, mentorToken)
pass(`Session booked, accepted, and completed (${sessionId})`)

// ─── Create Review ────────────────────────────────────────────────────────────

section('Create Review')

{
  const r = await req('POST', '/reviews', {
    sessionId,
    mentorId: mentorProfileId,
    rating: 5,
    comment: 'Excellent mentor, very helpful!',
  }, learnerToken)
  if (!r.success) fail('Create review', r)
  if (r.status !== 201) fail('Expected 201', r.status)
  reviewId = r.data.review.id
  if (r.data.review.rating !== 5) fail('Rating should be 5', r.data.review)
  pass(`Review created (${reviewId}) — rating: ${r.data.review.rating}`)
}

{
  // Wrong role — mentor tries to review
  const r = await req('POST', '/reviews', {
    sessionId,
    mentorId: mentorProfileId,
    rating: 4,
  }, mentorToken)
  if (r.success) fail('Mentor should not create review', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Mentor blocked from creating review (403)')
}

// ─── Duplicate Prevention ─────────────────────────────────────────────────────

section('Duplicate Review Prevention')

{
  const r = await req('POST', '/reviews', {
    sessionId,
    mentorId: mentorProfileId,
    rating: 3,
    comment: 'Second attempt',
  }, learnerToken)
  if (r.success) fail('Duplicate review should be rejected', r)
  if (r.status !== 409) fail('Expected 409 Conflict', r.status)
  pass('Duplicate review blocked (409)')
}

// ─── Session Not Completed ────────────────────────────────────────────────────

section('Review on Non-Completed Session')

{
  // Book a new session but don't complete it
  const slot2 = await req('POST', '/availability', { day: 'Wednesday', startTime: '10:00', endTime: '11:00' }, mentorToken)
  const sess2 = await req('POST', '/sessions', { mentorId: mentorProfileId, slotId: slot2.data.slot.id, topic: 'Node.js' }, learnerToken)
  const pendingSessionId = sess2.data.session.id

  const r = await req('POST', '/reviews', {
    sessionId: pendingSessionId,
    mentorId: mentorProfileId,
    rating: 4,
  }, learnerToken)
  if (r.success) fail('Should not review a PENDING session', r)
  if (r.status !== 422) fail('Expected 422', r.status)
  pass('Review on PENDING session blocked (422)')

  // Clean up
  await req('PATCH', `/sessions/${pendingSessionId}/cancel`, null, learnerToken)
}

// ─── Wrong Learner ────────────────────────────────────────────────────────────

section('Unauthorized Review — Wrong Learner')

{
  // learner2 tries to review learner1's session
  const r = await req('POST', '/reviews', {
    sessionId,
    mentorId: mentorProfileId,
    rating: 2,
  }, learner2Token)
  if (r.success) fail('Wrong learner should not review', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Wrong learner blocked from reviewing (403)')
}

// ─── Mentor Rating Updated ────────────────────────────────────────────────────

section('Mentor Rating Auto-Update')

{
  const r = await req('GET', `/mentors/${mentorProfileId}`, null, learnerToken)
  if (!r.success) fail('Get mentor profile', r)
  if (r.data.mentor.rating !== 5) fail('Mentor rating should be 5', r.data.mentor.rating)
  pass(`Mentor rating updated to ${r.data.mentor.rating} after review`)
}

// ─── Get Mentor Reviews ───────────────────────────────────────────────────────

section('Get Mentor Reviews')

{
  const r = await req('GET', `/reviews/mentor/${mentorProfileId}`, null, learnerToken)
  if (!r.success) fail('Get mentor reviews', r)
  if (!r.data.reviews.length) fail('Should have reviews', r.data)
  if (r.data.stats.averageRating !== 5) fail('Average should be 5', r.data.stats)
  if (r.data.stats.totalReviews !== 1) fail('Total should be 1', r.data.stats)
  if (r.data.stats.distribution[5] !== 1) fail('Distribution 5-star should be 1', r.data.stats.distribution)
  pass(`Mentor reviews: ${r.data.reviews.length} review(s), avg: ${r.data.stats.averageRating}, distribution: ${JSON.stringify(r.data.stats.distribution)}`)
}

// ─── Get Session Review ───────────────────────────────────────────────────────

section('Get Session Review')

{
  const r = await req('GET', `/reviews/session/${sessionId}`, null, learnerToken)
  if (!r.success) fail('Get session review', r)
  if (r.data.review.sessionId !== sessionId) fail('Wrong session review', r.data.review)
  if (!r.data.review.learner) fail('Should include learner', r.data.review)
  pass('Session review returned with learner data')
}

{
  // Non-existent session review
  const r = await req('GET', '/reviews/session/nonexistent123', null, learnerToken)
  if (r.success) fail('Should return 404', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Non-existent session review returns 404')
}

// ─── Update Review ────────────────────────────────────────────────────────────

section('Update Review')

{
  const r = await req('PATCH', `/reviews/${reviewId}`, {
    rating: 4,
    comment: 'Updated — still great but room to improve',
  }, learnerToken)
  if (!r.success) fail('Update review', r)
  if (r.data.review.rating !== 4) fail('Rating should be 4 after update', r.data.review.rating)
  pass(`Review updated — new rating: ${r.data.review.rating}`)
}

{
  // Non-owner tries to update
  const r = await req('PATCH', `/reviews/${reviewId}`, { rating: 1 }, learner2Token)
  if (r.success) fail('Non-owner should not update review', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Non-owner blocked from updating review (403)')
}

// ─── Rating Recalculated After Update ────────────────────────────────────────

section('Rating Recalculation After Update')

{
  const r = await req('GET', `/mentors/${mentorProfileId}`, null, learnerToken)
  if (!r.success) fail('Get mentor after rating update', r)
  if (r.data.mentor.rating !== 4) fail('Mentor rating should be 4 after update', r.data.mentor.rating)
  pass(`Mentor rating recalculated to ${r.data.mentor.rating} after review update`)
}

// ─── Validation ───────────────────────────────────────────────────────────────

section('Validation')

{
  // Rating out of range
  const slot3 = await req('POST', '/availability', { day: 'Thursday', startTime: '16:00', endTime: '17:00' }, mentorToken)
  const sess3 = await req('POST', '/sessions', { mentorId: mentorProfileId, slotId: slot3.data.slot.id, topic: 'Validation Test' }, learnerToken)
  await req('PATCH', `/sessions/${sess3.data.session.id}/accept`, null, mentorToken)
  await req('PATCH', `/sessions/${sess3.data.session.id}/complete`, null, mentorToken)

  const r = await req('POST', '/reviews', {
    sessionId: sess3.data.session.id,
    mentorId: mentorProfileId,
    rating: 6,
  }, learnerToken)
  if (r.success) fail('Rating 6 should be rejected', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Rating > 5 rejected with 400')
}

{
  // Rating 0
  const slot4 = await req('POST', '/availability', { day: 'Friday', startTime: '09:00', endTime: '10:00' }, mentorToken)
  const sess4 = await req('POST', '/sessions', { mentorId: mentorProfileId, slotId: slot4.data.slot.id, topic: 'Rating 0 test' }, learnerToken)
  await req('PATCH', `/sessions/${sess4.data.session.id}/accept`, null, mentorToken)
  await req('PATCH', `/sessions/${sess4.data.session.id}/complete`, null, mentorToken)

  const r = await req('POST', '/reviews', {
    sessionId: sess4.data.session.id,
    mentorId: mentorProfileId,
    rating: 0,
  }, learnerToken)
  if (r.success) fail('Rating 0 should be rejected', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Rating < 1 rejected with 400')
}

// ─── Delete Review ────────────────────────────────────────────────────────────

section('Delete Review')

{
  // Non-owner delete blocked
  const r = await req('DELETE', `/reviews/${reviewId}`, null, learner2Token)
  if (r.success) fail('Non-owner should not delete', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Non-owner blocked from deleting review (403)')
}

{
  const r = await req('DELETE', `/reviews/${reviewId}`, null, learnerToken)
  if (!r.success) fail('Delete review', r)
  pass('Review deleted by owner successfully')
}

{
  // Confirm deleted
  const r = await req('GET', `/reviews/session/${sessionId}`, null, learnerToken)
  if (r.success) fail('Review should be gone after delete', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Deleted review returns 404')
}

// ─── Rating Reset After Delete ────────────────────────────────────────────────

section('Rating Reset After Delete')

{
  const r = await req('GET', `/mentors/${mentorProfileId}`, null, learnerToken)
  if (!r.success) fail('Get mentor after delete', r)
  if (r.data.mentor.rating !== 0) fail('Mentor rating should reset to 0 with no reviews', r.data.mentor.rating)
  pass(`Mentor rating reset to ${r.data.mentor.rating} after review deletion`)
}

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log('\n🎉  Backend Sprint 7A — All tests passed!\n')
console.log('Endpoints verified:')
console.log('  POST   /api/v1/reviews                       ✅')
console.log('  GET    /api/v1/reviews/mentor/:mentorId       ✅')
console.log('  GET    /api/v1/reviews/session/:sessionId     ✅')
console.log('  PATCH  /api/v1/reviews/:id                   ✅')
console.log('  DELETE /api/v1/reviews/:id                   ✅')
