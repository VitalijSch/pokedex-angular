export interface Pokemon {
    id: number;
    name: string;
    img: string;
    types: {
        firstType: string;
        secondType: string;
    };
    crie: string;
    stats: Array<{
        name: string;
        stat: number;
    }>;
    evolution: string;
    evolutionFrom: string;
}
