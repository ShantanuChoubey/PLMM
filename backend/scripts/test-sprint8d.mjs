/**
 * Backend Sprint 8D — AI Goal Analyzer Test Script
 * Run: node scripts/test-sprint8d.mjs
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
function section(t) { console.log(`\n── ${t} ──`) }

const GEMINI_ON = env.gemini.configured

// ─── Setup ────────────────────────────────────────────────────────────────────

const ts = Date.now()
const L_EMAIL  = `ga8d_l_${ts}@test.com`
const M_EMAIL  = `ga8d_m_${ts}@test.com`
const L2_EMAIL = `ga8d_l2_${ts}@test.com`
const PWD = 'password123'

let learnerToken, mentorToken, learner2Token
let analysisId1, analysisId2

section('Setup — Register & Login')

for (const [email, role] of [
  [L_EMAIL, 'LEARNER'], [M_EMAIL, 'PEER_MENTOR'], [L2_EMAIL, 'LEARNER'],
]) {
  const r = await req('POST', '/auth/register', { name: `GA ${role}`, email, password: PWD, role })
  if (!r.success) fail(`Register ${role}`, r)
}
pass('3 users registered')

{ const r = await req('POST', '/auth/login', { email: L_EMAIL, password: PWD }); learnerToken = r.data.token }
{ const r = await req('POST', '/auth/login', { email: M_EMAIL, password: PWD }); mentorToken = r.data.token }
{ const r = await req('POST', '/auth/login', { email: L2_EMAIL, password: PWD }); learner2Token = r.data.token }
pass('All logged in')

// Create profiles
{ const r = await req('POST', '/profiles/learner', { department: 'CSE', year: '3', goals: 'Get a software job' }, learnerToken); if (!r.success) fail('Learner profile', r) }
{ const r = await req('POST', '/profiles/learner', { department: 'IT', year: '2' }, learner2Token); if (!r.success) fail('Learner2 profile', r) }
pass('Profiles created')

// ─── RBAC ─────────────────────────────────────────────────────────────────────

section('RBAC')

{
  const r = await req('POST', '/ai/analyze-goal', { goal: 'Become a backend developer' }, mentorToken)
  if (r.success) fail('Mentor should not analyze goals', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Mentor blocked (403)')
}

{
  const r = await req('POST', '/ai/analyze-goal', { goal: 'Become a backend developer' }, null)
  if (r.success) fail('Unauthenticated should be blocked', r)
  if (r.status !== 401) fail('Expected 401', r.status)
  pass('Unauthenticated blocked (401)')
}

// ─── Validation ───────────────────────────────────────────────────────────────

section('Validation')

{
  const r = await req('POST', '/ai/analyze-goal', { goal: 'Hi' }, learnerToken)
  if (r.success) fail('Goal < 5 chars should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Goal < 5 chars rejected (400)')
}

{
  const r = await req('POST', '/ai/analyze-goal', { goal: 'a'.repeat(301) }, learnerToken)
  if (r.success) fail('Goal > 300 chars should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Goal > 300 chars rejected (400)')
}

{
  const r = await req('POST', '/ai/analyze-goal', {}, learnerToken)
  if (r.success) fail('Missing goal should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Missing goal rejected (400)')
}

// ─── Generate Goal Analyses ───────────────────────────────────────────────────

section(`Generate Goal Analyses (Gemini: ${GEMINI_ON ? 'ON' : 'OFF — fallback active'})`)

{
  const r = await req('POST', '/ai/analyze-goal', {
    goal: 'Become a Full Stack MERN Developer',
  }, learnerToken)
  if (!r.success) fail('Analyze goal 1', r)
  if (r.status !== 201) fail('Expected 201', r.status)

  analysisId1 = r.data.analysis.id
  const analysis = r.data.analysis

  // Verify stored fields
  if (analysis.goal !== 'Become a Full Stack MERN Developer') fail('Goal should match', analysis.goal)
  if (!analysis.analysis) fail('Analysis JSON should be stored', analysis)

  const data = analysis.analysis
  if (!Array.isArray(data.requiredSkills)) fail('requiredSkills should be array', data)
  if (!Array.isArray(data.roadmap)) fail('roadmap should be array', data)
  if (!Array.isArray(data.recommendedTechnologies)) fail('recommendedTechnologies should be array', data)
  if (!Array.isArray(data.careerSuggestions)) fail('careerSuggestions should be array', data)
  if (!Array.isArray(data.mentorFocusAreas)) fail('mentorFocusAreas should be array', data)

  pass(`Analysis generated (${analysisId1})`)
  pass(`Required skills: [${data.requiredSkills.slice(0, 3).join(', ')}...]`)
  pass(`Roadmap steps: ${data.roadmap.length}`)
  pass(`Technologies: [${data.recommendedTechnologies.slice(0, 3).join(', ')}...]`)
  if (GEMINI_ON) pass('Gemini-powered analysis generated')
  else pass('Fallback analysis generated')
}

{
  // Second analysis with different goal
  const r = await req('POST', '/ai/analyze-goal', {
    goal: 'Get placed as a Data Scientist at a top tech company',
  }, learnerToken)
  if (!r.success) fail('Analyze goal 2', r)
  analysisId2 = r.data.analysis.id
  pass(`Second analysis generated (${analysisId2}) — Data Scientist`)
}

// ─── GET All Analyses ─────────────────────────────────────────────────────────

section('GET /ai/goal-analyses')

{
  const r = await req('GET', '/ai/goal-analyses', null, learnerToken)
  if (!r.success) fail('Get analyses', r)
  if (r.data.analyses.length < 2) fail('Should see at least 2', r.data)
  if (!r.data.pagination.total) fail('Pagination missing', r.data.pagination)
  pass(`Got ${r.data.analyses.length} analyses, total: ${r.data.pagination.total}`)
}

{
  // Pagination
  const r = await req('GET', '/ai/goal-analyses?page=1&limit=1', null, learnerToken)
  if (!r.success) fail('Paginate analyses', r)
  if (r.data.analyses.length > 1) fail('limit=1 should return max 1', r.data.analyses.length)
  pass(`Pagination: page=${r.data.pagination.page} limit=${r.data.pagination.limit} total=${r.data.pagination.total}`)
}

{
  // Sort ascending
  const r = await req('GET', '/ai/goal-analyses?sortOrder=asc', null, learnerToken)
  if (!r.success) fail('Sort asc', r)
  const dates = r.data.analyses.map(a => new Date(a.createdAt))
  const sorted = dates.every((d, i) => i === 0 || d >= dates[i - 1])
  if (!sorted) fail('Should be sorted ascending', dates)
  pass('Sort order asc works')
}

// ─── GET Single Analysis ──────────────────────────────────────────────────────

section('GET /ai/goal-analyses/:id')

{
  const r = await req('GET', `/ai/goal-analyses/${analysisId1}`, null, learnerToken)
  if (!r.success) fail('Get analysis by ID', r)
  if (r.data.analysis.id !== analysisId1) fail('Wrong analysis returned', r.data.analysis)
  pass(`Got analysis by ID — goal: "${r.data.analysis.goal.substring(0, 40)}..."`)
}

{
  // Non-existent
  const r = await req('GET', '/ai/goal-analyses/nonexistent999', null, learnerToken)
  if (r.success) fail('Should return 404', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Non-existent analysis returns 404')
}

// ─── Data Isolation ───────────────────────────────────────────────────────────

section('Data Isolation')

{
  // Learner2 cannot access learner1's analysis
  const r = await req('GET', `/ai/goal-analyses/${analysisId1}`, null, learner2Token)
  if (r.success) fail('Learner2 should not access learner1 analysis', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Learner2 blocked from learner1 analysis (403)')
}

{
  // Learner2 sees their own (empty)
  const r = await req('GET', '/ai/goal-analyses', null, learner2Token)
  if (!r.success) fail('Learner2 get analyses', r)
  if (r.data.analyses.length !== 0) fail('Learner2 should see 0 analyses', r.data.analyses)
  pass('Learner2 sees only their own analyses (0)')
}

// ─── Delete Analysis ──────────────────────────────────────────────────────────

section('DELETE /ai/goal-analyses/:id')

{
  // Non-owner (mentor) cannot delete
  const r = await req('DELETE', `/ai/goal-analyses/${analysisId2}`, null, mentorToken)
  if (r.success) fail('Mentor should not delete learner analysis', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Mentor blocked from deleting analysis (403)')
}

{
  const r = await req('DELETE', `/ai/goal-analyses/${analysisId2}`, null, learnerToken)
  if (!r.success) fail('Delete analysis', r)
  pass(`Analysis ${analysisId2} deleted`)
}

{
  const r = await req('GET', `/ai/goal-analyses/${analysisId2}`, null, learnerToken)
  if (r.success) fail('Should return 404 after delete', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Deleted analysis returns 404')
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

section('Prompt Builder Integration')

import { promptBuilder } from '../src/utils/aiPromptBuilder.js'

{
  const p = promptBuilder.goalAnalysis('Become a DevOps Engineer', { department: 'CSE', currentGoals: 'Get job at FAANG' })
  if (!p.includes('DevOps')) fail('Should include goal', p)
  if (!p.includes('CSE')) fail('Should include department', p)
  if (!p.includes('FAANG')) fail('Should include current goals', p)
  if (!p.includes('requiredSkills')) fail('Should include JSON schema', p)
  pass('goalAnalysis() prompt includes goal, context, and JSON schema')
}

{
  const p = promptBuilder.goalAnalysis('Learn machine learning')
  if (!p.includes('machine learning')) fail('Should include goal', p)
  pass('goalAnalysis() works without context')
}

// ─── Analysis JSON structure ──────────────────────────────────────────────────

section('Analysis Content Quality')

{
  const r = await req('GET', `/ai/goal-analyses/${analysisId1}`, null, learnerToken)
  const data = r.data.analysis.analysis

  if (data.requiredSkills.length < 2) fail('Should have multiple required skills', data.requiredSkills)
  if (data.roadmap.length < 2) fail('Should have multiple roadmap steps', data.roadmap)
  if (data.recommendedTechnologies.length < 1) fail('Should have technologies', data.recommendedTechnologies)
  if (data.careerSuggestions.length < 1) fail('Should have career suggestions', data.careerSuggestions)
  if (data.mentorFocusAreas.length < 1) fail('Should have mentor focus areas', data.mentorFocusAreas)

  pass(`Skills: ${data.requiredSkills.length}, Roadmap: ${data.roadmap.length} steps, Tech: ${data.recommendedTechnologies.length}`)
  pass(`Career suggestions: ${data.careerSuggestions.length}, Mentor areas: ${data.mentorFocusAreas.length}`)
}

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log('\n🎉  Backend Sprint 8D — All tests passed!\n')
console.log('Endpoints verified:')
console.log('  POST   /api/v1/ai/analyze-goal         ✅')
console.log('  GET    /api/v1/ai/goal-analyses          ✅')
console.log('  GET    /api/v1/ai/goal-analyses/:id      ✅')
console.log('  DELETE /api/v1/ai/goal-analyses/:id      ✅')
if (GEMINI_ON) {
  console.log('\n  🤖  Gemini AI powered goal analysis working')
} else {
  console.log('\n  🔄  Fallback analysis active (add GEMINI_API_KEY for AI analysis)')
}
