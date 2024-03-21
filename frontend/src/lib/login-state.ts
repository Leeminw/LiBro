import { create } from "zustand";

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

const useUserState = create<UserState>((set, get) => ({
  userInfo: defaultState,
  isLogin: false,
  getUserInfo: () => {
    return get().userInfo;
  },
  setUserInfo: (userInfo: UserInfoType) => {
    set({ userInfo, isLogin:true });
  },
  deleteUserInfo: () => {
    set({ userInfo: defaultState, isLogin: false });
  },
}));

export default useUserState;
