export type buttonsActionsAlterComponents = 'CONVERSATIONS' | 'ALTER_PROFILE' | 'CONFIGURATION' | 'NEW_CONTACTS' | 'MY_CONTACTS';

export interface FriendShipRequest {
    username: string;
}

export interface FriendShipResponse {
    status: string;
    message: string;
    type: string;
}

export interface ProfileFormatted {
    name: string;
    username: string;
    email: string;
    description: string;
    phone: string;
    linkPhoto: string;
    situationFriendship: string;
}