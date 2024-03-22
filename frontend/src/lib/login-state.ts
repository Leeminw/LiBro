import { create } from "zustand";
import { persist, PersistStorage, createJSONStorage } from "zustand/middleware";

interface UserInfoType {
  email: string;
  name: string;
  profile: string;
  nickname: string;
}

interface UserState {
  userInfo: UserInfoType;
  getUserInfo: () => UserInfoType;
  setUserInfo: (userInfo: UserInfoType) => void;
  deleteUserInfo: () => void;
  isLogin: boolean;
}

const defaultState: UserInfoType = {
  email: "",
  name: "",
  profile: "",
  nickname: "",
};

const storage = createJSONStorage(
  () => localStorage
) as PersistStorage<UserState>;

const useUserState = create(
  persist<UserState>(
    (set, get) => ({
      userInfo: defaultState,
      isLogin:
        typeof window !== "undefined"
          ? !!localStorage.getItem("accessToken")
          : false,
      getUserInfo: () => {
        return get().userInfo;
      },
      setUserInfo: (userInfo: UserInfoType) => {
        set({ userInfo });
      },
      deleteUserInfo: () => {
        localStorage.removeItem("id");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ userInfo: defaultState });
      },
    }),
    {
      name: "userInfoStorage",
      storage,
    }
  )
);

export default useUserState;
