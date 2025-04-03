import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()
  if(!session){
    return (
      <div className="bg-blue-900 flex  w-screen h-screen items-center" >
      <div className="text-center w-full">

      <button onClick={()=>signIn('google')} className="bg-white p-2 rounded-lg px-4 text-black">Login with Google</button>
      </div>
    </div>
    
    );
  }
  return (
    <div>Logged in {session.user.email}</div>
  
  );
}
