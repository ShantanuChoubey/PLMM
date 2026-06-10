import { randomUUID } from 'node:crypto'

const BASE = 'http://localhost:5000/api/v1'
const runId = randomUUID()

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  return { status: res.status, data }
}

async function register(role, suffix = role.toLowerCase()) {
  const email = `${suffix}.${runId}@example.com`
  const { status, data } = await request('/auth/register', {
    method: 'POST',
    body: { name: `Test ${role}`, email, password: 'password123', role },
  })

  if (status !== 201) throw new Error(`Register ${role} failed: ${JSON.stringify(data)}`)
  return { email, token: data.data.token, user: data.data.user }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function run() {
  console.log('Starting Sprint 4 integration tests...\n')

  const learner = await register('LEARNER')
  const mentor = await register('PEER_MENTOR')
  const adminUser = await register('LEARNER', 'admin')

  const { prisma } = await import('../src/database/prisma.js')
  await prisma.user.update({ where: { email: adminUser.email }, data: { role: 'ADMIN' } })

  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: adminUser.email, password: 'password123' },
  })
  const adminToken = adminLogin.data.data.token

  // Setup mentor profile and skill
  await request('/profiles/mentor', {
    method: 'POST',
    token: mentor.token,
    body: {
      bio: 'Mentor bio',
      experience: '3 years in CSE',
      specialization: 'Web Development',
      availability: 'Evenings',
    },
  })

  const mentorProfileRes = await request('/profiles/mentor', { token: mentor.token })
  const mentorProfileId = mentorProfileRes.data.data.profile.id

  await prisma.mentorProfile.update({
    where: { id: mentorProfileId },
    data: { rating: 4.5, totalSessions: 10 },
  })

  const skillRes = await request('/skills', {
    method: 'POST',
    token: adminToken,
    body: { name: `React-${runId}`, description: 'React framework' },
  })
  const skillId = skillRes.data.data.skill.id

  await request('/skills/mentor', {
    method: 'POST',
    token: mentor.token,
    body: { skillId },
  })

  // Availability CRUD
  let res = await request('/availability', {
    method: 'POST',
    token: mentor.token,
    body: { day: 'Monday', startTime: '18:00', endTime: '19:00' },
  })
  assert(res.status === 201, 'Create slot failed')
  const slotId = res.data.data.slot.id
  console.log('✓ Create availability slot')

  res = await request('/availability', {
    method: 'POST',
    token: mentor.token,
    body: { day: 'Monday', startTime: '18:00', endTime: '19:00' },
  })
  assert(res.status === 409, 'Duplicate slot should fail')
  console.log('✓ Duplicate slot blocked')

  res = await request('/availability', {
    method: 'POST',
    token: mentor.token,
    body: { day: 'Monday', startTime: '18:30', endTime: '19:30' },
  })
  assert(res.status === 409, 'Overlapping slot should fail')
  console.log('✓ Overlapping slot blocked')

  res = await request('/availability/me', { token: mentor.token })
  assert(res.status === 200 && res.data.data.slots.length >= 1, 'Get my slots failed')
  console.log('✓ Get my slots')

  res = await request(`/availability/${slotId}`, {
    method: 'PATCH',
    token: mentor.token,
    body: { startTime: '17:00', endTime: '18:00' },
  })
  assert(res.status === 200, 'Update slot failed')
  console.log('✓ Update slot')

  res = await request(`/availability/${mentorProfileId}`)
  assert(res.status === 200, 'Public mentor slots failed')
  console.log('✓ Get public mentor slots')

  res = await request('/availability', {
    method: 'POST',
    token: learner.token,
    body: { day: 'Tuesday', startTime: '10:00', endTime: '11:00' },
  })
  assert(res.status === 403, 'Learner should not create slots')
  console.log('✓ RBAC on availability create')

  // Discovery
  res = await request('/mentors', { token: learner.token })
  assert(res.status === 200 && res.data.data.mentors.length >= 1, 'Mentor search failed')
  console.log('✓ Mentor search')

  res = await request(`/mentors?skill=React-${runId}`, { token: learner.token })
  assert(res.status === 200 && res.data.data.mentors.length >= 1, 'Skill filter failed')
  console.log('✓ Filter by skill')

  res = await request('/mentors?department=CSE', { token: learner.token })
  assert(res.status === 200, 'Department filter failed')
  console.log('✓ Filter by department')

  res = await request('/mentors?rating=4', { token: learner.token })
  assert(res.status === 200 && res.data.data.mentors.length >= 1, 'Rating filter failed')
  console.log('✓ Filter by rating')

  res = await request('/mentors?availability=Monday', { token: learner.token })
  assert(res.status === 200, 'Availability filter failed')
  console.log('✓ Filter by availability day')

  res = await request('/mentors?sortBy=rating&sortOrder=desc', { token: learner.token })
  assert(res.status === 200, 'Sorting failed')
  console.log('✓ Sorting works')

  res = await request('/mentors?page=1&limit=5', { token: learner.token })
  assert(res.status === 200 && res.data.data.pagination.limit === 5, 'Pagination failed')
  console.log('✓ Pagination works')

  res = await request(`/mentors/${mentorProfileId}`, { token: learner.token })
  assert(res.status === 200 && res.data.data.mentor.skills.length >= 1, 'Mentor details failed')
  console.log('✓ Mentor details with skills and availability')

  res = await request('/mentors', {})
  assert(res.status === 401, 'Unauthenticated search should fail')
  console.log('✓ Auth required for mentor search')

  // Cleanup slot
  res = await request(`/availability/${slotId}`, {
    method: 'DELETE',
    token: mentor.token,
  })
  assert(res.status === 200, 'Delete slot failed')
  console.log('✓ Delete slot')

  console.log('\nAll Sprint 4 tests passed!')
}

run()
  .catch((err) => {
    console.error('\nTest failed:', err.message)
    process.exitCode = 1
  })
  .finally(async () => {
    const { prisma } = await import('../src/database/prisma.js')
    await prisma.$disconnect()
  })
