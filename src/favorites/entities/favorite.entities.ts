import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export class Favorite {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoriteResponce {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export const EntityType = {
  album: {
    prismaEntity: 'album',
    field: 'albums',
  },
  artist: {
    prismaEntity: 'artist',
    field: 'artists',
  },
  track: {
    prismaEntity: 'track',
    field: 'tracks',
  },
};

export type FavoriteEntityType = typeof EntityType[keyof typeof EntityType];
