import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { env } from './env'

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
    async function (request, accessToken, refreshToken, profile, done) {
      console.log('🚀 ~ refreshToken:', refreshToken)
      console.log('🚀 ~ accessToken:', accessToken)
      // you can write some algorithms here based on your application models and all
      // an example - not related to this application

      /*
   const exist = await User.findOne({ email: profile["emails"][0].value });
   if (!exist) {
        await User.create({
        email: profile["emails"][0].value,
          fullName: profile["displayName"],
          avatar: profile["photos"][0].value,
          username: profile["name"]["givenName"],
          verified: true,
        });
      }
    const user = await User.findOne({ email: profile["emails"][0].value });
 return done(null, user);
*/
      return done(null, profile)
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
