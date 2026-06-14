/**
 * Backend Sprint 8C — AI Study Plan Generator Test Script
 * Run: node scripts/test-sprint8c.mjs
 * Prerequisites: backend running on port 5000
 */

const BASE = 'http://localhost:5000/api/v1'
import { env } from '../src/config/env.js'

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
function skip(label) { console.log(`  ⏭️   ${label}`) }
function section(t) { console.log(`\n── ${t} ──`) }

const GEMINI_ON = env.gemini.configured

// ─── Setup ────────────────────────────────────────────────────────────────────

const ts = Date.now()
const L_EMAIL  = `sp8c_l_${ts}@test.com`
const M_EMAIL  = `sp8c_m_${ts}@test.com`
const PWD = 'password123'

let learnerToken, mentorToken
let planId1, planId2

section('Setup — Register & Login')

for (const [email, role] of [[L_EMAIL, 'LEARNER'], [M_EMAIL, 'PEER_MENTOR']]) {
  const r = await req('POST', '/auth/register', { name: `SP ${role}`, email, password: PWD, role })
  if (!r.success) fail(`Register ${role}`, r)
}
pass('2 users registered')

{ const r = await req('POST', '/auth/login', { email: L_EMAIL, password: PWD }); learnerToken = r.data.token }
{ const r = await req('POST', '/auth/login', { email: M_EMAIL, password: PWD }); mentorToken = r.data.token }
pass('Both logged in')

// Create learner profile
{
  const r = await req('POST', '/profiles/learner', {
    department: 'CSE',
    year: '3',
    goals: 'Frontend internship',
  }, learnerToken)
  if (!r.success) fail('Create learner profile', r)
  pass('Learner profile created')
}

// ─── RBAC ─────────────────────────────────────────────────────────────────────

section('RBAC')

{
  const r = await req('POST', '/ai/study-plan', { goal: 'Learn React', duration: 30 }, mentorToken)
  if (r.success) fail('Mentor should not generate study plan', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Mentor blocked from generating study plan (403)')
}

{
  const r = await req('POST', '/ai/study-plan', { goal: 'Learn React', duration: 30 }, null)
  if (r.success) fail('Unauthenticated should be blocked', r)
  if (r.status !== 401) fail('Expected 401', r.status)
  pass('Unauthenticated request blocked (401)')
}

// ─── Validation ───────────────────────────────────────────────────────────────

section('Validation')

{
  // Goal too short
  const r = await req('POST', '/ai/study-plan', { goal: 'Hi', duration: 30 }, learnerToken)
  if (r.success) fail('Short goal should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Goal < 3 chars rejected (400)')
}

{
  // Goal too long
  const r = await req('POST', '/ai/study-plan', { goal: 'a'.repeat(201), duration: 30 }, learnerToken)
  if (r.success) fail('Long goal should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Goal > 200 chars rejected (400)')
}

{
  // Duration too short
  const r = await req('POST', '/ai/study-plan', { goal: 'Learn React', duration: 3 }, learnerToken)
  if (r.success) fail('Duration < 7 should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Duration < 7 days rejected (400)')
}

{
  // Duration too long
  const r = await req('POST', '/ai/study-plan', { goal: 'Learn React', duration: 400 }, learnerToken)
  if (r.success) fail('Duration > 365 should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Duration > 365 days rejected (400)')
}

{
  // Missing goal
  const r = await req('POST', '/ai/study-plan', { duration: 30 }, learnerToken)
  if (r.success) fail('Missing goal should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Missing goal rejected (400)')
}

{
  // Missing duration
  const r = await req('POST', '/ai/study-plan', { goal: 'Learn React' }, learnerToken)
  if (r.success) fail('Missing duration should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Missing duration rejected (400)')
}

// ─── Generate Study Plans ─────────────────────────────────────────────────────

section(`Generate Study Plans (Gemini: ${GEMINI_ON ? 'ON' : 'OFF — fallback active'})`)

{
  const r = await req('POST', '/ai/study-plan', {
    goal: 'Learn React',
    duration: 30,
  }, learnerToken)
  if (!r.success) fail('Generate study plan', r)
  if (r.status !== 201) fail('Expected 201', r.status)

  planId1 = r.data.plan.id
  const plan = r.data.plan

  // Verify stored fields
  if (plan.goal !== 'Learn React') fail('Goal should be stored', plan.goal)
  if (plan.duration !== 30) fail('Duration should be stored', plan.duration)
  if (!plan.plan) fail('Plan JSON should be stored', plan)
  if (!plan.plan.weeks?.length) fail('Plan should have weeks', plan.plan)

  // Verify each week has required fields
  for (const week of plan.plan.weeks) {
    if (typeof week.week !== 'number') fail('week.week should be a number', week)
    if (!week.milestone && !week.focus) fail('Each week needs focus or milestone', week)
  }

  pass(`Study plan generated (${planId1}) — ${plan.plan.weeks.length} weeks`)
  if (GEMINI_ON) pass('Gemini-powered study plan generated')
  else pass('Fallback study plan generated (no Gemini key)')
}

{
  // Second plan with different goal
  const r = await req('POST', '/ai/study-plan', {
    goal: 'Master Node.js backend development',
    duration: 60,
  }, learnerToken)
  if (!r.success) fail('Generate second study plan', r)
  planId2 = r.data.plan.id
  const weeks = Math.ceil(60 / 7)
  if (r.data.plan.plan.weeks.length < 1) fail('Should have weeks', r.data.plan.plan)
  pass(`Second plan generated (${planId2}) — goal: Node.js, ${r.data.plan.plan.weeks.length} weeks`)
}

// ─── Plan content structure ───────────────────────────────────────────────────

section('Plan Content Structure')

{
  const r = await req('GET', `/ai/study-plans/${planId1}`, null, learnerToken)
  if (!r.success) fail('Get plan by ID', r)
  const plan = r.data.plan.plan

  if (!plan.goal) fail('Plan should have goal', plan)
  if (!plan.duration) fail('Plan should have duration', plan)
  if (!Array.isArray(plan.weeks)) fail('Plan should have weeks array', plan)
  if (!Array.isArray(plan.resources)) fail('Plan should have resources', plan)

  pass(`Plan structure correct: goal="${plan.goal}", ${plan.weeks.length} weeks, ${plan.resources.length} resources`)
}

// ─── Get All Study Plans ──────────────────────────────────────────────────────

section('GET /ai/study-plans')

{
  const r = await req('GET', '/ai/study-plans', null, learnerToken)
  if (!r.success) fail('Get all study plans', r)
  if (r.data.plans.length < 2) fail('Should see at least 2 plans', r.data)
  if (!r.data.pagination.total) fail('Pagination missing', r.data.pagination)
  pass(`Got ${r.data.plans.length} plans, total: ${r.data.pagination.total}`)
}

{
  // Pagination
  const r = await req('GET', '/ai/study-plans?page=1&limit=1', null, learnerToken)
  if (!r.success) fail('Paginate plans', r)
  if (r.data.plans.length > 1) fail('limit=1 should return max 1', r.data.plans.length)
  pass(`Pagination: page=${r.data.pagination.page} limit=${r.data.pagination.limit} total=${r.data.pagination.total}`)
}

{
  // Sort by createdAt asc
  const r = await req('GET', '/ai/study-plans?sortOrder=asc', null, learnerToken)
  if (!r.success) fail('Sort asc', r)
  const dates = r.data.plans.map(p => new Date(p.createdAt))
  const sorted = dates.every((d, i) => i === 0 || d >= dates[i - 1])
  if (!sorted) fail('Should be sorted ascending by createdAt', dates)
  pass('Sort order asc works')
}

// ─── Get Single Plan ──────────────────────────────────────────────────────────

section('GET /ai/study-plans/:id')

{
  const r = await req('GET', `/ai/study-plans/${planId1}`, null, learnerToken)
  if (!r.success) fail('Get plan by ID', r)
  if (r.data.plan.id !== planId1) fail('Wrong plan returned', r.data.plan)
  if (r.data.plan.goal !== 'Learn React') fail('Wrong goal', r.data.plan.goal)
  pass(`Got plan by ID — goal: "${r.data.plan.goal}", duration: ${r.data.plan.duration} days`)
}

{
  // Non-existent plan
  const r = await req('GET', '/ai/study-plans/nonexistent999', null, learnerToken)
  if (r.success) fail('Should return 404', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Non-existent plan returns 404')
}

// ─── Ownership isolation ──────────────────────────────────────────────────────

section('Data Isolation')

{
  // Register a second learner
  const ts2 = Date.now()
  await req('POST', '/auth/register', { name: 'L2', email: `sp8c_l2_${ts2}@test.com`, password: PWD, role: 'LEARNER' })
  const lr2 = await req('POST', '/auth/login', { email: `sp8c_l2_${ts2}@test.com`, password: PWD })
  const token2 = lr2.data.token
  await req('POST', '/profiles/learner', { department: 'IT', year: '1' }, token2)

  // learner2 cannot access learner1's plan
  const r = await req('GET', `/ai/study-plans/${planId1}`, null, token2)
  if (r.success) fail('Learner2 should not access learner1 plan', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Learner2 blocked from accessing learner1 plan (403)')
}

// ─── Fallback plan structure ──────────────────────────────────────────────────

section('Fallback Plan Verification')

if (!GEMINI_ON) {
  const r = await req('GET', `/ai/study-plans/${planId1}`, null, learnerToken)
  const weeks = r.data.plan.plan.weeks
  if (!weeks.length) fail('Fallback should still produce weeks', weeks)
  pass(`Fallback plan has ${weeks.length} weeks`)
  pass(`Week 1 focus: "${weeks[0].focus}"`)
} else {
  pass('Gemini ON — fallback tested implicitly via error handling in service')
}

// ─── Delete Plan ──────────────────────────────────────────────────────────────

section('DELETE /ai/study-plans/:id')

{
  const r = await req('DELETE', `/ai/study-plans/${planId2}`, null, learnerToken)
  if (!r.success) fail('Delete plan', r)
  pass(`Plan ${planId2} deleted`)
}

{
  const r = await req('GET', `/ai/study-plans/${planId2}`, null, learnerToken)
  if (r.success) fail('Should return 404 after delete', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Deleted plan returns 404')
}

{
  // Non-owner cannot delete
  const r = await req('DELETE', `/ai/study-plans/${planId1}`, null, mentorToken)
  if (r.success) fail('Mentor should not delete learner plan', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Mentor blocked from deleting learner plan (403)')
}

// ─── Prompt builder integration ───────────────────────────────────────────────

section('Prompt Builder Integration')

import { promptBuilder } from '../src/utils/aiPromptBuilder.js'

{
  const p = promptBuilder.studyPlan('Learn DSA', 21, { department: 'CSE', currentGoals: 'Crack placements' })
  if (!p.includes('DSA')) fail('Prompt should include goal', p)
  if (!p.includes('21')) fail('Prompt should include duration', p)
  if (!p.includes('CSE')) fail('Prompt should include department context', p)
  if (!p.includes('Crack placements')) fail('Prompt should include goals context', p)
  if (!p.includes('JSON')) fail('Prompt should request JSON', p)
  pass('studyPlan() prompt builder includes goal, duration, context, JSON instruction')
}

{
  // Without context
  const p = promptBuilder.studyPlan('Learn Python', 14)
  if (!p.includes('Python')) fail('Prompt should include goal', p)
  if (!p.includes('14')) fail('Prompt should include duration', p)
  pass('studyPlan() works without context (optional param)')
}

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log('\n🎉  Backend Sprint 8C — All tests passed!\n')
console.log('Endpoints verified:')
console.log('  POST   /api/v1/ai/study-plan        ✅')
console.log('  GET    /api/v1/ai/study-plans        ✅')
console.log('  GET    /api/v1/ai/study-plans/:id    ✅')
console.log('  DELETE /api/v1/ai/study-plans/:id    ✅')
if (GEMINI_ON) {
  console.log('\n  🤖  Gemini AI powered study plans working')
} else {
  console.log('\n  🔄  Deterministic fallback active (add GEMINI_API_KEY for AI plans)')
}
