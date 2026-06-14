export const MESSAGES = {
  // ─── Server ────────────────────────────────────────────────────────────────
  SERVER_HEALTHY: 'Server is healthy',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
  ENV_VALIDATION_FAILED: 'Environment validation failed',

  // ─── Auth ──────────────────────────────────────────────────────────────────
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_EXISTS: 'Email already registered',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to access this resource',
  TOKEN_MISSING: 'Authentication token is missing',
  TOKEN_INVALID: 'Invalid authentication token',
  TOKEN_EXPIRED: 'Authentication token has expired',
  USER_NOT_FOUND: 'User not found',
  USER_DISABLED: 'Your account has been disabled',
  VALIDATION_FAILED: 'Validation failed',

  // ─── Profiles ──────────────────────────────────────────────────────────────
  PROFILE_CREATED: 'Profile created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PROFILE_ALREADY_EXISTS: 'Profile already exists',
  PROFILE_NOT_FOUND: 'Profile not found',

  // ─── Skills ────────────────────────────────────────────────────────────────
  SKILL_CREATED: 'Skill created successfully',
  SKILL_UPDATED: 'Skill updated successfully',
  SKILL_DELETED: 'Skill deleted successfully',
  SKILL_ALREADY_EXISTS: 'Skill already exists',
  SKILL_NOT_FOUND: 'Skill not found',
  SKILL_ASSIGNED: 'Skill assigned successfully',
  SKILL_REMOVED: 'Skill removed successfully',
  SKILL_ALREADY_ASSIGNED: 'Skill already assigned to mentor',
  MENTOR_SKILL_NOT_FOUND: 'Mentor skill assignment not found',
  MENTOR_PROFILE_REQUIRED: 'Mentor profile is required',

  // ─── Availability ──────────────────────────────────────────────────────────
  SLOT_CREATED: 'Availability slot created',
  SLOT_UPDATED: 'Availability slot updated',
  SLOT_DELETED: 'Availability slot deleted',
  SLOT_ALREADY_EXISTS: 'Slot already exists',
  SLOT_OVERLAPPING: 'Overlapping slot detected',
  SLOT_NOT_FOUND: 'Availability slot not found',
  SLOT_INVALID_TIME_RANGE: 'End time must be after start time',
  SLOT_ALREADY_BOOKED: 'This slot is already booked',

  // ─── Discovery ─────────────────────────────────────────────────────────────
  MENTOR_NOT_FOUND: 'Mentor not found',

  // ─── Sessions ──────────────────────────────────────────────────────────────
  SESSION_BOOKED: 'Session booked successfully',
  SESSION_ACCEPTED: 'Session accepted successfully',
  SESSION_REJECTED: 'Session rejected successfully',
  SESSION_CANCELLED: 'Session cancelled successfully',
  SESSION_COMPLETED: 'Session completed successfully',
  SESSION_NOT_FOUND: 'Session not found',
  SESSION_INVALID_STATUS: 'Action not allowed for the current session status',

  // ─── Groups ────────────────────────────────────────────────────────────────
  GROUP_CREATED: 'Group created successfully',
  GROUP_UPDATED: 'Group updated successfully',
  GROUP_DELETED: 'Group deleted successfully',
  GROUP_NOT_FOUND: 'Group not found',
  GROUP_FULL: 'Group has reached its maximum member limit',
  GROUP_JOINED: 'Joined group successfully',
  GROUP_LEFT: 'Left group successfully',
  ALREADY_GROUP_MEMBER: 'You are already a member of this group',
  NOT_GROUP_MEMBER: 'You are not a member of this group',

  // ─── Resources ─────────────────────────────────────────────────────────────
  RESOURCE_CREATED: 'Resource created successfully',
  RESOURCE_UPDATED: 'Resource updated successfully',
  RESOURCE_DELETED: 'Resource deleted successfully',
  RESOURCE_NOT_FOUND: 'Resource not found',
  UPLOAD_FAILED: 'File upload failed',
  CLOUDINARY_NOT_CONFIGURED: 'File upload service is not configured',

  // ─── Reviews ───────────────────────────────────────────────────────────────
  REVIEW_CREATED: 'Review submitted successfully',
  REVIEW_UPDATED: 'Review updated successfully',
  REVIEW_DELETED: 'Review deleted successfully',
  REVIEW_NOT_FOUND: 'Review not found',
  REVIEW_ALREADY_EXISTS: 'You have already reviewed this session',
  SESSION_NOT_COMPLETED: 'Reviews can only be submitted for completed sessions',

  // ─── Notifications ─────────────────────────────────────────────────────────
  NOTIFICATION_NOT_FOUND: 'Notification not found',
  NOTIFICATION_MARKED_READ: 'Notification marked as read',
  NOTIFICATIONS_ALL_READ: 'All notifications marked as read',
  NOTIFICATION_DELETED: 'Notification deleted successfully',

  // ─── Progress ──────────────────────────────────────────────────────────────
  PROGRESS_CREATED: 'Progress record created successfully',
  PROGRESS_UPDATED: 'Progress updated successfully',
  PROGRESS_DELETED: 'Progress record deleted successfully',
  PROGRESS_NOT_FOUND: 'Progress record not found',

  // ─── Audit Logs ────────────────────────────────────────────────────────────
  AUDIT_LOGS_FETCHED: 'Audit logs fetched successfully',
  AUDIT_LOG_NOT_FOUND: 'Audit log not found',

  // ─── AI ────────────────────────────────────────────────────────────────────
  AI_NOT_CONFIGURED: 'AI service is not configured. Add GEMINI_API_KEY to .env',
  AI_GENERATION_FAILED: 'Failed to generate AI response',
  AI_INVALID_JSON: 'AI returned an invalid response format',
  AI_RESPONSE_GENERATED: 'AI response generated successfully',

  // ─── Recommendations ───────────────────────────────────────────────────────
  RECOMMENDATIONS_GENERATED: 'Mentor recommendations generated successfully',
  RECOMMENDATIONS_DELETED: 'Recommendations cleared successfully',
  RECOMMENDATION_NOT_FOUND: 'Recommendation not found',

  // ─── Study Plans ───────────────────────────────────────────────────────────
  STUDY_PLAN_GENERATED: 'Study plan generated successfully',
  STUDY_PLAN_DELETED: 'Study plan deleted successfully',
  STUDY_PLAN_NOT_FOUND: 'Study plan not found',

  // ─── Goal Analysis ─────────────────────────────────────────────────────────
  GOAL_ANALYSIS_GENERATED: 'Goal analyzed successfully',
  GOAL_ANALYSIS_DELETED: 'Goal analysis deleted successfully',
  GOAL_ANALYSIS_NOT_FOUND: 'Goal analysis not found',
}

export const API_VERSION = 'v1'
