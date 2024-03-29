import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  private db = this.prisma.album;

  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const id = v4();
    const data = { id, ...createAlbumDto };
    await this.db.create({ data });
    return data;
  }

  async findAll(): Promise<Album[]> {
    return await this.db.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.db.findUnique({ where: { id } });
    if (!album) throw new NotFoundException();
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.db.findUnique({ where: { id } });
    if (!album) throw new NotFoundException();
    return await this.db.update({ where: { id }, data: updateAlbumDto });
  }

  async remove(id: string): Promise<void> {
    const album = await this.db.findUnique({ where: { id } });
    if (!album) throw new NotFoundException();
    await this.db.delete({
      where: { id },
      include: { tracks: true },
    });
  }
}
