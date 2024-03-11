import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4, validate } from 'uuid';
import { UUIDException } from 'src/user/exceptions/uuid.exception';

@Injectable()
export class ArtistService {
  static artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const id = v4();
    if (!this.validateArtistDto(createArtistDto)) throw new BadRequestException();
    const artist = {id, ...createArtistDto };
    ArtistService.artists.push(artist)
    return artist;
  }

  findAll(): Artist[] {
    return ArtistService.artists;
  }

  findOne(id: string): Artist {
    if (!validate(id)) throw new UUIDException();
    const artist = this.searchArtist(id);
    if (!artist) throw new NotFoundException();
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): void {
    if (!validate(id)) throw new UUIDException();
    if (!this.validateArtistDto(updateArtistDto)) throw new BadRequestException();
    const artist = this.searchArtist(id);
    if (!artist) throw new NotFoundException();
    const newArtist = { ...artist, ...updateArtistDto };
    const index: number = ArtistService.artists.indexOf(artist);
    ArtistService.artists[index] = newArtist;
  }

  remove(id: string): void {
    if (!validate(id)) throw new UUIDException();
    const artist = this.searchArtist(id);
    if (!artist) throw new NotFoundException();
    const index: number = ArtistService.artists.indexOf(artist);
    ArtistService.artists.splice(index, 1);
  }

  searchArtist(id: string): Artist | undefined {
    return ArtistService.artists.find(artist => artist.id === id);
  }

  validateArtistDto(artistDto: CreateArtistDto | UpdateArtistDto): boolean {
    const { name, grammy } = artistDto;
    return name && typeof name === 'string' && typeof grammy === 'boolean';
  }
}
