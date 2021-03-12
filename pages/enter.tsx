import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import { UserContext } from '../lib/context'

import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';

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
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username } = useContext(UserContext)

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const onChange = e => {
        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

        if (val.length < 3) {
            setFormValue(val)
            setLoading(false)
            setIsValid(false)
        }

        if (re.test(val)) {
            setFormValue(val)
            setLoading(true)
            setIsValid(false)
        }

    }

    const checkUsername = useCallback (
        debounce(async username => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`)
                const { exists } = await ref.get()
                console.log("Firestor read executed!")
                setIsValid(!exists)
                setLoading(false)
            }
        }, 500), []) 
    
    const onSubmit = async e => {
        e.preventDefault()

        const userDoc = firestore.doc(`users/${user.uid}`)
        const usernameDoc = firestore.doc(`usernames/${formValue}`)

        const batch = firestore.batch()
        batch.set(userDoc, {
            username: formValue,
            photoURL: user.photoURL,
            displayName: user.displayName
        })
        batch.set(usernameDoc, { 
            uid: user.uid
        });

        await batch.commit()
    }

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input type="text" name="username" placeholder="username" value={formValue} onChange={onChange} />

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    )
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>
    } else if(isValid) {
        return <p className="text-success">{username} is valid</p>
    } else if(username && !isValid) {
        return <p className="text-danger">This username is taken!</p>
    } else {
        return <p></p>
    }
}