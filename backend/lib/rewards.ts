import { Entries } from 'type-fest';
import random from "random";

import { AllItems, AllItemsType } from './items';

export const getMaxExp = (level: number) => {
    return level * 20;
}

type RewardTypes = 'exp' | 'currency' | 'none';
type Brackets = Record<Exclude<RewardTypes, 'none'>, {min: number, max: number}>;

export const randomReward = (streak: number, combo: number): {type: RewardTypes, value: number} => {
    const chances: Record<Exclude<RewardTypes, 'none'>, number> = {
        'exp': 0.5,
        'currency': 0.3
    };

    const brackets: Brackets = {
        'exp': {
            min: 2,
            max: Math.max(3 + Math.round(Math.log(streak * 3) + Math.log(combo)), 3)
        },
        'currency': {
            min: 30,
            max: 50 + Math.max(Math.round(Math.log(streak * 3) + Math.log(combo)), 0)
        }
    };

    const r = Math.random();
    let cumulativeChance = 0;
    
    for (const [type, chance] of Object.entries(chances) as Entries<typeof chances>) {
        cumulativeChance += chance;
        if (r < cumulativeChance) {
            const min = brackets[type].min;
            const max = brackets[type].max;
    
            return {
                type: type,
                value: Math.floor(Math.random() * (max - min + 1)) + min
            }
        }
    }

    return {
        type: 'none',
        value: 0
    }
}

export const getChances = (streak: number, combo: number, items: AllItemsType): {5: number, 4: number} => {
    const luck = (items['Rubber Duck'].special?.level ?? 0) * 0.0005;

    return {
        5: 0.01 + Math.log(streak + 1) * 0.002 + Math.log(combo + 1) * 0.001 + luck,
        4: 0.1 + Math.log(streak + 1) * 0.005 + Math.log(combo + 1) * 0.002 + luck
    }
};

export const randomSprint = (streak: number, combo: number, items: AllItemsType, pity4: number, pity5: number, sprints: number): keyof typeof AllItems => {
    const chances = getChances(streak, combo, items);

    const getWithStars = (stars: number) => {
        return (Object.entries(AllItems) as Entries<typeof AllItems>).filter(([name, item]) => item.stars === stars).map(([name, item]) => name);
    };

    const possibleItems = {
        5: getWithStars(5),
        4: getWithStars(4),
        3: getWithStars(3)
    };

    const r = random.uniform(0, 1)();

    /* todo: rework chances, add pity */
    switch (true) {
        case r < chances[5] || pity5 === 79:
            {
                const item = random.choice(possibleItems[5]);
                if (item)
                    return item;
            }
        case r < chances[4] + chances[5] || pity4 === 9 || sprints === 0 /* first sprint */:
            {
                const item = random.choice(possibleItems[4]);
                if (item)
                    return item;
            }
        default:
            {
                const item = random.choice(possibleItems[3]);
                if (item)
                    return item;
            }
    }

    console.error("Sprint hit fallback");
    return "Cookie"; /* fallback */
};
