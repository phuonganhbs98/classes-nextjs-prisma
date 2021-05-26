import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.SECRET,
  theme: 'dark',
  pages: {
    newUser: '/users/selectType'
  },
  session: {
    // jwt: true
    maxAge: 24*60*60
  },
  callbacks: {
    /**
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @param  {object}  profile   Provider profile (only available on sign in)
     * @param  {boolean} isNewUser True if new user (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */

    async signIn(user, account, profile) {
      // return 'redirect:/'
      // console.log("i'm in signin function")
      // console.log(user)
      // console.log(profile)
      // console.log(localStorage)
      
      return true;
    },

    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      if (account?.accessToken) {
        token.accessToken = account.accessToken
      }
      if (user?.role) {
        token.role = user.role
      }
      if (user?.id) {
        token.id = user.id
      }
      return token
    },

    async session(session: any, token: any) {
      // Add property to session, like an access_token from a provider.
      session.accessToken = token.accessToken
      session.role = token.role
      session.userId = token.id
      return session
    }
  },
  events:{
    async signIn(message) { 
    },
  }
};

