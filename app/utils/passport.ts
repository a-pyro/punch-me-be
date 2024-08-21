import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { supabase, TablesInsert } from '../database'
import { env } from './env'

//https:dev.to/chryzcode/google-authentication-in-nodejs-using-passport-and-google-oauth-f51
//initialize
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID, // google client id
      clientSecret: env.GOOGLE_CLIENT_SECRET, // google client secret
      // the callback url added while creating the Google auth app on the console
      callbackURL: env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },

    // returns the authenticated email profile
    async function (_request, _accessToken, _refreshToken, profile, done) {
      const {
        id: googleProfileId,
        displayName,
        emails,
        photos,
        _json: { email: googleEmail },
      } = profile

      let { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('googleId', googleProfileId)
        .single()
      if (!userData) {
        const email = emails?.[0].value ?? googleEmail
        if (!email) return done(new Error('No email found in Google profile'))

        const newUser: TablesInsert<'users'> = {
          created_at: new Date().toISOString(),
          display_name: displayName,
          email,
          google_id: googleProfileId,
          avatar_url: photos?.[0].value,
        }

        const { data, error } = await supabase
          .from('users')
          .insert(newUser)
          .select()

        console.log('🚀 ~ error:', error)
        userData = data?.[0]!
      }

      // Create your own JWT
      const token = jwt.sign(
        {
          userId: userData.id,
          email: userData.email,
          name: userData.display_name,
        },
        env.JWT_SECRET,
        { expiresIn: '1h' },
      )

      return done(null, { userData, token })
    },
  ),
)

// function to serialize a user/profile object into the session
passport.serializeUser(function (user, done) {
  done(null, user)
})

// function to deserialize a user/profile object into the session
passport.deserializeUser(function (user: Express.User, done) {
  done(null, user)
})

// export the passport object
export { passport }
