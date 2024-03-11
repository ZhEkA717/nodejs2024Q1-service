import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4, validate } from 'uuid';
import { UUIDException } from 'src/user/exceptions/uuid.exception';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const id = v4();
    console.log(this.validateArtistDto(createArtistDto));
    if (!this.validateArtistDto(createArtistDto)) throw new BadRequestException();
    const artist = {id, ...createArtistDto };
    this.artists.push(artist)
    return artist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    if (!validate(id)) throw new UUIDException();
    const artist = this.searchArtist(id);
    if (!artist) throw new NotFoundException();
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): void {
    if (!validate(id)) throw new UUIDException();
    console.log(this.validateArtistDto(updateArtistDto));
    if (!this.validateArtistDto(updateArtistDto)) throw new BadRequestException();
    const artist = this.searchArtist(id);
    if (!artist) throw new NotFoundException();
    const newArtist = { ...artist, ...updateArtistDto };
    const index: number = this.artists.indexOf(artist);
    this.artists[index] = newArtist;
  }

  remove(id: string): void {
    if (!validate(id)) throw new UUIDException();
    const artist = this.searchArtist(id);
    if (!artist) throw new NotFoundException();
    const index: number = this.artists.indexOf(artist);
    this.artists.splice(index, 1);
  }

  searchArtist(id: string): Artist | undefined {
    return this.artists.find(artist => artist.id === id);
  }

  validateArtistDto(artistDto: CreateArtistDto | UpdateArtistDto): boolean {
    const { name, grammy } = artistDto;
    return name && typeof name === 'string' && typeof grammy === 'boolean';
  }
}
