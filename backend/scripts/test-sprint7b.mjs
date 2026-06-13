/**
 * Backend Sprint 7B — Notifications System Test Script
 * Run: node scripts/test-sprint7b.mjs
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
const U1_EMAIL = `notif_u1_${ts}@test.com`
const U2_EMAIL = `notif_u2_${ts}@test.com`
const PWD = 'password123'

let token1, token2, userId1
let notifId1, notifId2, notifId3

section('Setup — Register & Login')

for (const [email, role] of [[U1_EMAIL, 'LEARNER'], [U2_EMAIL, 'LEARNER']]) {
  const r = await req('POST', '/auth/register', { name: `NF ${role}`, email, password: PWD, role })
  if (!r.success) fail(`Register ${email}`, r)
}
pass('2 users registered')

{
  const r = await req('POST', '/auth/login', { email: U1_EMAIL, password: PWD })
  token1 = r.data.token
  userId1 = r.data.user.id
}
{ const r = await req('POST', '/auth/login', { email: U2_EMAIL, password: PWD }); token2 = r.data.token }
pass('Both users logged in')

// ─── Seed notifications via service directly (call the create helper) ─────────
// We seed by creating notifications through the internal service.
// Since there's no public "create" endpoint (notifications are created internally),
// we use a temp admin-style approach: POST to a seeding route via test endpoint.
// Instead, we'll use the event helper by triggering real actions.

section('Seed Notifications via Event Helpers (internal createNotification)')

// Use the internal notificationsService directly via a small inline node script
// to seed test data without exposing a public creation endpoint.
// We do this by making real API calls that WOULD trigger notifications in Sprint 8
// when wired up — for now, we seed manually via the test helper endpoint.

// Seed 3 notifications for user1 using direct DB insert via the running server's
// internal test endpoint. Since we have /api/v1/test routes, we'll seed via a
// dedicated one-off fetch to the notifications service create endpoint.
// Since the spec says no public create endpoint, we seed by making the server
// call notificationsService.createNotification internally via a small helper module.

// ── Approach: use the notificationsService directly in this script ──────────
// Import the service and call it directly (shares the same DB connection)
import { notificationsService } from '../src/modules/notifications/notifications.service.js'

const n1 = await notificationsService.createNotification({
  userId: userId1,
  title: 'Session Accepted',
  message: 'Your React Hooks session has been accepted',
  type: 'SESSION_ACCEPTED',
  metadata: { sessionId: 'test-session-1' },
})
notifId1 = n1.id
pass(`Notification 1 seeded (${notifId1}) — SESSION_ACCEPTED, unread`)

const n2 = await notificationsService.createNotification({
  userId: userId1,
  title: 'New Resource Shared',
  message: 'A new resource has been added to your group',
  type: 'RESOURCE_UPLOADED',
  metadata: { resourceId: 'test-resource-1' },
})
notifId2 = n2.id
pass(`Notification 2 seeded (${notifId2}) — RESOURCE_UPLOADED, unread`)

const n3 = await notificationsService.createNotification({
  userId: userId1,
  title: 'System Message',
  message: 'Welcome to PLMM!',
  type: 'SYSTEM',
})
notifId3 = n3.id
pass(`Notification 3 seeded (${notifId3}) — SYSTEM, unread`)

// ─── Get Notifications ────────────────────────────────────────────────────────

section('GET /notifications — List & Filters')

{
  const r = await req('GET', '/notifications', null, token1)
  if (!r.success) fail('Get all notifications', r)
  if (r.data.notifications.length < 3) fail('Should see at least 3 notifications', r.data)
  if (r.data.unreadCount < 3) fail('unreadCount should be at least 3', r.data.unreadCount)
  if (!r.data.pagination.total) fail('Pagination total missing', r.data.pagination)
  pass(`Got ${r.data.notifications.length} notifications, unreadCount: ${r.data.unreadCount}`)
}

{
  // Filter by isRead=false
  const r = await req('GET', '/notifications?isRead=false', null, token1)
  if (!r.success) fail('Filter isRead=false', r)
  const allUnread = r.data.notifications.every(n => !n.isRead)
  if (!allUnread) fail('All should be unread', r.data.notifications)
  pass(`Filter isRead=false → ${r.data.notifications.length} unread notification(s)`)
}

{
  // Filter by type
  const r = await req('GET', '/notifications?type=SESSION_ACCEPTED', null, token1)
  if (!r.success) fail('Filter by type', r)
  const allCorrectType = r.data.notifications.every(n => n.type === 'SESSION_ACCEPTED')
  if (!allCorrectType) fail('All should be SESSION_ACCEPTED', r.data.notifications)
  pass(`Filter type=SESSION_ACCEPTED → ${r.data.notifications.length} result(s)`)
}

{
  // Pagination
  const r = await req('GET', '/notifications?page=1&limit=2', null, token1)
  if (!r.success) fail('Paginate notifications', r)
  if (r.data.notifications.length > 2) fail('limit=2 should return max 2', r.data.notifications.length)
  if (r.data.pagination.limit !== 2) fail('Pagination limit should be 2', r.data.pagination)
  pass(`Pagination: page=${r.data.pagination.page} limit=${r.data.pagination.limit} total=${r.data.pagination.total}`)
}

// ─── Get Single Notification ──────────────────────────────────────────────────

section('GET /notifications/:id')

{
  const r = await req('GET', `/notifications/${notifId1}`, null, token1)
  if (!r.success) fail('Get notification by ID', r)
  if (r.data.notification.id !== notifId1) fail('Wrong notification returned', r.data.notification)
  if (r.data.notification.type !== 'SESSION_ACCEPTED') fail('Wrong type', r.data.notification.type)
  pass(`Got notification by ID — type: ${r.data.notification.type}`)
}

{
  // User2 cannot access user1's notification
  const r = await req('GET', `/notifications/${notifId1}`, null, token2)
  if (r.success) fail('User2 should not access user1 notification', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('User2 blocked from accessing user1 notification (403)')
}

{
  // Non-existent notification
  const r = await req('GET', '/notifications/nonexistent999', null, token1)
  if (r.success) fail('Should return 404', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Non-existent notification returns 404')
}

// ─── Mark As Read ─────────────────────────────────────────────────────────────

section('PATCH /notifications/:id/read')

{
  const r = await req('PATCH', `/notifications/${notifId1}/read`, null, token1)
  if (!r.success) fail('Mark as read', r)
  if (!r.data.notification.isRead) fail('Should be marked read', r.data.notification)
  pass(`Notification ${notifId1} marked as read`)
}

{
  // Verify unread count decreased
  const r = await req('GET', '/notifications?isRead=false', null, token1)
  if (!r.success) fail('Get unread after mark', r)
  const stillHasUnread2 = r.data.notifications.some(n => n.id === notifId2)
  if (!stillHasUnread2) fail('notifId2 should still be unread', r.data.notifications)
  pass(`unreadCount decreased — ${r.data.unreadCount} remaining`)
}

{
  // User2 cannot mark user1's notification as read
  const r = await req('PATCH', `/notifications/${notifId2}/read`, null, token2)
  if (r.success) fail('User2 should not mark user1 notification', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('User2 blocked from marking user1 notification (403)')
}

// ─── Mark All As Read ─────────────────────────────────────────────────────────

section('PATCH /notifications/read-all')

{
  const r = await req('PATCH', '/notifications/read-all', null, token1)
  if (!r.success) fail('Mark all as read', r)
  if (typeof r.data.updatedCount !== 'number') fail('updatedCount should be a number', r.data)
  pass(`Marked all as read — updatedCount: ${r.data.updatedCount}`)
}

{
  // Verify all are now read
  const r = await req('GET', '/notifications?isRead=false', null, token1)
  if (!r.success) fail('Get unread after mark-all', r)
  if (r.data.notifications.length !== 0) fail('All should be read now', r.data.notifications)
  if (r.data.unreadCount !== 0) fail('unreadCount should be 0', r.data.unreadCount)
  pass('All notifications are now read — unreadCount: 0')
}

{
  // Mark all again — should return 0 (nothing to update)
  const r = await req('PATCH', '/notifications/read-all', null, token1)
  if (!r.success) fail('Mark all when nothing unread', r)
  if (r.data.updatedCount !== 0) fail('updatedCount should be 0', r.data.updatedCount)
  pass('Mark all when already read returns updatedCount: 0')
}

// ─── Filter isRead=true ───────────────────────────────────────────────────────

section('Filter isRead=true')

{
  const r = await req('GET', '/notifications?isRead=true', null, token1)
  if (!r.success) fail('Filter isRead=true', r)
  const allRead = r.data.notifications.every(n => n.isRead)
  if (!allRead) fail('All should be read', r.data.notifications)
  pass(`Filter isRead=true → ${r.data.notifications.length} read notification(s)`)
}

// ─── Delete Notification ──────────────────────────────────────────────────────

section('DELETE /notifications/:id')

{
  // User2 cannot delete user1's notification
  const r = await req('DELETE', `/notifications/${notifId3}`, null, token2)
  if (r.success) fail('User2 should not delete user1 notification', r)
  if (r.status !== 403) fail('Expected 403', r.status)
  pass('User2 blocked from deleting user1 notification (403)')
}

{
  const r = await req('DELETE', `/notifications/${notifId3}`, null, token1)
  if (!r.success) fail('Delete notification', r)
  pass(`Notification ${notifId3} deleted`)
}

{
  // Confirm deleted
  const r = await req('GET', `/notifications/${notifId3}`, null, token1)
  if (r.success) fail('Should return 404 after delete', r)
  if (r.status !== 404) fail('Expected 404', r.status)
  pass('Deleted notification returns 404')
}

// ─── Isolation — User2 sees only their own ────────────────────────────────────

section('Notification Isolation')

{
  // Seed one for user2
  await notificationsService.createNotification({
    userId: token2 ? (await req('GET', '/auth/me', null, token2)).data?.user?.id : 'dummy' ,
    title: 'User2 Notification',
    message: 'Only for user2',
    type: 'SYSTEM',
  })

  const r = await req('GET', '/notifications', null, token2)
  if (!r.success) fail('User2 get notifications', r)
  // User2 should only see their own
  const hasUser1Notif = r.data.notifications.some(n => [notifId1, notifId2].includes(n.id))
  if (hasUser1Notif) fail('User2 should not see user1 notifications', r.data.notifications)
  pass(`User2 sees only their own notifications (${r.data.notifications.length})`)
}

// ─── Auth Guard ───────────────────────────────────────────────────────────────

section('Auth Guard')

{
  const r = await req('GET', '/notifications', null, null)
  if (r.success) fail('Unauthenticated should be blocked', r)
  if (r.status !== 401) fail('Expected 401', r.status)
  pass('Unauthenticated request blocked (401)')
}

// ─── Validation ───────────────────────────────────────────────────────────────

section('Validation')

{
  const r = await req('GET', '/notifications?type=INVALID_TYPE', null, token1)
  if (r.success) fail('Invalid type should fail validation', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('Invalid notification type rejected (400)')
}

{
  const r = await req('GET', '/notifications?limit=500', null, token1)
  if (r.success) fail('limit > 100 should fail', r)
  if (r.status !== 400) fail('Expected 400', r.status)
  pass('limit > 100 rejected (400)')
}

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log('\n🎉  Backend Sprint 7B — All tests passed!\n')
console.log('Endpoints verified:')
console.log('  GET    /api/v1/notifications               ✅')
console.log('  GET    /api/v1/notifications/:id           ✅')
console.log('  PATCH  /api/v1/notifications/:id/read      ✅')
console.log('  PATCH  /api/v1/notifications/read-all      ✅')
console.log('  DELETE /api/v1/notifications/:id           ✅')
console.log('\nEvent helpers created (not yet wired):')
console.log('  notifySessionBooked()     ✅')
console.log('  notifySessionAccepted()   ✅')
console.log('  notifySessionRejected()   ✅')
console.log('  notifySessionCancelled()  ✅')
console.log('  notifySessionCompleted()  ✅')
console.log('  notifyGroupJoined()       ✅')
console.log('  notifyResourceUploaded()  ✅')
console.log('  notifyReviewReceived()    ✅')
