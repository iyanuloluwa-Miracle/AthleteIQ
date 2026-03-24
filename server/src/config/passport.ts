import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { env } from './env.js'
import { User } from '../models/index.js'
import { logger } from '../utils/logger.js'

export function initPassport(): void {
  if (!env.googleClientId || !env.googleClientSecret) {
    logger.warn('Google OAuth not configured — GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing')
    return
  }

  const callbackURL = `${env.serverUrl}/api/auth/google/callback`

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value
          if (!email) return done(new Error('No email returned from Google'))

          // Find by googleId first, then fall back to email
          let user = await User.findOne({ googleId: profile.id })

          if (!user) {
            user = await User.findOne({ email })
            if (user) {
              // Link existing email account to Google
              user.googleId = profile.id
              await user.save()
            } else {
              // Create new user
              user = await User.create({
                name: profile.displayName || email.split('@')[0],
                email,
                googleId: profile.id
              })
            }
          }

          return done(null, user)
        } catch (err) {
          return done(err as Error)
        }
      }
    )
  )
}
