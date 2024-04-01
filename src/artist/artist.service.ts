import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorMessages } from 'src/Error';

@Injectable()
export class ArtistService {
  constructor(private readonly db: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.db.artist.create({ data: { ...createArtistDto } });
  }

  async findAll(): Promise<Artist[]> {
    return this.db.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.db.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException(ErrorMessages.ARTIST_NOT_FOUND);
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.db.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException(ErrorMessages.ARTIST_NOT_FOUND);
    return await this.db.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }

  async remove(id: string): Promise<void> {
    const artist = await this.db.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException(ErrorMessages.ARTIST_NOT_FOUND);
    await this.db.artist.delete({ where: { id } });
    await this.db.track.deleteMany({ where: { artistId: id } });
    await this.db.album.deleteMany({ where: { artistId: id } });
  }
}
