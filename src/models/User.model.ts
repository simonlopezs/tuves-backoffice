import { IBase } from "./Base.model"

export interface IUser extends IBase {
    name: string
    email: string
    tenantId: string
}