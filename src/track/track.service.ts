import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorMessages } from 'src/Error';

@Injectable()
export class TrackService {
  private db = this.prisma.track;

  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.db.create({ data: { ...createTrackDto } });
  }

  async findAll(): Promise<Track[]> {
    return this.db.findMany();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.db.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(ErrorMessages.TRACK_NOT_FOUND);
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.db.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(ErrorMessages.TRACK_NOT_FOUND);
    return await this.db.update({ where: { id }, data: updateTrackDto });
  }

  async remove(id: string): Promise<void> {
    const track = await this.db.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(ErrorMessages.TRACK_NOT_FOUND);
    await this.db.delete({ where: { id } });
  }
}
