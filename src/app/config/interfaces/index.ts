export interface Emoji {
    nameType: string;
    valueType: string;
    emojis: EmojiStructure[]
}

export interface EmojiStructure {
    name: string;
    value: string;
}
