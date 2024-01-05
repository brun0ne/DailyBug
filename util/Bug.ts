export type Language = "javascript" |
                       "typescript";

export interface Bug {
    id: number;
    language: Language;
    hint: string;
    answer: number;
    body: string;
}
