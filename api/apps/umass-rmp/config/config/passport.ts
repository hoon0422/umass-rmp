import passport from 'passport';
import LocalStrategy from 'passport-local';
import { getRepository } from 'typeorm';
import { User } from '../../../../libs/models/src/entity/User.entity';
import { compare } from 'bcrypt';

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOneOrFail(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  'local',
  new LocalStrategy.Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const userRepository = getRepository(User);
      try {
        const user = await userRepository.findOne({ username });

        // Cannot find username
        if (!user) {
          done(null, false);
          return;
        }

        // Wrong password
        if (!(await compare(password, user.password))) {
          done(null, false);
          return;
        }

        // Identified user
        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

export default passport;
