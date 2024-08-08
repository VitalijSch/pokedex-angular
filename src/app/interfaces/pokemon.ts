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
    eggGroups: string[];
    eggSteps: number;
    stats: any[];
    evolutions: any[];
}
