import IUser from "./user.type";

export default interface IUserData {
    user: IUser,
    token? : string | null
}