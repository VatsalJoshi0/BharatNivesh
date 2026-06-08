import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import logger from '../config/logger.js';

dotenv.config();

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
    },
    async (payload, done) => {
      try {
        if (payload.userId) {
          return done(null, { userId: payload.userId, role: payload.role });
        }
        return done(null, false);
      } catch (err) {
        logger.error('JWT verification error:', err);
        return done(err);
      }
    }
  )
);

export const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      logger.error('JWT verification error:', err);
      return res.status(500).json({ error: 'Internal server error during authentication' });
    }
    if (!user) {
      const msg = info && info.message ? info.message : 'Unauthorized';
      logger.warn(`Unauthorized access attempt: ${msg}`);
      return res.status(401).json({ error: msg });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const optionalJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (user) req.user = user;
    next();
  })(req, res, next);
};
