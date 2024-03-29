import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4, validate } from 'uuid';
import { UUIDException } from 'src/user/exceptions/uuid.exception';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { updateFavorite } from 'src/utils/updateFavorite';

@Injectable()
export class AlbumService {

  static albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto): Album {
    if(!this.validateAlbumDto(createAlbumDto)) throw new BadRequestException();
    const id = v4();
    const album = {id, ...createAlbumDto};
    AlbumService.albums.push(album);
    return album;
  }

  findAll() {
    return AlbumService.albums;
  }

  findOne(id: string): Album {
    if (!validate(id)) throw new UUIDException();
    const album = this.searchAlbum(id);
    if (!album) throw new NotFoundException();
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    if (!validate(id)) throw new UUIDException();
    const album = this.searchAlbum(id);
    if (!album) throw new NotFoundException();
    if (!this.validateAlbumDto(updateAlbumDto)) throw new BadRequestException();
    const newAlbum = {...album, ...updateAlbumDto};
    const index: number = AlbumService.albums.indexOf(album);
    AlbumService.albums[index] = newAlbum;
    return newAlbum;
  }

  remove(id: string): void {
    if (!validate(id)) throw new UUIDException();
    const album = this.searchAlbum(id);
    if (!album) throw new NotFoundException();
    const index: number = AlbumService.albums.indexOf(album);
    AlbumService.albums.splice(index, 1);
    updateFavorite(FavoritesService.favs.albums, id);
    this.updateTracksAfterDeleteAlbum(id);
  }

  updateTracksAfterDeleteAlbum(id: string) {
    TrackService.tracks.forEach(item => {
      if (item.albumId === id) item.albumId = null;
    })
  }

  validateAlbumDto(albumDto: CreateAlbumDto | UpdateAlbumDto): boolean {
    const {name, year, artistId } = albumDto;
    const isExist = artistId === null || ArtistService.artists.find(artist => artist.id === artistId);
    return name && year && typeof name === 'string' && typeof year === 'number' && !!isExist;
  }

  searchAlbum(id: string):Album | undefined {
    return AlbumService.albums.find(album => album.id === id);
  }

  get getAlbumsId() {
    return AlbumService.albums.map(item => item.id);
  }
}
