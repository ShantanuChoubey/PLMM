/**
 * Backend Sprint 7C — Progress Tracking Test Script
 * Run: node scripts/test-sprint7c.mjs
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
function fail(label, d) { console.error(`  ❌  ${label}`, JSON.stringify(d, null, 2)); process.exit(1) }
function section(t) { console.log(`\n── ${t} ──`) }

// ─── Setup ────────────────────────────────────────────────────────────────────

const ts = Date.now()
const L_EMAIL  = `prog_learner_${ts}@test.com`
const L2_EMAIL = `prog_l2_${ts}@test.com`
const M_EMAIL  = `prog_mentor_${ts}@test.com`
const PWD = 'password123'

let learnerToken, learner2Token, mentorToken
let recordId, recordId2

section('Setup — Register, Login, Create Learner Profile')

for (const [email, role] of [
  [L_EMAIL, 'LEARNER'],
  [L2_EMAIL, 'LEARNER'],
  [M_EMAIL, 'PEER_MENTOR'],
]) {
  const r = await req('POST', '/auth/register', { name: `PR ${role}`, email, password: PWD, role })
  if (!r.success) fail(`Register ${role}`, r)
}
pass('3 users registered')

{
  const r = await req('POST', '/auth/login', { email: L_EMAIL, password: PWD })
  learnerToken = r.data.token
}
{
  const r = await req('POST', '/auth/login', { email: L2_EMAIL, password: PWD })
  learner2Token = r.data.token
}
{
  const r = await req('POST', '/auth/login', { email: M_EMAIL, password: PWD })
  mentorToken = r.data.token
}
pass('All logged in')

// Create learner profiles
{
  const r = await req('POST', '/profiles/learner', { department: 'CSE', year: '3' }, learnerToken)
  if (!r.success) fail('Create learner profile', r)
}
{
  const r = await req('POST', '/profiles/learner', { department: 'IT', year: '2' }, learner2Token)
  if (!r.success) fail('Create learner2 profile', r)
}
pass('Learner profiles created')

// ─── Create Progress Records ──────────────────────────────────────────────────

section('Create Progress Records')

{
  const r = await req('POST', '/progress', {
    skill: 'React',
    progress: 40,
    notes: 'Completed components and props',
  }, learnerToken)
  if (!r.success) fail('Create progress record', r)
  if (r.status !== 201) fail('Expected 201', r.status)
  recordId = r.data.record.id
  if (r.data.record.status !== 'IN_PROGRESS') fail('Status should be IN_PROGRESS for 40%', r.data.record.status)
  pass(`Progress record created (${recordId}) — skill: React, progress: 40, status: ${r.data.record.status}`)
}

{
  // Create a COMPLETED record
  const r = await req('POST', '/progress', {
    skill: 'Node.js',
    progress: 100,
    notes: 'Finished all chapters',
  }, learnerToken)
  if (!r.success) fail('Create completed record', r)
  recordId2 = r.data.record.id
  if (r.data.record.status !== 'COMPLETED') fail('Status should be COMPLETED for 100%', r.data.record.status)
  pass(`Completed record created (${recordId2}) — skill: Node.js, status: ${r.data.record.status}`)
}

{
  // Create a NOT_STARTED record
  const r = await req('POST', '/progress', {
    skill: 'DSA',
    progress: 0,
  }, learnerToken)
  if (!r.success) fail('Create not started record', r)
  if (r.data.record.status !== 'NOT_STARTED') fail('Status should be NOT_STARTED for 0%', r.data.record.status)
  pass(`Not-started record created — skill: DSA, status: ${r.data.record.status}`)
}

// ─── Duplicate Skill Prevention ───────────────────────────────────────────────

section('Duplicate Skill Prevention')

{
  const r = await req('POST', '/progress', { skill: 'React', progress: 50 }, learnerToken)
  if (r.success) fail('Duplicate skill should be rejected', r)
  if (r.status !== 409) fail('Expected 409 Conflict', r.status)
  pass('Duplicate skill record blocked (409)')
}

// ─── RBAC — Mentor cannot create progress records ─────────────────────────────

section('RBAC')

{
  const r = await req('POST', '/progress', { skill: 'React', progress: 10 }, mentorToken)
  if (r.success) fail('Mentor should not create progress', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Mentor blocked from creating progress (403)')
}

// ─── Get Progress Records ─────────────────────────────────────────────────────

section('GET /progress — List & Filters')

{
  const r = await req('GET', '/progress', null, learnerToken)
  if (!r.success) fail('Get all records', r)
  if (r.data.records.length < 3) fail('Should see at least 3 records', r.data)
  if (!r.data.pagination.total) fail('Pagination missing', r.data.pagination)
  pass(`Got ${r.data.records.length} records, total: ${r.data.pagination.total}`)
}

{
  const r = await req('GET', '/progress?status=COMPLETED', null, learnerToken)
  if (!r.success) fail('Filter by COMPLETED', r)
  const allCompleted = r.data.records.every(rec => rec.status === 'COMPLETED')
  if (!allCompleted) fail('All should be COMPLETED', r.data.records)
  pass(`Filter status=COMPLETED → ${r.data.records.length} result(s)`)
}

{
  const r = await req('GET', '/progress?status=NOT_STARTED', null, learnerToken)
  if (!r.success) fail('Filter NOT_STARTED', r)
  pass(`Filter status=NOT_STARTED → ${r.data.records.length} result(s)`)
}

{
  const r = await req('GET', '/progress?skill=React', null, learnerToken)
  if (!r.success) fail('Filter by skill', r)
  const found = r.data.records.some(rec => rec.skill.toLowerCase().includes('react'))
  if (!found) fail('Should find React record', r.data.records)
  pass(`Filter skill=React → ${r.data.records.length} result(s)`)
}

{
  const r = await req('GET', '/progress?page=1&limit=2', null, learnerToken)
  if (!r.success) fail('Pagination', r)
  if (r.data.records.length > 2) fail('limit=2 should return max 2', r.data.records.length)
  pass(`Pagination: page=${r.data.pagination.page} limit=${r.data.pagination.limit} total=${r.data.pagination.total}`)
}

{
  const r = await req('GET', '/progress?sortBy=progress&sortOrder=asc', null, learnerToken)
  if (!r.success) fail('Sort by progress', r)
  const values = r.data.records.map(rec => rec.progress)
  const isSorted = values.every((v, i) => i === 0 || v >= values[i - 1])
  if (!isSorted) fail('Records should be sorted ascending by progress', values)
  pass(`Sort by progress asc: ${values.join(', ')}`)
}

// ─── Get Single Record ────────────────────────────────────────────────────────

section('GET /progress/:id')

{
  const r = await req('GET', `/progress/${recordId}`, null, learnerToken)
  if (!r.success) fail('Get record by ID', r)
  if (r.data.record.id !== recordId) fail('Wrong record returned', r.data.record)
  pass(`Got record by ID — skill: ${r.data.record.skill}, progress: ${r.data.record.progress}`)
}

{
  // Learner2 cannot access learner1's record
  const r = await req('GET', `/progress/${recordId}`, null, learner2Token)
  if (r.success) fail('Learner2 should not access learner1 record', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Learner2 blocked from accessing learner1 record (403)')
}

{
  const r = await req('GET', '/progress/nonexistent999', null, learnerToken)
  if (r.success) fail('Should return 404', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Non-existent record returns 404')
}

// ─── Update Progress ──────────────────────────────────────────────────────────

section('PATCH /progress/:id — Update & Status Recalculation')

{
  // Update from 40 → 75 (stays IN_PROGRESS)
  const r = await req('PATCH', `/progress/${recordId}`, { progress: 75, notes: 'Completed hooks' }, learnerToken)
  if (!r.success) fail('Update progress', r)
  if (r.data.record.progress !== 75) fail('Progress should be 75', r.data.record.progress)
  if (r.data.record.status !== 'IN_PROGRESS') fail('Status should stay IN_PROGRESS', r.data.record.status)
  pass(`Updated to 75% — status: ${r.data.record.status}`)
}

{
  // Update to 100 → auto status COMPLETED
  const r = await req('PATCH', `/progress/${recordId}`, { progress: 100 }, learnerToken)
  if (!r.success) fail('Update to 100', r)
  if (r.data.record.status !== 'COMPLETED') fail('Status should be COMPLETED at 100%', r.data.record.status)
  pass(`Updated to 100% — status auto-set to: ${r.data.record.status}`)
}

{
  // Update back to 0 → auto status NOT_STARTED
  const r = await req('PATCH', `/progress/${recordId}`, { progress: 0 }, learnerToken)
  if (!r.success) fail('Update to 0', r)
  if (r.data.record.status !== 'NOT_STARTED') fail('Status should be NOT_STARTED at 0%', r.data.record.status)
  pass(`Updated to 0% — status auto-set to: ${r.data.record.status}`)
}

{
  // Learner2 cannot update learner1's record
  const r = await req('PATCH', `/progress/${recordId}`, { progress: 50 }, learner2Token)
  if (r.success) fail('Learner2 should not update learner1 record', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Learner2 blocked from updating (403)')
}

// ─── Progress Summary ─────────────────────────────────────────────────────────

section('GET /progress/summary')

{
  // Reset React to 50 so summary has 1 IN_PROGRESS, 1 COMPLETED, 1 NOT_STARTED
  await req('PATCH', `/progress/${recordId}`, { progress: 50 }, learnerToken)

  const r = await req('GET', '/progress/summary', null, learnerToken)
  if (!r.success) fail('Get progress summary', r)
  const s = r.data.summary
  if (typeof s.totalSkills !== 'number')      fail('totalSkills missing', s)
  if (typeof s.completedSkills !== 'number')  fail('completedSkills missing', s)
  if (typeof s.inProgressSkills !== 'number') fail('inProgressSkills missing', s)
  if (typeof s.averageProgress !== 'number')  fail('averageProgress missing', s)
  if (!Array.isArray(s.achievements))         fail('achievements should be array', s)
  pass(`Summary: total=${s.totalSkills} completed=${s.completedSkills} inProgress=${s.inProgressSkills} avg=${s.averageProgress}% achievements=[${s.achievements.join(', ')}]`)
}

// ─── Achievement Calculation ──────────────────────────────────────────────────

section('Achievement Calculation')

{
  // With 1 COMPLETED skill (Node.js), FIRST_SKILL_COMPLETED should be present
  const r = await req('GET', '/progress/summary', null, learnerToken)
  const achievements = r.data.summary.achievements
  if (!achievements.includes('FIRST_SKILL_COMPLETED')) {
    fail('FIRST_SKILL_COMPLETED should be earned with 1 completed skill', achievements)
  }
  pass(`Achievements correct: [${achievements.join(', ')}]`)
}

// ─── Isolation ────────────────────────────────────────────────────────────────

section('Data Isolation')

{
  // Learner2 gets their own (empty) progress
  const r = await req('GET', '/progress', null, learner2Token)
  if (!r.success) fail('Learner2 get progress', r)
  if (r.data.records.length !== 0) fail('Learner2 should see 0 records', r.data.records)
  pass('Learner2 sees only their own records (0 — isolated from learner1)')
}

// ─── Validation ───────────────────────────────────────────────────────────────

section('Validation')

{
  const r = await req('POST', '/progress', { skill: 'Python', progress: 150 }, learnerToken)
  if (r.success) fail('progress > 100 should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Progress > 100 rejected (400)')
}

{
  const r = await req('POST', '/progress', { skill: 'Go', progress: -5 }, learnerToken)
  if (r.success) fail('progress < 0 should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Progress < 0 rejected (400)')
}

{
  const r = await req('POST', '/progress', { progress: 50 }, learnerToken)
  if (r.success) fail('Missing skill should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Missing skill rejected (400)')
}

{
  const r = await req('GET', '/progress?status=INVALID', null, learnerToken)
  if (r.success) fail('Invalid status should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Invalid status filter rejected (400)')
}

{
  const r = await req('GET', '/progress?limit=200', null, learnerToken)
  if (r.success) fail('limit > 100 should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('limit > 100 rejected (400)')
}

// ─── Auth Guard ───────────────────────────────────────────────────────────────

section('Auth Guard')

{
  const r = await req('GET', '/progress', null, null)
  if (r.success) fail('Unauthenticated should be blocked', r)
  if (r.status !== 401) fail('Expected 401', r.status)
  pass('Unauthenticated request blocked (401)')
}

// ─── Delete Progress ──────────────────────────────────────────────────────────

section('DELETE /progress/:id')

{
  // Learner2 cannot delete learner1's record
  const r = await req('DELETE', `/progress/${recordId}`, null, learner2Token)
  if (r.success) fail('Learner2 should not delete learner1 record', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Learner2 blocked from deleting (403)')
}

{
  const r = await req('DELETE', `/progress/${recordId}`, null, learnerToken)
  if (!r.success) fail('Delete record', r)
  pass(`Record ${recordId} deleted`)
}

{
  const r = await req('GET', `/progress/${recordId}`, null, learnerToken)
  if (r.success) fail('Should return 404 after delete', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Deleted record returns 404')
}

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log('\n🎉  Backend Sprint 7C — All tests passed!\n')
console.log('Endpoints verified:')
console.log('  POST   /api/v1/progress             ✅')
console.log('  GET    /api/v1/progress              ✅')
console.log('  GET    /api/v1/progress/summary      ✅')
console.log('  GET    /api/v1/progress/:id          ✅')
console.log('  PATCH  /api/v1/progress/:id          ✅')
console.log('  DELETE /api/v1/progress/:id          ✅')
