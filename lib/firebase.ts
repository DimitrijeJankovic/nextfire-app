import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBliVMc714TeBwrbrAlnBQAjoMsRZd5hKk",
    authDomain: "nextfire-app-87fab.firebaseapp.com",
    projectId: "nextfire-app-87fab",
    storageBucket: "nextfire-app-87fab.appspot.com",
    messagingSenderId: "64326962335",
    appId: "1:64326962335:web:bad31c0a3117346c86e6aa"
}

if (!firebase.apps.length)
    firebase.initializeApp(firebaseConfig)


export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore()
export const storage = firebase.storage()

/**
 * Get a user/{uid} document with username
 * @param {string} username 
 */

export async function getUserWithUsername(username: string) {
    const userRef = firestore.collection('users')
    const query = userRef.where('username', '==', username).limit(1)
    const userDoc = (await query.get()).docs[0]
    return userDoc
}

/**
 * Convert a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
 export function postToJSON(doc: any) {
    const data = doc.data()
    return {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    }
}

export function fromMillis(time) {

}
