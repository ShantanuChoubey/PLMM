/**
 * Backend Sprint 8B — Mentor Recommendation Engine Test Script
 * Run: node scripts/test-sprint8b.mjs
 * Prerequisites: backend running on port 5000, GEMINI_API_KEY set in .env
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
const L_EMAIL  = `rec8b_l_${ts}@test.com`
const M1_EMAIL = `rec8b_m1_${ts}@test.com`
const M2_EMAIL = `rec8b_m2_${ts}@test.com`
const M3_EMAIL = `rec8b_m3_${ts}@test.com`
const PWD = 'password123'

let learnerToken, learnerUserId
let mentor1ProfileId, mentor2ProfileId, mentor3ProfileId
let recId

section('Setup — Register users')

for (const [email, role] of [
  [L_EMAIL, 'LEARNER'],
  [M1_EMAIL, 'PEER_MENTOR'],
  [M2_EMAIL, 'PEER_MENTOR'],
  [M3_EMAIL, 'PEER_MENTOR'],
]) {
  const r = await req('POST', '/auth/register', { name: `REC ${role}`, email, password: PWD, role })
  if (!r.success) fail(`Register ${role}`, r)
}
pass('4 users registered (1 learner + 3 mentors)')

{ const r = await req('POST', '/auth/login', { email: L_EMAIL, password: PWD }); learnerToken = r.data.token; learnerUserId = r.data.user.id }

let m1Token, m2Token, m3Token
{ const r = await req('POST', '/auth/login', { email: M1_EMAIL, password: PWD }); m1Token = r.data.token }
{ const r = await req('POST', '/auth/login', { email: M2_EMAIL, password: PWD }); m2Token = r.data.token }
{ const r = await req('POST', '/auth/login', { email: M3_EMAIL, password: PWD }); m3Token = r.data.token }
pass('All users logged in')

section('Setup — Create profiles')

// Learner profile
{
  const r = await req('POST', '/profiles/learner', {
    department: 'CSE',
    year: '3',
    bio: 'Want to learn React and Node.js',
    goals: 'Frontend internship at a product company',
  }, learnerToken)
  if (!r.success) fail('Create learner profile', r)
  pass(`Learner profile created`)
}

// Mentor profiles with different skills/ratings
{
  const r = await req('POST', '/profiles/mentor', {
    bio: 'React expert with 3 years experience',
    experience: '3 years',
    specialization: 'Frontend Development',
  }, m1Token)
  if (!r.success) fail('Create mentor1 profile', r)
  mentor1ProfileId = r.data.profile.id
  pass(`Mentor1 profile created (${mentor1ProfileId})`)
}

{
  const r = await req('POST', '/profiles/mentor', {
    bio: 'Full-stack developer specialising in Node.js',
    experience: '2 years',
    specialization: 'Backend Development',
  }, m2Token)
  if (!r.success) fail('Create mentor2 profile', r)
  mentor2ProfileId = r.data.profile.id
  pass(`Mentor2 profile created (${mentor2ProfileId})`)
}

{
  const r = await req('POST', '/profiles/mentor', {
    bio: 'DSA and competitive programming mentor',
    experience: '4 years',
    specialization: 'DSA',
  }, m3Token)
  if (!r.success) fail('Create mentor3 profile', r)
  mentor3ProfileId = r.data.profile.id
  pass(`Mentor3 profile created (${mentor3ProfileId})`)
}

// Add skills to mentors via skills module
section('Setup — Create skills and assign to mentors')

import { prisma } from '../src/database/prisma.js'

// Create skills directly in DB to avoid admin role requirement
const skillNames = ['React', 'Node.js', 'DSA', 'JavaScript']
const skillMap = {}
for (const name of skillNames) {
  const skill = await prisma.skill.upsert({
    where: { name },
    update: {},
    create: { name, description: `${name} skill` },
  })
  skillMap[name] = skill.id
}
pass('Skills created/found in DB')

// Assign skills to mentors
await prisma.mentorSkill.createMany({
  data: [
    { mentorId: mentor1ProfileId, skillId: skillMap['React'] },
    { mentorId: mentor1ProfileId, skillId: skillMap['JavaScript'] },
    { mentorId: mentor2ProfileId, skillId: skillMap['Node.js'] },
    { mentorId: mentor2ProfileId, skillId: skillMap['JavaScript'] },
    { mentorId: mentor3ProfileId, skillId: skillMap['DSA'] },
  ],
  skipDuplicates: true,
})
pass('Skills assigned to mentors')

// ─── RBAC ─────────────────────────────────────────────────────────────────────

section('RBAC')

{
  // Mentor cannot generate recommendations
  const r = await req('POST', '/ai/recommend-mentors', { learnerId: learnerUserId }, m1Token)
  if (r.success) fail('Mentor should not generate recs', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Mentor blocked from generating recommendations (403)')
}

{
  // Unauthenticated blocked
  const r = await req('POST', '/ai/recommend-mentors', { learnerId: learnerUserId }, null)
  if (r.success) fail('Unauthenticated should be blocked', r)
  if (r.status !== 401) fail('Expected 401', r.status)
  pass('Unauthenticated request blocked (401)')
}

// ─── Validation ───────────────────────────────────────────────────────────────

section('Validation')

{
  const r = await req('POST', '/ai/recommend-mentors', {}, learnerToken)
  if (r.success) fail('Missing learnerId should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Missing learnerId rejected (400)')
}

// ─── Generate Recommendations ─────────────────────────────────────────────────

section(`Generate Recommendations (Gemini: ${GEMINI_ON ? 'ON' : 'OFF — fallback active'})`)

{
  const r = await req('POST', '/ai/recommend-mentors', { learnerId: learnerUserId }, learnerToken)
  if (!r.success) fail('Generate recommendations', r)
  if (r.status !== 201) fail('Expected 201', r.status)

  const recs = r.data.recommendations
  if (!Array.isArray(recs)) fail('recommendations should be array', recs)
  if (recs.length === 0) fail('Should have at least 1 recommendation', recs)

  // Each recommendation must have required fields
  for (const rec of recs) {
    if (typeof rec.score !== 'number') fail('score should be number', rec)
    if (!rec.reason) fail('reason should be present', rec)
    if (!rec.mentor) fail('mentor relation should be included', rec)
    if (!rec.mentor.user) fail('mentor.user should be included', rec.mentor)
  }

  recId = recs[0].id
  pass(`${recs.length} recommendation(s) generated`)
  pass(`Top recommendation: mentor="${recs[0].mentor.user.name}", score=${recs[0].score}`)
  pass(`Reason: "${recs[0].reason.substring(0, 80)}..."`)

  if (GEMINI_ON) {
    pass('AI-powered recommendations generated via Gemini')
  } else {
    pass('Fallback deterministic recommendations generated (no Gemini key)')
  }
}

// ─── Recommendations are sorted by score DESC ─────────────────────────────────

section('Score Ordering')

{
  const r = await req('GET', '/ai/recommendations', null, learnerToken)
  if (!r.success) fail('Get recommendations', r)
  const scores = r.data.recommendations.map(rec => rec.score)
  const isSorted = scores.every((s, i) => i === 0 || s <= scores[i - 1])
  if (!isSorted) fail('Recommendations should be sorted by score DESC', scores)
  pass(`Scores sorted DESC: [${scores.join(', ')}]`)
}

// ─── Get Recommendations ──────────────────────────────────────────────────────

section('GET /ai/recommendations')

{
  const r = await req('GET', '/ai/recommendations', null, learnerToken)
  if (!r.success) fail('Get recommendations', r)
  if (!r.data.recommendations.length) fail('Should have recommendations', r.data)
  pass(`Got ${r.data.recommendations.length} recommendation(s) for learner`)
}

// ─── Get Single Recommendation ────────────────────────────────────────────────

section('GET /ai/recommendations/:id')

{
  const r = await req('GET', `/ai/recommendations/${recId}`, null, learnerToken)
  if (!r.success) fail('Get recommendation by ID', r)
  if (r.data.recommendation.id !== recId) fail('Wrong recommendation', r.data.recommendation)
  if (!r.data.recommendation.mentor) fail('Should include mentor', r.data.recommendation)
  pass(`Got recommendation by ID — score: ${r.data.recommendation.score}`)
}

{
  // Non-existent
  const r = await req('GET', '/ai/recommendations/nonexistent999', null, learnerToken)
  if (r.success) fail('Should return 404', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Non-existent recommendation returns 404')
}

// ─── Regeneration (delete + regenerate) ──────────────────────────────────────

section('Delete & Regenerate')

{
  const r = await req('DELETE', '/ai/recommendations', null, learnerToken)
  if (!r.success) fail('Delete recommendations', r)
  pass('Previous recommendations deleted')
}

{
  // After delete, GET should return empty array
  const r = await req('GET', '/ai/recommendations', null, learnerToken)
  if (!r.success) fail('Get after delete', r)
  if (r.data.recommendations.length !== 0) fail('Should be empty after delete', r.data)
  pass('Recommendations empty after delete')
}

{
  // Regenerate fresh
  const r = await req('POST', '/ai/recommend-mentors', { learnerId: learnerUserId }, learnerToken)
  if (!r.success) fail('Regenerate recommendations', r)
  if (!r.data.recommendations.length) fail('Should have recommendations', r.data)
  pass(`Regenerated ${r.data.recommendations.length} recommendation(s)`)
}

// ─── Fallback Logic ───────────────────────────────────────────────────────────

section('Fallback Logic')

// Verify all recommendation mentorIds actually exist in the DB
{
  const r = await req('GET', '/ai/recommendations', null, learnerToken)
  const mentorIds = r.data.recommendations.map(rec => rec.mentorId)

  // Each mentorId should resolve to a real mentor in the DB
  const checks = await Promise.all(
    mentorIds.map(id => prisma.mentorProfile.findUnique({ where: { id } }))
  )
  const allExist = checks.every(m => m !== null)
  if (!allExist) fail('All recommendation mentorIds must be valid DB records', mentorIds)
  pass(`All ${mentorIds.length} recommendation mentorIds are valid mentor profiles`)
}

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log('\n🎉  Backend Sprint 8B — All tests passed!\n')
console.log('Endpoints verified:')
console.log('  POST   /api/v1/ai/recommend-mentors      ✅')
console.log('  GET    /api/v1/ai/recommendations         ✅')
console.log('  GET    /api/v1/ai/recommendations/:id     ✅')
console.log('  DELETE /api/v1/ai/recommendations         ✅')
if (GEMINI_ON) {
  console.log('\n  🤖  Gemini AI powered recommendations working')
} else {
  console.log('\n  🔄  Deterministic fallback active (add GEMINI_API_KEY for AI recommendations)')
}
