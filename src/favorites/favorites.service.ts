import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Favorite, FavoriteResponce } from './entities/favorite.entities';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoritesService {
    static favs: Favorite = <Favorite>{
        artists: [],
        albums: [],
        tracks: []
    }
    findAll():FavoriteResponce {
        const {artists, albums, tracks} = FavoritesService.favs;
        return {
            artists: this.idsToEntity(artists, ArtistService.artists) as Artist[],
            albums: this.idsToEntity(albums, AlbumService.albums) as Album[],
            tracks: this.idsToEntity(tracks, TrackService.tracks) as Track[]
        }
    }

    addAlbum(id: string) {
        const { albums } = FavoritesService.favs;
        this.addEntity(albums, AlbumService.albums, id);
    }

    deleteAlbum(id: string) {
        const {albums} = FavoritesService.favs;
        this.deleteEntity(albums, id);
    }

    addArtist(id: string) {
        const { artists } = FavoritesService.favs;
        this.addEntity(artists, ArtistService.artists, id);
    }

    deleteArtist(id: string) {
        const {artists} = FavoritesService.favs;
        this.deleteEntity(artists, id);
    }

    addTrack(id: string) {
        const { tracks } = FavoritesService.favs;
        this.addEntity(tracks, TrackService.tracks, id);
    }

    deleteTrack(id: string) {
        const {tracks} = FavoritesService.favs;
        this.deleteEntity(tracks, id);
    }

    idsToEntity(ids: string[], arr: Artist[] | Album[] | Track[],) {
        const entityArr = ids.map(id => {
            let entity: Artist | Album | Track; 
            arr.forEach(item => {
                if (id === item.id) entity = item;
            })
            return entity;
        })
        return entityArr;
    }

    addEntity(ids: string[], arr: any[], id: string) {
        const entity = arr.find(item => item.id === id);
        if (!entity) throw new UnprocessableEntityException();
        if (!ids.includes(entity.id)) ids.push(entity.id);
    }

    deleteEntity(ids: string[], id: string) {
        const entity = ids.find(item => item === id);
        if (!entity) throw new NotFoundException();
        const index: number = ids.indexOf(entity);
        ids.splice(index, 1);
    }
}
