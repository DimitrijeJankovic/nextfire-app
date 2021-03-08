import { auth, googleAuthProvider } from '../lib/firebase'
import { useContext } from 'react'
import { UserContext } from '../lib/context'

export default function EnterPage({ }) {
    
    const { user, username } = useContext(UserContext)

    // 1. user singed out <SingInButton /> 
    // 2. user singed in, but missing username <UsernameForm />
    // 3. user singed in, has username <SingOutButton />
    return (
        <main>
            {user ?
                !username ? <UsernameForm /> : <SingOutButton />
                : 
                <SingInButton />
            }
        </main>
    )
}

function SingInButton() {

    const singInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider)
    }

    return (
        <button className="btn-google" onClick={singInWithGoogle}>
            <img src={'/google.png'} alt="google image"/> Sing in with Google
        </button>
    )
}

function SingOutButton() {
    return <button onClick={() => auth.signOut()}>Sing Out</button>
}

function UsernameForm() {
    return <div></div>
}