export interface FireteamMember {
    membershipId: string;
    emblemHash: number;
    displayName: string;
    status: number;
    membershipType: number;
}

export interface FireteamRoster {
    loaded: boolean;
    queriedUser: string;
    users: FireteamMember[];
}

export interface CharacterResponse {
    membershipId: string;
    membershipType: number;
    characterId: string;
    dateLastPlayed: string;
    minutesPlayedThisSession: string;
    minutesPlayedTotal: string;
    light: number;
    stats: object;
    raceHash: number;
    genderHash: number;
    classHash: number;
    raceType: number;
    classType: number;
    genderType: number;
    emblemPath: string;
    emblemBackgroundPath: string;
    emblemHash: number;
    emblemColor: {
        red: number;
        green: number;
        blue: number;
        alpha: number;
    };
    levelProgression: object;
    baseCharacterLevel: number;
    percentToNextLevel: number;
}

export interface Character {
    loaded: boolean;
    light: number;
    classType: string;
    items: Item[];
}

export interface Item {
    name: string;
    imageURL: string;
    light: string | undefined;
    type: string;
}

export interface ItemResponse {
    itemHash: number;
    itemInstanceId: string;
    quantity: number;
    bindStatus: number;
    location: number;
    bucketHash: number;
    transferStatus: number;
    lockable: boolean;
    state: number;
    dismantlePermission: number;
    isWrapper: boolean;
}

export interface UserResponse {
    iconPath: string;
    crossSaveOverride: number;
    isPublic: boolean;
    membershipType: number;
    membershipId: string;
    displayName: string;
}
