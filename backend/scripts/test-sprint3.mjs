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
  console.log('Starting Sprint 3 integration tests...\n')

  const learner = await register('LEARNER')
  const mentor = await register('PEER_MENTOR')
  const faculty = await register('FACULTY_MENTOR')
  const adminUser = await register('LEARNER', 'admin')

  const { prisma } = await import('../src/database/prisma.js')
  await prisma.user.update({
    where: { email: adminUser.email },
    data: { role: 'ADMIN' },
  })

  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: adminUser.email, password: 'password123' },
  })
  const adminToken = adminLogin.data.data.token

  // Learner profile
  let res = await request('/profiles/learner', {
    method: 'POST',
    token: learner.token,
    body: { department: 'CSE', year: '3', bio: 'Bio', goals: 'Goals', availability: 'Weekends' },
  })
  assert(res.status === 201, 'Learner profile create failed')
  console.log('✓ Learner profile created')

  res = await request('/profiles/learner', {
    method: 'POST',
    token: learner.token,
    body: { department: 'CSE' },
  })
  assert(res.status === 409, 'Duplicate learner profile should fail')
  console.log('✓ Duplicate learner profile blocked')

  res = await request('/profiles/learner', {
    method: 'PATCH',
    token: learner.token,
    body: { bio: 'Updated bio' },
  })
  assert(res.status === 200 && res.data.data.profile.bio === 'Updated bio', 'Learner update failed')
  console.log('✓ Learner profile updated')

  // Mentor profile
  res = await request('/profiles/mentor', {
    method: 'POST',
    token: mentor.token,
    body: { bio: 'Mentor bio', experience: '2 years', specialization: 'Web', availability: 'Evenings' },
  })
  assert(res.status === 201, 'Mentor profile create failed')
  console.log('✓ Mentor profile created')

  res = await request('/profiles/mentor', {
    method: 'PATCH',
    token: mentor.token,
    body: { experience: '3 years' },
  })
  assert(res.status === 200, 'Mentor update failed')
  console.log('✓ Mentor profile updated')

  // Faculty profile
  res = await request('/profiles/faculty', {
    method: 'POST',
    token: faculty.token,
    body: { designation: 'Professor', department: 'CSE', expertise: 'AI', bio: 'Faculty bio' },
  })
  assert(res.status === 201, 'Faculty profile create failed')
  console.log('✓ Faculty profile created')

  res = await request('/profiles/faculty', {
    method: 'PATCH',
    token: faculty.token,
    body: { designation: 'Associate Professor' },
  })
  assert(res.status === 200, 'Faculty update failed')
  console.log('✓ Faculty profile updated')

  // RBAC
  res = await request('/profiles/learner', { token: mentor.token })
  assert(res.status === 403, 'Mentor should not access learner profile route')
  console.log('✓ RBAC enforced on profile routes')

  // Skills (admin)
  res = await request('/skills', {
    method: 'POST',
    token: adminToken,
    body: { name: `React-${runId}`, description: 'React framework' },
  })
  assert(res.status === 201, 'Skill create failed')
  const skillId = res.data.data.skill.id
  console.log('✓ Skill created')

  res = await request('/skills', { token: learner.token })
  assert(res.status === 200 && res.data.data.total >= 1, 'Skill list failed')
  console.log('✓ Skills listed for authenticated user')

  res = await request(`/skills/${skillId}`, { token: learner.token })
  assert(res.status === 200, 'Get skill by id failed')
  console.log('✓ Skill fetched by id')

  res = await request(`/skills/${skillId}`, {
    method: 'PATCH',
    token: adminToken,
    body: { description: 'Updated description' },
  })
  assert(res.status === 200, 'Skill update failed')
  console.log('✓ Skill updated')

  res = await request('/skills', { method: 'POST', token: learner.token, body: { name: 'Blocked' } })
  assert(res.status === 403, 'Non-admin should not create skills')
  console.log('✓ Non-admin blocked from skill creation')

  // Mentor skills
  res = await request('/skills/mentor', {
    method: 'POST',
    token: mentor.token,
    body: { skillId },
  })
  assert(res.status === 201, 'Skill assignment failed')
  console.log('✓ Skill assigned to mentor')

  res = await request('/skills/mentor', {
    method: 'POST',
    token: mentor.token,
    body: { skillId },
  })
  assert(res.status === 409, 'Duplicate assignment should fail')
  console.log('✓ Duplicate skill assignment blocked')

  res = await request('/skills/mentor', { token: mentor.token })
  assert(res.status === 200 && res.data.data.skills.length === 1, 'Get mentor skills failed')
  const assignmentId = res.data.data.skills[0].assignmentId
  console.log('✓ Mentor skills retrieved with metadata')

  res = await request(`/skills/mentor/${assignmentId}`, {
    method: 'DELETE',
    token: mentor.token,
  })
  assert(res.status === 200, 'Remove mentor skill failed')
  console.log('✓ Mentor skill removed')

  res = await request(`/skills/${skillId}`, { method: 'DELETE', token: adminToken })
  assert(res.status === 200, 'Skill delete failed')
  console.log('✓ Skill deleted')

  console.log('\nAll Sprint 3 tests passed!')
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
