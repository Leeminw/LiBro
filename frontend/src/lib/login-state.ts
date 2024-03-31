import { create } from "zustand";
import { persist, PersistStorage, createJSONStorage } from "zustand/middleware";
import { LoginApi } from "./axios-login";

interface UserInfoType {
  id: number;
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
  getAccessToken: () => string | null;
}

const defaultState: UserInfoType = {
  id: 0,
  email: "",
  name: "",
  profile: "",
  nickname: "",
};

const storage = createJSONStorage(() => localStorage) as PersistStorage<UserState>;

const useUserState = create(
  persist<UserState>(
    (set, get) => ({
      userInfo:
        typeof window !== "undefined" && !!localStorage.getItem("accessToken")
          ? {
              id: localStorage.getItem("id")
                ? parseInt(localStorage.getItem("id")!, 10)
                : defaultState.id,
              email: localStorage.getItem("email") || defaultState.email,
              name: localStorage.getItem("name") || defaultState.name,
              profile: localStorage.getItem("profile") || defaultState.profile,
              nickname: localStorage.getItem("nickname") || defaultState.nickname,
            }
          : defaultState,
      isLogin: typeof window !== "undefined" ? !!localStorage.getItem("accessToken") : false,
      getUserInfo: () => {
        return get().userInfo;
      },
      setUserInfo: (userInfo: UserInfoType) => {
        set({ userInfo });
      },
      deleteUserInfo: () => {
        LoginApi.logoutUser();
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        localStorage.removeItem("profile");
        localStorage.removeItem("nickname");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ userInfo: defaultState });
      },
      getAccessToken: () => {
        return localStorage.getItem("accessToken");
      },
    }),
    {
      name: "userInfoStorage",
      storage,
    }
  )
);

export default useUserState;
