import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4, validate } from 'uuid';
import { UUIDException } from 'src/user/exceptions/uuid.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  private db = this.prisma.album;

  constructor (private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if(!(await this.validateAlbumDto(createAlbumDto))) throw new BadRequestException();
    const id = v4();
    const data = {id, ...createAlbumDto};
    await this.db.create({data})
    return data;
  }

  async findAll(): Promise<Album[]> {
    return await this.db.findMany();
  }

  async findOne(id: string): Promise<Album> {
    if (!validate(id)) throw new UUIDException();
    const album = await this.db.findUnique({where: {id}});
    if (!album) throw new NotFoundException();
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    if (!validate(id)) throw new UUIDException();
    const album = await this.db.findUnique({where: {id}});
    if (!album) throw new NotFoundException();
    if (!(await this.validateAlbumDto(updateAlbumDto))) throw new BadRequestException();
    return await this.db.update({where: {id}, data: updateAlbumDto});
  }

  async remove(id: string): Promise<void> {
    if (!validate(id)) throw new UUIDException();
    const album = await this.db.findUnique({where:{id}});
    if (!album) throw new NotFoundException();
    await this.db.delete({
      where: {id},
      include: {tracks: true}
    })
  }

  async validateAlbumDto(albumDto: CreateAlbumDto | UpdateAlbumDto): Promise<boolean> {
    const {name, year, artistId } = albumDto;
    const isExist = artistId === null || await this.prisma.artist.findUnique({where: {id: String(artistId)}});
    return name && year && typeof name === 'string' && typeof year === 'number' && !!isExist;
  }
}
