import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorMessages } from 'src/Error';

@Injectable()
export class AlbumService {
  private db = this.prisma.album;

  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.db.create({ data: { ...createAlbumDto } });
  }

  async findAll(): Promise<Album[]> {
    return await this.db.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.db.findUnique({ where: { id } });
    if (!album) throw new NotFoundException(ErrorMessages.ALBUM_NOT_FOUND);
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.db.findUnique({ where: { id } });
    if (!album) throw new NotFoundException(ErrorMessages.ALBUM_NOT_FOUND);
    return await this.db.update({ where: { id }, data: updateAlbumDto });
  }

  async remove(id: string): Promise<void> {
    const album = await this.db.findUnique({ where: { id } });
    if (!album) throw new NotFoundException(ErrorMessages.ALBUM_NOT_FOUND);
    await this.db.delete({
      where: { id },
      include: { tracks: true },
    });
  }
}
