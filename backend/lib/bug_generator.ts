import random from "random";
import { Bug } from "./db";
import { templates } from "./templates";

const PossibleLanguages = (Object.keys(templates) as Array<keyof typeof templates>) satisfies Array<Bug["language"]>;
type PossibleLanguagesUnion = typeof PossibleLanguages[number];

const makeTypo = (str: string): string => {
    if (str.length === 0) {
        return str;
    }
    
    const randomIndex = Math.floor(Math.random() * str.length);
    const randomLetter = random.choice("abcedfghijklmnoprstuvxyz".replace(str[randomIndex], '').split(''));
    
    return str.substring(0, randomIndex) + randomLetter + str.substring(randomIndex + 1);
};

const messUpCode = (code: string, language: PossibleLanguagesUnion): {code: string, hint: string, explanation: string, line: number} => {
    type TypesOfError = "typo" | "vanish" | "rand_num" | "rand_op" | "rand_type";

    const hints: Record<TypesOfError, string> = {
        "typo": "Look for typos ;)",
        "vanish": "Is something missing?",
        "rand_num": "Pay attention to the numbers...",
        "rand_op": "Pay attention to the operators...",
        "rand_type": "Are the types okay?"
    };

    const explanations: Record<TypesOfError, string> = {
        "typo": "It should be '<HERE>' 😅",
        "vanish": "Missing '<HERE>'",
        "rand_num": "Wrong number, <HERE> would work 😌",
        "rand_op": "Should've used '<HERE>'",
        "rand_type": "Wrong type, should be <HERE> 😮"
    };

    const types: Record<PossibleLanguagesUnion, string[]> = {
        "javascript": [],
        "typescript": ["number", "string", "number[]", "string[]", "Record<string, number>", "never", "void"],
        "c": ["int**", "float*", "double", "void***", "int", "const char*"],
        "cpp": ["std::vector<std::string*>", "std::string**", "std::unique_ptr<void*>", "int", "float", "const char*"],
        "ocaml": ["double list", "int list list", "(float * int)", "(float * float)"],
        "java": ["HashMap", "ArrayList", "String", "int", "double"]
    };

    /******* */

    const regex = /\$(.*?):(.*?)\$/g;
    const expressions: {s: string, index: number}[] = [];

    let match;
    while ((match = regex.exec(code)) != null) {
        expressions.push({s: match[0], index: match.index});
    }

    const count = expressions.length;
    const toChange = random.int(0, count-1);

    const lineNumber = code.substring(0, expressions[toChange].index).split('\n').length; // starts at 1

    let counter = 0;
    let errorType: TypesOfError | null = null;
    let validText: string | null = null;

    const newTargetText = code.replace(regex, (match, $1: TypesOfError, $2: string) => {
        // console.log(match, $1, $2, counter);

        if (counter === toChange) {
            counter++;
            errorType = $1;
            validText = $2.trim();

            switch ($1) {
                case "vanish":
                    return "";
                case "rand_num":
                    const r = random.int(0, 100);
                    return (r !== parseInt($2.trim()) ? r : 392381349).toString();
                case "rand_op":
                    return random.choice(["*", "/", "-", "+"].filter((v) => v !== $2.trim())) ?? "#";
                case "rand_type":
                    return random.choice(types[language].filter((v) => v !== $2.trim())) ?? "hmmm";
                case "typo":
                default:
                    return makeTypo($2);
            }
        }
        else {
            counter++;
            return $2;
        }
    });

    if (!errorType) {
        throw "Critical error: no generated bug error type";
    }

    const generateExplanation = () => {
        if (!errorType || !validText)
            throw "Critial error: no error type or valid text";

        return explanations[errorType]
            .replace("<HERE>", validText);
    }

    return {
        code: newTargetText,
        hint: hints[errorType],
        explanation: generateExplanation(),
        line: lineNumber
    };
};

export const generateBug: (() => Bug) = () => {
    /* Procedurally generated Bug */
    const language = random.choice(PossibleLanguages)!;

    const {code, hint, explanation, line} = messUpCode(random.choice(templates[language])!, language);

    return {
        id: 0,
        language: language,
        answer: line,
        difficulty: 1,
        explanation: explanation,
        hint: hint,
        body: code,
        created_at: (new Date()).toISOString(),
        production: true
    };
};
