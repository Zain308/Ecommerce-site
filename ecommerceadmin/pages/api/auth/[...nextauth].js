import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb.js";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise), // ✅ Moved outside the providers array
  session: {
    strategy: "jwt", // ✅ Use JWT-based session
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Ensure this is set in .env.local
  pages: {
    signIn: "/auth/signin", // Optional: Custom sign-in page
  },
});
