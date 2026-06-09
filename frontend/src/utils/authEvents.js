export const AUTH_EVENTS = {
  SESSION_EXPIRED: 'plmm:session-expired',
}

export function emitSessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.SESSION_EXPIRED))
  }
}
