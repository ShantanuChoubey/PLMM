import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { authService } from './auth.service.js'

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body)

  return sendSuccess(res, {
    message: MESSAGES.REGISTER_SUCCESS,
    statusCode: StatusCodes.CREATED,
    data: { user, token },
  })
})

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body)

  return sendSuccess(res, {
    message: MESSAGES.LOGIN_SUCCESS,
    data: { user, token },
  })
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id)

  return sendSuccess(res, {
    data: { user },
  })
})

export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.token)

  return sendSuccess(res, {
    message: result.message,
  })
})
