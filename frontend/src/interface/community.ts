interface ClubInform {
    clubId: number;
    clubName: string;
    createdDate: string;
    memberType?: string;
    memberCount ?: number
}

interface ClubItemInform {
    clubName: string;
    createdDate: string;
    clubOwnerName: string;
    clubId: number;
    isAdmin?: boolean | null | undefined;
}

interface ClubSearch {
    sortOrder?: string;
    keyword?: string;
    clubId?: number | null;
}

interface ClubWrite {
    name: string,
    description: string;
    userId: number;
}


interface ClubJoin {
    userId: number;
}



