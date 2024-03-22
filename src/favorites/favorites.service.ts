import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  FavoriteEntityType,
  FavoriteResponce,
} from './entities/favorite.entities';
import { PrismaService } from 'src/prisma/prisma.service';
import { FAVORITE_ID } from 'src/utils/constants';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FavoriteResponce> {
    const { albums, artists, tracks } = await this.prisma.favorites.findUnique({
      where: { id: FAVORITE_ID },
    });
    return {
      artists: await this.prisma.artist.findMany({
        where: { id: { in: artists } },
      }),
      albums: await this.prisma.album.findMany({
        where: { id: { in: albums } },
      }),
      tracks: await this.prisma.track.findMany({
        where: { id: { in: tracks } },
      }),
    };
  }

  async addEntity(id: string, entityType: FavoriteEntityType) {
    const { prismaEntity, field } = entityType;
    const entity = await this.prisma[prismaEntity].findUnique({
      where: { id },
    });
    if (!entity) throw new UnprocessableEntityException();
    const listOfIds: string[] = await this.getListOfIds(field);
    if (!listOfIds.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: FAVORITE_ID },
        data: { [field]: { push: id } },
      });
    }
  }

  async deleteEntity(id: string, entityType: FavoriteEntityType) {
    const { prismaEntity, field } = entityType;
    const entity = await this.prisma[prismaEntity].findUnique({
      where: { id },
    });
    if (!entity) throw new NotFoundException();
    const listOfIds: string[] = await this.getListOfIds(field);

    await this.prisma.favorites.update({
      where: { id: FAVORITE_ID },
      data: {
        [field]: listOfIds.filter((item) => item !== id),
      },
    });
  }

  async getListOfIds(field: string): Promise<string[]> {
    const favs = await this.prisma.favorites.findUnique({
      where: { id: FAVORITE_ID },
      select: { [field]: true },
    });
    const listOfIds: string[] = favs[field];
    return listOfIds;
  }
}
