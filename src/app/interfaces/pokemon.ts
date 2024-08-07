export interface Pokemon {
    id: number;
    name: string;
    img: string;
    types: {
        firstType: string;
        secondType: string;
    };
    crie: string;
    genera: string;
    height: string;
    weight: string;
    eggGroups: Array<string>;
    eggSteps: number;
    stats: Array<{
        name: string;
        stat: number;
    }>;
    evolution: string;
    evolutionFrom: string;
}
