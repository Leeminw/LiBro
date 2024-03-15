import React from 'react';
import {Card, CardContent,} from '@/components/ui/card'; // your-component-library에 실제로 사용하는 라이브러리 명을 입력해야 합니다.
import {CalendarIcon} from "lucide-react"
import {Button} from '@/components/ui/button';

// 클럽 정보를 담은 객체의 타입 정의
interface ClubListProps {
    clubs: CommunityItemInform[];
}

const ClubList: React.FC<ClubListProps> = ({clubs}) => {
    const handleJoinClub = (clubName: string) => {
        // 가입하기 버튼 클릭 시 수행할 작업을 여기에 추가합니다.
        alert(`클럽 ${clubName}에 가입되었습니다!`);
        // 클럽 ID를 사용하거나 다른 작업을 수행할 수 있습니다.
    };

    return (
        <div>
            {clubs.map((club) => (
                <Card key={club.clubId} className="pt-6 bg-white rounded-lg shadow-md mt-2 mb-2">
                    <CardContent>
                        <div className="text-lg font-bold">{club.clubName}</div>
                        <div className="flex items-center space-x-2 mb-4">
                            <CalendarIcon className="w-4 h-4 text-gray-500"/>
                            <span className="text-sm text-gray-500">{club.registeredTime}</span>
                        </div>
                        <div className="flex justify-between">
                            {club.clubOwner}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ClubList;
