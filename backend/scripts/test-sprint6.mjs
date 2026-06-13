/**
 * Backend Sprint 6 — Study Groups & Resource Hub Test Script
 * Run: node scripts/test-sprint6.mjs
 * Prerequisites: backend running on port 5000
 */

const BASE = 'http://localhost:5000/api/v1'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
function fail(label, detail) { console.error(`  ❌  ${label}`, JSON.stringify(detail, null, 2)); process.exit(1) }
function section(title) { console.log(`\n── ${title} ──`) }

// ─── Setup ────────────────────────────────────────────────────────────────────

const ts = Date.now()
const U1_EMAIL = `user1_s6_${ts}@test.com`
const U2_EMAIL = `user2_s6_${ts}@test.com`
const U3_EMAIL = `user3_s6_${ts}@test.com`
const PWD = 'password123'

let token1, token2, token3
let userId1, userId2
let groupId, privateGroupId, resourceId

section('Setup — Register & Login 3 users')

for (const [email, role] of [[U1_EMAIL,'LEARNER'],[U2_EMAIL,'LEARNER'],[U3_EMAIL,'PEER_MENTOR']]) {
  const r = await req('POST', '/auth/register', { name: `S6 ${role}`, email, password: PWD, role })
  if (!r.success) fail(`Register ${email}`, r)
}
pass('3 users registered')

{
  const r = await req('POST', '/auth/login', { email: U1_EMAIL, password: PWD })
  if (!r.success) fail('Login user1', r)
  token1 = r.data.token
  userId1 = r.data.user.id
}
{
  const r = await req('POST', '/auth/login', { email: U2_EMAIL, password: PWD })
  if (!r.success) fail('Login user2', r)
  token2 = r.data.token
  userId2 = r.data.user.id
}
{
  const r = await req('POST', '/auth/login', { email: U3_EMAIL, password: PWD })
  if (!r.success) fail('Login user3', r)
  token3 = r.data.token
}
pass('All users logged in')

// ─── Create Groups ────────────────────────────────────────────────────────────

section('Create Groups')

{
  const r = await req('POST', '/groups', {
    name: 'React Study Group',
    description: 'Learn React together',
    category: 'Frontend Development',
    visibility: 'PUBLIC',
    maxMembers: 10,
  }, token1)
  if (!r.success) fail('Create public group', r)
  groupId = r.data.group.id
  if (r.status !== 201) fail('Should return 201', r.status)
  pass(`Public group created (${groupId})`)
}

{
  const r = await req('POST', '/groups', {
    name: 'Private DSA Group',
    description: 'Exclusive DSA prep',
    category: 'DSA',
    visibility: 'PRIVATE',
    maxMembers: 5,
  }, token1)
  if (!r.success) fail('Create private group', r)
  privateGroupId = r.data.group.id
  pass(`Private group created (${privateGroupId})`)
}

// ─── Get Groups ───────────────────────────────────────────────────────────────

section('Get Groups — Search & Filter')

{
  const r = await req('GET', '/groups', null, token1)
  if (!r.success) fail('Get all groups', r)
  if (r.data.groups.length < 2) fail('Should see at least 2 groups', r.data)
  pass(`Get all groups — ${r.data.groups.length} result(s)`)
}

{
  const r = await req('GET', '/groups?search=React', null, token1)
  if (!r.success) fail('Search groups', r)
  const found = r.data.groups.some(g => g.name.includes('React'))
  if (!found) fail('Search should find React group', r.data.groups)
  pass(`Search "React" → ${r.data.groups.length} result(s)`)
}

{
  const r = await req('GET', '/groups?category=DSA', null, token1)
  if (!r.success) fail('Filter by category', r)
  pass(`Filter by category=DSA → ${r.data.groups.length} result(s)`)
}

{
  const r = await req('GET', '/groups?visibility=PUBLIC', null, token1)
  if (!r.success) fail('Filter by visibility', r)
  const allPublic = r.data.groups.every(g => g.visibility === 'PUBLIC')
  if (!allPublic) fail('All results should be PUBLIC', r.data.groups)
  pass(`Filter by visibility=PUBLIC → ${r.data.groups.length} result(s)`)
}

// ─── Get Group by ID ──────────────────────────────────────────────────────────

section('Get Group Detail')

{
  const r = await req('GET', `/groups/${groupId}`, null, token1)
  if (!r.success) fail('Get group by ID', r)
  if (!r.data.group.members) fail('Should include members', r.data.group)
  if (!r.data.group.creator) fail('Should include creator', r.data.group)
  if (r.data.group._count === undefined && r.data.group.members.length === 0) {
    // creator is auto-added as OWNER
  }
  pass('Group detail includes members and creator')
}

// ─── Join / Leave Group ───────────────────────────────────────────────────────

section('Join & Leave Group')

{
  const r = await req('POST', `/groups/${groupId}/join`, null, token2)
  if (!r.success) fail('User2 join group', r)
  if (r.status !== 201) fail('Should return 201', r.status)
  pass('User2 joined group successfully')
}

{
  // User2 tries to join again — should be 409
  const r = await req('POST', `/groups/${groupId}/join`, null, token2)
  if (r.success) fail('Double-join should be rejected', r)
  if (r.status !== 409) fail('Expected 409 Conflict', r.status)
  pass('Double-join blocked (409)')
}

{
  const r = await req('POST', `/groups/${groupId}/join`, null, token3)
  if (!r.success) fail('User3 join group', r)
  pass('User3 joined group successfully')
}

{
  // Get members — should now have 3
  const r = await req('GET', `/groups/${groupId}/members`, null, token1)
  if (!r.success) fail('Get group members', r)
  if (r.data.members.length < 3) fail('Should have at least 3 members', r.data.members.length)
  pass(`Group has ${r.data.members.length} members (creator + 2 joiners)`)
}

{
  // User3 leaves
  const r = await req('POST', `/groups/${groupId}/leave`, null, token3)
  if (!r.success) fail('User3 leave group', r)
  pass('User3 left group successfully')
}

{
  // User3 tries to leave again — not a member
  const r = await req('POST', `/groups/${groupId}/leave`, null, token3)
  if (r.success) fail('Should not be able to leave if not a member', r)
  pass('Leave when not member correctly blocked')
}

// ─── Max members enforcement ──────────────────────────────────────────────────

section('Max Members Enforcement')

{
  // Create a group with maxMembers=2
  const r = await req('POST', '/groups', {
    name: 'Tiny Group',
    category: 'Other',
    maxMembers: 2,
  }, token1)
  if (!r.success) fail('Create tiny group', r)
  const tinyGroupId = r.data.group.id

  // User2 joins (now 2/2)
  const j = await req('POST', `/groups/${tinyGroupId}/join`, null, token2)
  if (!j.success) fail('User2 join tiny group', j)

  // User3 tries to join (should be full)
  const full = await req('POST', `/groups/${tinyGroupId}/join`, null, token3)
  if (full.success) fail('Group should be full', full)
  if (full.status !== 409) fail('Expected 409 for full group', full.status)
  pass('Max members enforced (409 when group full)')
}

// ─── Update Group ──────────────────────────────────────────────────────────────

section('Update Group')

{
  const r = await req('PATCH', `/groups/${groupId}`, {
    description: 'Updated description for React group',
  }, token1)
  if (!r.success) fail('Update group', r)
  if (r.data.group.description !== 'Updated description for React group') fail('Description not updated', r.data.group)
  pass('Group updated successfully')
}

{
  // Non-owner/non-admin tries to update — should be 403
  const r = await req('PATCH', `/groups/${groupId}`, { description: 'Hacked' }, token2)
  if (r.success) fail('Non-owner should not update group', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Non-owner blocked from updating (403)')
}

// ─── Create Resources ─────────────────────────────────────────────────────────

section('Create Resources (External URL)')

{
  // Create a resource with external URL (no Cloudinary needed)
  const r = await req('POST', '/resources', {
    title: 'React Hooks Guide',
    description: 'Complete guide to React hooks',
    type: 'ARTICLE',
    category: 'Frontend Development',
    externalUrl: 'https://react.dev/reference/react',
    groupId,
  }, token1)
  if (!r.success) fail('Create resource with external URL', r)
  resourceId = r.data.resource.id
  if (r.status !== 201) fail('Should return 201', r.status)
  if (!r.data.resource.fileUrl) fail('fileUrl should be set', r.data.resource)
  pass(`Resource created (${resourceId}) — type: ARTICLE`)
}

{
  // Personal resource (no group)
  const r = await req('POST', '/resources', {
    title: 'DSA Cheatsheet',
    type: 'PDF',
    category: 'DSA',
    externalUrl: 'https://example.com/dsa.pdf',
  }, token2)
  if (!r.success) fail('Create personal resource', r)
  pass(`Personal resource created (${r.data.resource.id})`)
}

{
  // Non-member tries to add resource to group — should be 403
  const r = await req('POST', '/resources', {
    title: 'Unauthorized Resource',
    type: 'LINK',
    category: 'Other',
    externalUrl: 'https://example.com',
    groupId,
  }, token3)
  if (r.success) fail('Non-member should not add to group', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Non-member blocked from adding group resource (403)')
}

// ─── Get Resources ────────────────────────────────────────────────────────────

section('Get Resources — Search & Filter')

{
  const r = await req('GET', '/resources', null, token1)
  if (!r.success) fail('Get all resources', r)
  if (r.data.resources.length < 2) fail('Should see at least 2 resources', r.data)
  pass(`Get all resources — ${r.data.resources.length} result(s)`)
}

{
  const r = await req('GET', '/resources?type=ARTICLE', null, token1)
  if (!r.success) fail('Filter by type', r)
  const allArticle = r.data.resources.every(res => res.type === 'ARTICLE')
  if (!allArticle) fail('All results should be ARTICLE', r.data.resources)
  pass(`Filter by type=ARTICLE → ${r.data.resources.length} result(s)`)
}

{
  const r = await req('GET', `/resources?groupId=${groupId}`, null, token1)
  if (!r.success) fail('Filter by groupId', r)
  pass(`Filter by groupId → ${r.data.resources.length} result(s)`)
}

{
  const r = await req('GET', '/resources?search=React', null, token1)
  if (!r.success) fail('Search resources', r)
  pass(`Search "React" → ${r.data.resources.length} result(s)`)
}

{
  const r = await req('GET', '/resources?sortBy=views&sortOrder=desc', null, token1)
  if (!r.success) fail('Sort by views', r)
  pass('Sort by views works')
}

// ─── Get Resource by ID ───────────────────────────────────────────────────────

section('Get Resource Detail')

{
  const r = await req('GET', `/resources/${resourceId}`, null, token1)
  if (!r.success) fail('Get resource by ID', r)
  if (!r.data.resource.uploader) fail('Should include uploader', r.data.resource)
  pass('Resource detail includes uploader data')
}

// ─── View & Download Tracking ─────────────────────────────────────────────────

section('View & Download Tracking')

{
  const r = await req('PATCH', `/resources/${resourceId}/view`, null, token2)
  if (!r.success) fail('Track view', r)
  if (r.data.views < 1) fail('Views should be incremented', r.data)
  pass(`View tracked — views: ${r.data.views}`)
}

{
  const r = await req('PATCH', `/resources/${resourceId}/view`, null, token3)
  if (!r.success) fail('Track second view', r)
  if (r.data.views < 2) fail('Views should be 2', r.data)
  pass(`Second view tracked — views: ${r.data.views}`)
}

{
  const r = await req('PATCH', `/resources/${resourceId}/download`, null, token2)
  if (!r.success) fail('Track download', r)
  if (r.data.downloads < 1) fail('Downloads should be incremented', r.data)
  pass(`Download tracked — downloads: ${r.data.downloads}`)
}

// ─── Update Resource ──────────────────────────────────────────────────────────

section('Update Resource')

{
  const r = await req('PATCH', `/resources/${resourceId}`, {
    title: 'React Hooks Guide — Updated',
    description: 'Updated description',
  }, token1)
  if (!r.success) fail('Update resource', r)
  if (!r.data.resource.title.includes('Updated')) fail('Title not updated', r.data.resource)
  pass('Resource updated successfully')
}

{
  // Non-owner tries to update
  const r = await req('PATCH', `/resources/${resourceId}`, { title: 'Hacked' }, token2)
  if (r.success) fail('Non-owner should not update resource', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Non-owner blocked from updating resource (403)')
}

// ─── Delete Resource ──────────────────────────────────────────────────────────

section('Delete Resource')

{
  // Create a temp resource to delete
  const cr = await req('POST', '/resources', {
    title: 'Temp Resource',
    type: 'LINK',
    category: 'Other',
    externalUrl: 'https://example.com/temp',
  }, token2)
  const tempId = cr.data.resource.id

  const r = await req('DELETE', `/resources/${tempId}`, null, token2)
  if (!r.success) fail('Delete resource', r)
  pass('Resource deleted successfully')

  // Verify it's gone
  const check = await req('GET', `/resources/${tempId}`, null, token1)
  if (check.success) fail('Resource should be gone after delete', check)
  pass('Deleted resource returns 404')
}

// ─── Delete Group ─────────────────────────────────────────────────────────────

section('Delete Group')

{
  // Non-owner tries to delete
  const r = await req('DELETE', `/groups/${groupId}`, null, token2)
  if (r.success) fail('Non-owner should not delete group', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('Non-owner blocked from deleting group (403)')
}

{
  const r = await req('DELETE', `/groups/${privateGroupId}`, null, token1)
  if (!r.success) fail('Owner delete group', r)
  pass('Group deleted by owner successfully')

  // Verify it's gone
  const check = await req('GET', `/groups/${privateGroupId}`, null, token1)
  if (check.success) fail('Group should be gone after delete', check)
  pass('Deleted group returns 404')
}

// ─── Pagination ───────────────────────────────────────────────────────────────

section('Pagination')

{
  const r = await req('GET', '/groups?page=1&limit=1', null, token1)
  if (!r.success) fail('Paginate groups', r)
  if (r.data.groups.length > 1) fail('Limit=1 should return max 1 result', r.data.groups.length)
  if (!r.data.pagination.total) fail('Should include pagination.total', r.data.pagination)
  pass(`Pagination works — page:${r.data.pagination.page} limit:${r.data.pagination.limit} total:${r.data.pagination.total}`)
}

{
  const r = await req('GET', '/resources?page=1&limit=1', null, token1)
  if (!r.success) fail('Paginate resources', r)
  if (r.data.resources.length > 1) fail('Limit=1 should return max 1 result', r.data.resources.length)
  pass('Resource pagination works')
}

// ─── Auth guard ───────────────────────────────────────────────────────────────

section('Auth Guards')

{
  const r = await req('GET', '/groups', null, null) // no token
  if (r.success) fail('Unauthenticated should be rejected', r)
  if (r.status !== 401) fail('Expected 401', r.status)
  pass('Unauthenticated request blocked (401)')
}

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log('\n🎉  Backend Sprint 6 — All tests passed!\n')
console.log('Endpoints verified:')
console.log('  POST   /api/v1/groups                    ✅')
console.log('  GET    /api/v1/groups                    ✅')
console.log('  GET    /api/v1/groups/:id                ✅')
console.log('  PATCH  /api/v1/groups/:id                ✅')
console.log('  DELETE /api/v1/groups/:id                ✅')
console.log('  POST   /api/v1/groups/:id/join           ✅')
console.log('  POST   /api/v1/groups/:id/leave          ✅')
console.log('  GET    /api/v1/groups/:id/members        ✅')
console.log('  POST   /api/v1/resources                 ✅')
console.log('  GET    /api/v1/resources                 ✅')
console.log('  GET    /api/v1/resources/:id             ✅')
console.log('  PATCH  /api/v1/resources/:id             ✅')
console.log('  DELETE /api/v1/resources/:id             ✅')
console.log('  PATCH  /api/v1/resources/:id/view        ✅')
console.log('  PATCH  /api/v1/resources/:id/download    ✅')
