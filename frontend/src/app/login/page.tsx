// export default function LogIn() {
//     return (
//         <>
//             <div>11</div>
//         </>
//     )
// }
'use client'

// SocialLoginButtons.js
import React from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const Logo = () => {
    return (
      <div className="w-full flex flex-col justify-center items-center" style={{ height: '300px' }}> 
        <div className="flex flex-col justify-center items-center space-y-2 text-sm"> 
          <span className="font-bold">내게 맞는 책을 만나다.</span>
          <span className="font-bold">맞춤형 도서 추천, 관리 앱</span>
        </div>
        {/* Tailwind CSS를 사용한 텍스트 크기 조정 */}
        <span className="text-4xl font-bold mt-3">LiBro</span> 
      </div>
    );
};

const GoogleLoginButton = () => {
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => console.log(tokenResponse),
        onError: () => console.log('오류 발생'),
    });

    return (
        <button
            onClick={() => login()}
            className="bg-white text-black font-bold py-2 px-4 rounded flex items-center m-2"
            style={{ width: '70%', height: '7%', border: '1px solid #D9D9D9' }} // 버튼의 크기를 고정값으로 설정
        >
            <div className="flex items-center border-r-2 border-gray-300 pr-3" style={{ height: '40px' }}> {/* Tailwind CSS로 오른쪽 경계선 및 패딩 추가 */}
                <img src="/google.svg" alt="Google" className="w-7 h-7 transform scale-130" /> {/* Tailwind CSS로 크기 및 스케일 조정 */}
            </div>
            <span className="flex-1 text-center">구글 로그인</span>
        </button>
    );
};

const NaverLoginButton = () => {
    const handleLogin = () => {
        // 네이버 로그인 처리 로직
    };

    return (
        <button onClick={handleLogin} 
            className="bg-[#03C75A] text-white font-bold py-2 px-4 rounded flex items-center m-2"
            style={{ width: '70%', height: '7%', backgroundColor: '#03C75A' }} // 배경색 및 버튼 크기 수정
        >
            <div className="flex items-center border-r-2 border-white-300 pr-3" style={{ height: '40px' }}> {/* Tailwind CSS로 오른쪽 경계선 및 패딩 추가 */}
                <img src="/naver.svg" alt="Naver" className="w-7 h-7 transform scale-130" /> {/* Tailwind CSS로 크기 및 스케일 조정 */}
            </div>
            <span className="flex-1 text-center">네이버 로그인</span>
        </button>
    );
};

const KakaoLoginButton = () => {
    const handleLogin = () => {
        // 카카오 로그인 처리 로직
    };

    return (
        <button onClick={handleLogin} 
            className="text-black font-bold py-2 px-4 rounded flex items-center m-2"
            style={{ width: '70%', height: '7%', backgroundColor: '#FDE500' }} // 배경색 및 버튼 크기 수정
        >
            <div className="flex items-center border-r-2 border-white-300 pr-3" style={{ height: '40px' }}> {/* Tailwind CSS로 오른쪽 경계선 및 패딩 추가 */}
                <img src="/kakao.svg" alt="Kakao" className="w-7 h-7 transform scale-130" /> {/* Tailwind CSS로 크기 및 스케일 조정 */}
            </div>
            <span className="flex-1 text-center">카카오 로그인</span>
        </button>
    );
};

const SocialLoginButtons = () => {
    return (
        <div>
          <Logo />
          
          <div className="flex justify-center items-center h-50 flex-col">
            <div className='mb-3 font-bold text-sm'>소셜 로그인으로 간편하게 가입하세요!</div>
            <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
              <GoogleLoginButton />
            </GoogleOAuthProvider>
            <NaverLoginButton />
            <KakaoLoginButton />
            <div className="flex text-xs font-bold mt-4">LiBro 아이디가 없으신가요? ⟶
              <div className="text-[#9268EB]">&nbsp;회원가입</div>
            </div>
          </div>
        </div>
        
    );
};

export default SocialLoginButtons;
