import { Search, MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommunityInformCard from "@/components/components/board/communityCard";
import BoardList from "@/components/components/board/boardList";
import {dehydrate, HydrationBoundary, QueryClient, useQueryClient} from "@tanstack/react-query";
import {getCategoryList} from "@/lib/club";

export default function CommunityPostPage({params}: {params: { id: number};}) {

    const queryClient = new QueryClient();

    queryClient.prefetchQuery({
            queryKey: ['clubCategory', params.id],
            queryFn: () => getCategoryList(params.id)
        }
    )

    const dehydratedState = dehydrate(queryClient);

    return (
        <>

            <div className="pt-12">
                <CommunityInformCard clubName={"을왕리"} registeredTime={"2024-12-12"} memberType={"MEMBER"} memberCount={3}/>
            </div>

            <HydrationBoundary state={dehydratedState}>
                <BoardList />
            </HydrationBoundary>

            <div className="mb-4"></div>

            <div className="sticky bottom-24 right-4 flex justify-end">
                <Button className="rounded-full h-16 w-16 text-white">
                    <MessageCircleIcon className="h-12 w-12"/>
                </Button>
            </div>
        </>
    );
}
