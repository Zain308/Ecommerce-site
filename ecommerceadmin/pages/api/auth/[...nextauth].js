import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

const adminEmails=['numl-s23-13058@numls.edu.pk'];

export const authOptions=
  {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
    ], // <-- Close the providers array here
  
    adapter: MongoDBAdapter(clientPromise), // <-- Move adapter outside of providers
    callbacks:{
      session:({session,token,user})=>{
        if(adminEmails.includes(session?.user?.email)){
          return session;
        }
        else{
          return false;
        }
      },
    },
  };

export default NextAuth(authOptions);
 
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    res.status(401).json({ error: 'Not authorized' });
    throw new Error('Not an admin');
  }
}