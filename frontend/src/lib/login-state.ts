import { create } from "zustand";

interface LoginState {
  isLogin: boolean;
}

const useLoginState = create<LoginState>((set) => ({
  isLogin: false,
}));


export default useLoginState;
