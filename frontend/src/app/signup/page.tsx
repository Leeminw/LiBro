'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Header = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
      <div className="flex items-center p-3">
        <Button onClick={handleBack} style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
            <img src="/back.svg" alt="Back" width={24} height={24} />
        </Button>
        <h1 className="ml-3 text-lg font-bold">회원가입</h1>
      </div>
    );
};

const EmailAuth = () => {
    const [stage, setStage] = useState(1);
    const [email, setEmail] = useState('');
    const [headerText, setHeaderText] = useState('이메일을 입력해주세요.'); // 상태 추가
    const [timeLeft, setTimeLeft] = useState(180); // 타이머 초기값을 180초 (3분)으로 설정
    const router = useRouter(); // useRouter 훅 사용

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

    useEffect(() => {
        // stage가 변경될 때마다 헤더 텍스트 업데이트
        if (stage === 1) {
          setHeaderText('이메일을 입력해주세요.');
        } else if (stage === 2) {
          setHeaderText('이메일 인증코드를 입력해주세요.');
        }
      }, [stage]);

    const handleResend = () => {
        // 코드 재전송 로직 추가 필요
        console.log('코드 재전송');
    };

    const handleConfirm = () => {
        // 확인 버튼 클릭 시 /addinfo 페이지로 이동
        router.push('/addinfo');
    };

    return (
        <div className={`flex flex-col p-4 min-h-screen transition-all duration-500`}>
            {stage === 1 && (
                <div>
                    <h1 className="text-lg font-bold mb-6">{headerText}</h1>
                    <Input 
                      style={{ borderColor: '#9268EB' }}
                      className="mb-4 px-4 py-2 border w-full" 
                      placeholder="이메일" 
                      type="email" 
                      value={email} // 입력값을 email 상태와 연결
                      onChange={(e) => setEmail(e.target.value)} // 입력값 변경시 email 상태 업데이트
                    />
                    <Button 
                      className="mb-6 bg-[#9268EB] text-white px-6 py-2 rounded w-full" 
                      onClick={() => {setStage(2); setTimeLeft(180);}}>다음</Button>
                </div>
            )}
            {stage === 2 && (
                <div className={`flex flex-col transition-all duration-500 delay-500 ${stage === 2 ? 'opacity-100' : 'opacity-0'}`}>
                    <h1 className="text-lg font-semibold mb-6">{headerText}</h1>
                    {/* 이메일 값 표시 */}
                    <div className="flex w-full mb-6">
                        <Input 
                        style={{ borderColor: '#9268EB' }}
                        className=" px-4 py-2 border w-full rounded-r-none" 
                        placeholder="이메일을 다시 입력하세요." 
                        value={email}
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setHeaderText('이메일을 입력해주세요.')} // onFocus 이벤트 추가
                        />
                        <Button 
                          className="px-4 py-2 bg-[#9268EB] text-white rounded-r rounded-l-none w-24 text-center"
                          onClick={handleResend}>
                            코드 재전송
                        </Button>
                    </div>
                    <div className="flex w-full mb-6">
                        <Input 
                          style={{ borderColor: '#9268EB' }}
                          className="flex-1 px-4 py-2 border rounded-r-none" 
                          placeholder="인증코드를 입력해주세요." 
                          type="text" 
                          onFocus={() => setHeaderText('이메일 인증코드를 입력해주세요.')} // onFocus 이벤트 추가
                        />
                        <span 
                            className={`flex justify-center items-center bg-[#9268EB] px-4 py-2 rounded-r ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`} 
                            style={{width: '60px'}}>
                            {timeLeft > 0 ? `${Math.floor(timeLeft / 60)}:${('0' + timeLeft % 60).slice(-2)}` : ''}
                        </span>
                    </div>
                    <Button className="mb-6 bg-[#9268EB] text-white px-6 py-2 rounded w-full"
                        onClick={handleConfirm}
                    >확인</Button>
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