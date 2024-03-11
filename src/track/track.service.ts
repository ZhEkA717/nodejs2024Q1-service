import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { v4, validate } from 'uuid';
import { UUIDException } from 'src/user/exceptions/uuid.exception';

@Injectable()
export class TrackService {
  static tracks: Track[] = [];

  constructor(
    private artistService: ArtistService,
    private albumService: AlbumService
  ) { }

  create(createTrackDto: CreateTrackDto): Track {
    if (!this.validateDto(createTrackDto)) throw new BadRequestException();
    const id = v4();
    const track = {id, ...createTrackDto};
    TrackService.tracks.push(track);
    return track;
  }

  findAll(): Track[] {
    return TrackService.tracks;
  }

  findOne(id: string): Track {
    if (!validate(id)) throw new UUIDException();
    const track = this.searchTrack(id);
    if (!track) throw new NotFoundException();
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto):void {
    if (!validate(id)) throw new UUIDException();
    const track = this.searchTrack(id);
    if (!track) throw new NotFoundException();
    if (!this.validateDto(updateTrackDto)) throw new BadRequestException();
    const newTrack = {...track, ...updateTrackDto};
    const index: number = TrackService.tracks.indexOf(track);
    TrackService.tracks[index] = newTrack;
  }

  remove(id: string): void {
    if (!validate(id)) throw new UUIDException();
    const track = this.searchTrack(id);
    if (!track) throw new NotFoundException();
    const index: number = TrackService.tracks.indexOf(track);
    TrackService.tracks.splice(index, 1);
  }

  searchTrack(id: string): Track | undefined {
    return TrackService.tracks.find(track => track.id === id);
  }

  validateDto(dto: CreateTrackDto | UpdateTrackDto) {
    const { name, duration, artistId, albumId } = dto;
    const artistIsExist = artistId === null || this.artistService.searchArtist(artistId);
    const albumIsExist = albumId === null || this.albumService.searchAlbum(albumId);
    return name && duration && !!albumIsExist && !!artistIsExist && typeof name === 'string' && typeof duration === 'number';
  }
}
