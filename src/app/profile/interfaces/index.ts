export interface AlterInfoProfileRequest {
    base64File: string | null;
    mimeType: string | null;
    name: string;
    username: string;
    description: string;
    phone: string;
}

export interface AlterInfoProfileResponse {
    status: string;
    message: string;
    type: string;
    name: string;
    username: string;
    email: string;
    confirmedEmail: boolean;
    description: string;
    phone: string;
    linkPhoto: string;
}