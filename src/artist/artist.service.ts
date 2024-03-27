import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4, validate } from 'uuid';
import { UUIDException } from 'src/user/exceptions/uuid.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const id = v4();
    if (!this.validateArtistDto(createArtistDto))
      throw new BadRequestException();
    const artist = { id, ...createArtistDto };
    await this.prisma.artist.create({ data: artist });
    return artist;
  }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    if (!validate(id)) throw new UUIDException();
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException();
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    if (!validate(id)) throw new UUIDException();
    if (!this.validateArtistDto(updateArtistDto))
      throw new BadRequestException();
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException();
    return await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }

  async remove(id: string): Promise<void> {
    if (!validate(id)) throw new UUIDException();
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException();
    await this.prisma.artist.delete({ where: { id } });
    await this.prisma.track.deleteMany({ where: { artistId: id } });
    await this.prisma.album.deleteMany({ where: { artistId: id } });
  }

  validateArtistDto(artistDto: CreateArtistDto | UpdateArtistDto): boolean {
    const { name, grammy } = artistDto;
    return name && typeof name === 'string' && typeof grammy === 'boolean';
  }
}
