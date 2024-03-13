'use client'

import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate(); // useNavigate 훅을 사용
  
    return (
      <div className="flex items-center p-3">
        <button onClick={() => navigate(-1)} style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
            <img src="/back.svg" alt="Back" width={24} height={24} />
        </button>
        <h1 className="ml-3 text-lg font-bold">회원가입</h1>
      </div>
    );
};

const Signup = () => {
  return (
    <>
      <Header />
      {/* 회원가입 로직 */}
    </>
  );
};

export default Signup;