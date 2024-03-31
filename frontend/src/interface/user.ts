interface UserProfile {
    profile: string;
    name: string;
    userId: number;
    createdDate: string;
    role: String;
}

interface FileUploadResponse {
    uploadedFileName: string,
    originalFileName: string,
}

interface UserProfileEdit {
    profile: string;
    nickName: string;
}
