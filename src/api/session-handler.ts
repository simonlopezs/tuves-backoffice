import { Auth, getAuth, setPersistence, signInWithEmailAndPassword, signOut, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { DbConnector } from "./db-connector";
import { FirebaseApp } from "firebase/app";
import { log } from "console";
import { User } from "../models";

export interface LoginCredentials {
    email: string;
    password: string;
}

export class SessionHandler {

    auth: Auth
    dbConnector: DbConnector

    constructor(firebaseApp: FirebaseApp, dbConnector: DbConnector) {
        this.auth = getAuth(firebaseApp)
        setPersistence(this.auth, browserLocalPersistence)
        this.dbConnector = dbConnector
    }

    async login(credentials: LoginCredentials): Promise<any> {
        const { email, password } = credentials;
        return signInWithEmailAndPassword(this.auth, email, password)
            .then(async ({ user: { uid } }) => this.getUserData(uid))
            .catch((error) => {
                // show toasts with specific errors
                console.log(error)
            });
    }

    private async getUserData(uid: string) {
        return this.dbConnector.getUser(uid)
            .then((user) => {
                if (user) {
                    this.dbConnector.setTenant(user.tenantId)
                    return user
                } else {
                    return this.logout().then(() => null)
                }
            })
    }

    async logout() {
        return signOut(this.auth)
            .then(() => this.dbConnector.setTenant(null))
    }

    subscribeToSessionState(fn: (user: User | null) => void) {
        return onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                const userData = await this.getUserData(user.uid)
                fn(userData)
            } else {
                fn(null)
            }
        })
    }

}



