import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  private db = this.prisma.track;

  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const id = v4();
    const data = { id, ...createTrackDto };
    await this.db.create({ data });
    return data;
  }

  async findAll(): Promise<Track[]> {
    return this.db.findMany();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.db.findUnique({ where: { id } });
    if (!track) throw new NotFoundException();
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.db.findUnique({ where: { id } });
    if (!track) throw new NotFoundException();
    return await this.db.update({ where: { id }, data: updateTrackDto });
  }

  async remove(id: string): Promise<void> {
    const track = await this.db.findUnique({ where: { id } });
    if (!track) throw new NotFoundException();
    await this.db.delete({ where: { id } });
  }
}
