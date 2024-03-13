'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 

const Header = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
      <div className="flex items-center p-3">
        <button onClick={handleBack} style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
            <img src="/back.svg" alt="Back" width={24} height={24} />
        </button>
        <h1 className="ml-3 text-lg font-bold">회원가입</h1>
      </div>
    );
};

const EmailAuth = () => {
    const [stage, setStage] = useState(1);
    const [email, setEmail] = useState('');
    const [timeLeft, setTimeLeft] = useState(180); // 타이머 초기값을 180초 (3분)으로 설정

    useEffect(() => {
        if (timeLeft > 0) {
            // 매 초마다 timeLeft를 감소시키는 로직
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            // timeLeft가 0이 되면 stage를 1로 설정
            setStage(1);
        }
    }, [timeLeft]);

    const handleResend = () => {
        // 코드 재전송 로직 추가 필요
        console.log('코드 재전송');
    };

    return (
        <div className={`flex flex-col p-4 min-h-screen transition-all duration-500`}>
            {stage === 1 && (
                <div>
                    <h1 className="text-lg font-bold mb-6">이메일을 입력해주세요.</h1>
                    <input 
                      className="mb-4 px-4 py-2 border rounded w-full" 
                      placeholder="이메일" 
                      type="email" 
                      value={email} // 입력값을 email 상태와 연결
                      onChange={(e) => setEmail(e.target.value)} // 입력값 변경시 email 상태 업데이트
                    />
                    <button 
                      className="mb-6 bg-[#9268EB] text-white px-6 py-2 rounded w-full" 
                      onClick={() => {setStage(2); setTimeLeft(180);}}>다음</button>
                </div>
            )}
            {stage === 2 && (
                <div className={`flex flex-col transition-all duration-500 delay-500 ${stage === 2 ? 'opacity-100' : 'opacity-0'}`}>
                    <h1 className="text-lg font-semibold mb-6">이메일 인증코드를 입력해주세요.</h1>
                    {/* 이메일 값 표시 */}
                    <div className="flex w-full mb-6">
                        <input 
                        className=" px-4 py-2 border rounded w-full" 
                        placeholder="이메일을 다시 입력하세요." 
                        value={email}
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        <button 
                          className="px-4 py-2 bg-[#9268EB] text-white border-t border-b border-r rounded-r w-44 text-center"
                          onClick={handleResend}>
                            코드 재전송
                        </button>
                    </div>
                    <div className="flex w-full mb-6">
                        <input 
                          className="flex-1 px-4 py-2 border rounded-l" 
                          placeholder="인증번호를 입력해주세요." 
                          type="text" 
                        />
                        <span 
                            className={`flex justify-center items-center bg-gray-200 px-4 py-2 border-t border-b border-r rounded-r ${timeLeft <= 5 ? 'text-red-500' : 'text-gray-700'}`} 
                            style={{width: '60px'}}>
                            {timeLeft > 0 ? `${Math.floor(timeLeft / 60)}:${('0' + timeLeft % 60).slice(-2)}` : ''}
                        </span>
                    </div>
                    <button className="mb-6 bg-[#9268EB] text-white px-6 py-2 rounded w-full">확인</button>
                </div>
            )}
        </div>
    );
};

const Signup = () => {
  return (
    <>
      <Header />
      <EmailAuth />
    </>
  );
};

export default Signup;