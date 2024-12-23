// app/group/join/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const GroupJoinPage = () => {
  const params = useParams();
  const id = params.id;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const checkLoginStatus = async () => {
      try {
        // 앱 스킴을 통해 앱으로 이동
        // 로그인되어 있지 않으면 로그인 페이지로, 되어있으면 그룹 참여 페이지로
        const appScheme = `rippletrip://group/join/${id}`;

        window.location.href = appScheme;

        // 앱으로 이동하지 않은 경우를 위한 타임아웃 처리
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">앱으로 이동 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          앱에서 계속하기
        </h1>
        <p className="text-gray-600 mb-8">
          앱이 실행되지 않는다면 아래 버튼을 눌러주세요.
        </p>
        <button
          onClick={() => {
            const appScheme = `yourapp://auth/login?redirect=group/join/${id}`;
            window.location.href = appScheme;
          }}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          앱으로 이동하기
        </button>
      </div>
    </div>
  );
};

export default GroupJoinPage;
