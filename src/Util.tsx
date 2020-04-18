import React from 'react';

function Background() {
    return (
      <div className='background'></div>
    );
  }

const membershipType: { [key: string]: string } = {
    Xbox: '1',
    PSN: '2',
    Steam: '3',
    Stadia: '5',
    TigerXbox: '1',
    TigerPsn: '2',
    TigerSteam: '3',
    TigerStadia: '5',
};

const destinyClass: {[key: number]: string} = {
  0: 'Titan',
  1: 'Hunter',
  2: 'Warlock',
};

const weaponBuckets = [
  1498876634,
  2465295065,
  953998645,
];

const armourBuckets = [
  20886954,
  3448274439,
  3551918588,
  14239492,
];

export {armourBuckets, Background, destinyClass, membershipType, weaponBuckets};
