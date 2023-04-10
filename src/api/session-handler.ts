import { Auth, browserSessionPersistence, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { DbConnector } from "./db-connector";
import { FirebaseApp } from "firebase/app";
import { log } from "console";

export interface LoginCredentials {
    email: string;
    password: string;
}

export class SessionHandler {

    auth: Auth
    dbConnector: DbConnector

    constructor(firebaseApp: FirebaseApp, dbConnector: DbConnector) {
        this.auth = getAuth(firebaseApp)
        this.auth.setPersistence(browserSessionPersistence)
        this.dbConnector = dbConnector
    }

    async login(credentials: LoginCredentials): Promise<any> {
        const { email, password } = credentials;
        return signInWithEmailAndPassword(this.auth, email, password)
            .then(async (userCredential) => {
                const user = await this.dbConnector.getUser(userCredential.user.uid)
                if (!user) {
                    this.logout()
                    throw new Error('User not found')
                }
                this.dbConnector.setTenant(user.tenantId)
                return user
            })
            .catch((error) => {
                // show toasts with specific errors
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

    async logout() {
        return signOut(this.auth)
            .then(() => this.dbConnector.setTenant(null))
    }

}



