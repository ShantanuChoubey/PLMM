import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { ROLES } from '../../constants/roles.js'
import { AppError } from '../../utils/AppError.js'
import { profilesRepository } from '../profiles/profiles.repository.js'
import { sessionsRepository } from '../sessions/sessions.repository.js'
import { reviewsRepository } from './reviews.repository.js'

export const reviewsService = {
  // POST /reviews
  async createReview(userId, { sessionId, mentorId, rating, comment }) {
    // 1. Learner must have a profile
    const learnerProfile = await profilesRepository.findLearnerByUserId(userId)
    if (!learnerProfile) {
      throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    // 2. Session must exist and be COMPLETED
    const session = await sessionsRepository.findRawById(sessionId)
    if (!session) {
      throw new AppError(MESSAGES.SESSION_NOT_FOUND, StatusCodes.NOT_FOUND)
    }
    if (session.status !== 'COMPLETED') {
      throw new AppError(MESSAGES.SESSION_NOT_COMPLETED, StatusCodes.UNPROCESSABLE_ENTITY)
    }

    // 3. Learner must own the session
    if (session.learnerId !== learnerProfile.id) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    // 4. Mentor profile must exist
    const mentorProfile = await profilesRepository.findMentorById(mentorId)
    if (!mentorProfile) {
      throw new AppError(MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    // 5. Session must belong to that mentor
    if (session.mentorId !== mentorProfile.id) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    // 6. One review per session
    const existing = await reviewsRepository.findBySessionId(sessionId)
    if (existing) {
      throw new AppError(MESSAGES.REVIEW_ALREADY_EXISTS, StatusCodes.CONFLICT)
    }

    const review = await reviewsRepository.create({
      sessionId,
      mentorId: mentorProfile.id,
      learnerId: learnerProfile.id,
      rating,
      comment,
    })

    // Recalculate mentor's average rating
    await reviewsRepository.recalculateMentorRating(mentorProfile.id)

    return review
  },

  // GET /reviews/mentor/:mentorId
  async getMentorReviews(mentorId) {
    const mentorProfile = await profilesRepository.findMentorById(mentorId)
    if (!mentorProfile) {
      throw new AppError(MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    const [reviews, stats] = await Promise.all([
      reviewsRepository.findByMentorId(mentorProfile.id),
      reviewsRepository.getRatingStats(mentorProfile.id),
    ])

    return { reviews, stats }
  },

  // GET /reviews/session/:sessionId
  async getSessionReview(sessionId) {
    const review = await reviewsRepository.findBySessionId(sessionId)
    if (!review) {
      throw new AppError(MESSAGES.REVIEW_NOT_FOUND, StatusCodes.NOT_FOUND)
    }
    return review
  },

  // PATCH /reviews/:id
  async updateReview(userId, reviewId, data, userRole) {
    const review = await reviewsRepository.findRawById(reviewId)
    if (!review) throw new AppError(MESSAGES.REVIEW_NOT_FOUND, StatusCodes.NOT_FOUND)

    // Must be review owner (by learner user) or ADMIN
    const learnerProfile = await profilesRepository.findLearnerByUserId(userId)
    const isOwner = learnerProfile && review.learnerId === learnerProfile.id
    const isAdmin = userRole === ROLES.ADMIN

    if (!isOwner && !isAdmin) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    const updated = await reviewsRepository.update(reviewId, data)

    // Recalculate if rating changed
    if (data.rating !== undefined) {
      await reviewsRepository.recalculateMentorRating(review.mentorId)
    }

    return updated
  },

  // DELETE /reviews/:id
  async deleteReview(userId, reviewId, userRole) {
    const review = await reviewsRepository.findRawById(reviewId)
    if (!review) throw new AppError(MESSAGES.REVIEW_NOT_FOUND, StatusCodes.NOT_FOUND)

    const learnerProfile = await profilesRepository.findLearnerByUserId(userId)
    const isOwner = learnerProfile && review.learnerId === learnerProfile.id
    const isAdmin = userRole === ROLES.ADMIN

    if (!isOwner && !isAdmin) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    await reviewsRepository.delete(reviewId)

    // Recalculate mentor rating after deletion
    await reviewsRepository.recalculateMentorRating(review.mentorId)
  },
}
