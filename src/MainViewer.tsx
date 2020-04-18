/* eslint-disable react-hooks/exhaustive-deps */
// tslint:disable: max-line-length
import React, { useEffect, useState} from 'react';
import {
    Link,
    useParams,
} from 'react-router-dom';

import { Character, CharacterResponse, FireteamMember, FireteamRoster, Item, ItemResponse, UserResponse } from './Interfaces';
import './MainViewer.css';
import refresh from './refresh.svg';
import { armourBuckets, Background, destinyClass, membershipType, weaponBuckets} from './Util';

function MainViewer(props: {platform: string}) {
    let { username } = useParams();
    if (username === undefined) {
        username = '';
    }

    const [roster, setRoster] = useState<FireteamRoster>({loaded: false, queriedUser: username,
                                                          users: []});
    const [error, setError] = useState<string | undefined>(undefined);
    return (
        <div>
            <nav>
                <ul id='horizontal-nav'>
                    <li><a href='https://lkellar.org'>lkellar.org</a></li>
                    <li id='changeUser'><Link to='/'>Change User</Link></li>
                    <li><img src={refresh} onClick={() => {window.location.reload(false); }} alt='Refresh Icon'/></li>
                </ul>
                {error !== undefined &&
                    <main>
                        <h1>{error}</h1>
                    </main>
                }
                {(error === undefined && !roster.loaded) &&
                    <InitLoadingScreen username={username} platform={props.platform} roster={roster} setRoster={setRoster} setError={setError}/>
                }
                {(error === undefined && roster.loaded) &&
                    <main className='itemViewerContainer'>
                        {roster.users.map((x) => {
                            return <ItemViewer platform={props.platform} key={x.membershipId} user={x} />;
                        })}
                </main>
                }
            </nav>
            <Background />
        </div>
    );
}

function ItemViewer(props: {user: FireteamMember, platform: string}) {
    const [character, setCharacter] = useState<Character>({loaded: false, light: 0, classType: '', items: []});
    useEffect(() => {
        async function fetchData() {
            const controller = new AbortController();
            try {
                const headers: any = {
                    'X-API-Key': process.env.REACT_APP_BUNGIE_API_KEY,
                };
                let membership: string;
                if (props.user.membershipType) {
                    membership = props.user.membershipType.toString();
                } else {
                    membership = membershipType[props.platform];
                }
                let results: any = await fetch(`https://www.bungie.net/Platform/Destiny2/${membership}/Profile/${props.user.membershipId}/?components=200`, {
                    headers,
                    method: 'GET',
                });
                results = await results.json();
                if (results['ErrorCode'] === 18) {
                    membership = membershipType[results['MessageData']['membershipInfo.membershipType']];
                    results = await fetch(`https://www.bungie.net/Platform/Destiny2/${membership}/Profile/${props.user.membershipId}/?components=200`, {
                        headers,
                        method: 'GET',
                    });
                    results = await results.json();
                }

                const characterResponse: CharacterResponse = (Object.values(results.Response.characters.data).sort((a: any, b: any) => {
                    if (a.dateLastPlayed > b.dateLastPlayed) {
                        return -1;
                    }
                    if (a.dateLastPlayed < b.dateLastPlayed) {
                        return 1;
                    }
                    return 0;
                }))[0] as CharacterResponse;

                const characterClass = destinyClass[characterResponse.classType];
                const light = characterResponse.light;

                let itemsResponse: any = await fetch(`https://www.bungie.net/Platform/Destiny2/${membership}/Profile/${props.user.membershipId}/Character/${characterResponse.characterId}/?components=205`, {
                    headers,
                    method: 'GET',
                });
                itemsResponse = await itemsResponse.json();
                const itemResponses: ItemResponse[] = itemsResponse.Response.equipment.data.items;
                const promises: Array<Promise<Item | undefined>> = [];

                itemResponses.forEach((x) => {
                    if (armourBuckets.includes(x.bucketHash) || weaponBuckets.includes(x.bucketHash)) {
                        promises.push(getItemData(membership, props.user.membershipId, x));
                    }
                });
                promises.push(getSubclass(membership, props.user.membershipId, itemResponses.filter((x) => x.bucketHash === 3284755031)[0]));

                const items: Item[] = [];
                (await Promise.all(promises)).forEach((x) => {if (x !== undefined) {
                    items.push(x);
                }});
                setCharacter({items, light, classType: characterClass, loaded: true});
            } catch (e) {
                if (controller.signal.aborted) {
                    console.log('Request has been gracefully cancelled');
                } else {
                    throw e;
                }
            }

            return function cancel() {
                controller.abort();
            };
        }

        fetchData();
    }, []);
    return (
        <div className='itemViewer'>
            {!character.loaded &&
            <div>
                <h2>{props.user.displayName}</h2>
                <Spinner />
            </div>
            } {character.loaded &&
                <div className='nameHeadliner'>
                <h2>{props.user.displayName}</h2>
                <h4>{character.light} | {character.classType}</h4>
                {character.items.map((x) => {
                    return <ItemRow item={x} key={x.imageURL} />;
                })}
                </div>
            }
        </div>
    );
}

function ItemRow(props: {item: Item}) {
    return (
        <div className='itemRow'>
            <img src={props.item.imageURL} alt={props.item.name}/>
            <div>
                <h3>{props.item.name}</h3>
                {props.item.light &&
                    <h4>{props.item.light} | {props.item.type}</h4>
                }
                {!props.item.light &&
                    <h4>{props.item.type}</h4>
                }
            </div>
        </div>
    );
}

function InitLoadingScreen(props: {username: string, platform: string, roster: FireteamRoster,
                            setRoster: (item: FireteamRoster) => void, setError: (item: string | undefined) => void}) {

    let membership = membershipType[props.platform];
    const userFacingUsername = props.username.replace('%23', '#');
    useEffect(() => {
        async function fetchRoster() {
            const controller = new AbortController();
            try {
                const headers: any = {'X-API-Key': process.env.REACT_APP_BUNGIE_API_KEY};
                const user = await fetch(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${membership}/${props.username}/`, {
                    headers,
                    method: 'GET',
                });
                const userJSON = await user.json();

                if (userJSON.Response[0] === undefined) {
                    props.setError(`User ${userFacingUsername} cannot be found on ${props.platform}`);
                    return;
                }

                membership = userJSON.Response[0].membershipType;
                const membershipId = userJSON.Response[0].membershipId;

                const rosterRequest = await fetch(`https://www.bungie.net/Platform/Destiny2/${membership}/Profile/${membershipId}/?components=1000`, {
                    headers,
                    method: 'GET',
                });
                const rosterJSON = await rosterRequest.json();

                if (rosterJSON.ErrorCode === 1601) {
                    props.setError(`Cannot find Destiny account information for ${userFacingUsername} on ${props.platform}`);
                    return;
                }

                if (rosterJSON.Response.profileTransitoryData.data === undefined) {
                    props.setError(`User ${userFacingUsername} is not online on ${props.platform}`);
                    return;
                }

                const users = rosterJSON.Response.profileTransitoryData.data.partyMembers;
                users.forEach((x: UserResponse) => {
                    // Change the queried user to membership we got back from Bungie
                    if (x.membershipId === membershipId) {
                        x.membershipType = Number(membership);
                        x.displayName = userFacingUsername;
                    }
                });

                props.setRoster({
                    loaded: true,
                    queriedUser: props.username,
                    users,
                });
            } catch (e) {
                    if (controller.signal.aborted) {
                        console.log('Request has been gracefully cancelled');
                    } else {
                        throw e;
                    }
            }

            return function cancel() {
                controller.abort();
            };
        }

        fetchRoster();
    }, []);

    return (
        <main>
            <h1>Looking up Data for {userFacingUsername}</h1>
            {!props.roster.loaded &&
                <div id='roller_container'>
                    <Spinner />
                </div>
            }

            {props.roster.loaded &&
                <p>{JSON.stringify(props.roster.users)}</p>
            }

        </main>
    );
}

async function getItemData(membership: string, membershipId: string, itemResponse: ItemResponse): Promise<Item | undefined> {
    const headers: any = {'X-API-Key': process.env.REACT_APP_BUNGIE_API_KEY};

    let results: any = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${itemResponse.itemHash}/`, {
        headers,
        method: 'GET',
    });

    results = await results.json();
    const imageURL = `https://bungie.net${results.Response.displayProperties.icon}`;
    const name = results.Response.displayProperties.name;

    const type = results.Response.itemTypeDisplayName;

    if (!weaponBuckets.includes(itemResponse.bucketHash)) {
        if (armourBuckets.includes(itemResponse.bucketHash)) {
            if (results.Response.inventory.tierTypeName !== 'Exotic') {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    results = await fetch(`https://www.bungie.net/Platform/Destiny2/${membership}/Profile/${membershipId}/Item/${itemResponse.itemInstanceId}/?components=300`, {
        headers,
        method: 'GET',
    });

    results = await results.json();
    const light = results.Response.instance.data.primaryStat.value;
    return {name, imageURL, type, light};

}

async function getSubclass(membership: string, membershipId: string, itemResponse: ItemResponse): Promise<Item> {
    const headers: any = {'X-API-Key': process.env.REACT_APP_BUNGIE_API_KEY};
    let results: any = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${itemResponse.itemHash}/`, {
        headers,
        method: 'GET',
    });
    results = await results.json();

    const imageURL = `https://bungie.net${results.Response.displayProperties.icon}`;
    const name = results.Response.displayProperties.name;

    const type = results.Response.itemTypeDisplayName;
    return {name, imageURL, type, light: undefined};
}

function Spinner() {
    return (
        <div className='lds-roller'><div></div><div></div><div></div><div></div><div></div><div>
        </div><div></div><div></div></div>
    );
}

export default MainViewer;
