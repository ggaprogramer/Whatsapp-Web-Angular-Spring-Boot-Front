export interface Emoji {
    nameType: string;
    valueType: string;
    emojis: EmojiStructure[]
}

export interface EmojiStructure {
    name: string;
    value: string;
}

export interface StatusResponse {
    status: string;
    message: string;
    type: string;
}

export type TypeMessage = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';

export interface StatusMessage {
    message: string, 
    status: TypeMessage,
    disabled: boolean,
    duration: number,
}

