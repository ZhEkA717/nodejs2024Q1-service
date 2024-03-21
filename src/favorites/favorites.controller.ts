import { Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UUIDParam } from 'src/utils/uuid';
import { EntityType } from './entities/favorite.entities';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('album/:id')
  addAlbum(@UUIDParam('id') id: string) {
    return this.favoritesService.addEntity(id, EntityType.album);

  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbum(@UUIDParam('id') id: string) {
    return this.favoritesService.deleteEntity(id, EntityType.album);
  }

  @Post('artist/:id')
  addArtist(@UUIDParam('id') id: string) {
    return this.favoritesService.addEntity(id, EntityType.artist);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtist(@UUIDParam('id') id: string) {
    return this.favoritesService.deleteEntity(id, EntityType.artist);
  }

  @Post('track/:id')
  addTrack(@UUIDParam('id') id: string) {
    return this.favoritesService.addEntity(id, EntityType.track);
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrack(@UUIDParam('id') id: string) {
    return this.favoritesService.deleteEntity(id, EntityType.track);
  }
}
