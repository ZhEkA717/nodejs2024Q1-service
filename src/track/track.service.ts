import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4, validate } from 'uuid';
import { UUIDException } from 'src/user/exceptions/uuid.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  private db = this.prisma.track;

  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    if (!(await this.validateDto(createTrackDto)))
      throw new BadRequestException();
    const id = v4();
    const data = { id, ...createTrackDto };
    await this.db.create({ data });
    return data;
  }

  async findAll(): Promise<Track[]> {
    return this.db.findMany();
  }

  async findOne(id: string): Promise<Track> {
    if (!validate(id)) throw new UUIDException();
    const track = await this.db.findUnique({ where: { id } });
    if (!track) throw new NotFoundException();
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    if (!validate(id)) throw new UUIDException();
    const track = await this.db.findUnique({ where: { id } });
    if (!track) throw new NotFoundException();
    if (!(await this.validateDto(updateTrackDto)))
      throw new BadRequestException();
    return await this.db.update({ where: { id }, data: updateTrackDto });
  }

  async remove(id: string): Promise<void> {
    if (!validate(id)) throw new UUIDException();
    const track = await this.db.findUnique({ where: { id } });
    if (!track) throw new NotFoundException();
    await this.db.delete({ where: { id } });
  }

  async validateDto(dto: CreateTrackDto | UpdateTrackDto): Promise<boolean> {
    const { name, duration, artistId, albumId } = dto;
    const artistIsExist =
      artistId === null ||
      (await this.prisma.artist.findUnique({
        where: { id: String(artistId) },
      }));
    const albumIsExist =
      albumId === null ||
      (await this.prisma.album.findUnique({ where: { id: String(albumId) } }));
    return (
      name &&
      duration &&
      !!albumIsExist &&
      !!artistIsExist &&
      typeof name === 'string' &&
      typeof duration === 'number'
    );
  }
}
