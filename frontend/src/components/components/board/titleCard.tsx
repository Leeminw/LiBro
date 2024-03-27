import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarIcon} from "lucide-react";
import {dateView} from "@/lib/dayjs";


export default function TitleCard(props : Title) {
    const { title, createdDate } = props

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 justify-between">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent >
                <div className="flex items-center align-top">
                    <div className="flex items-center gap-2 justify-between">
                        <CalendarIcon className="w-5 h-5"/>
                        <div className="font-bold">{dateView(createdDate)}</div>
                    </div>
                </div>
            </CardContent>

        </Card>
    );
}
