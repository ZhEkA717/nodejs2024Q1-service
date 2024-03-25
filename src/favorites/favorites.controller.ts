import { Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UUIDParam } from 'src/utils/uuid';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('album/:id')
  addAlbum(@UUIDParam('id') id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbum(@UUIDParam('id') id: string) {
    return this.favoritesService.deleteAlbum(id);
  }

  @Post('artist/:id')
  addArtist(@UUIDParam('id') id: string) {
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtist(@UUIDParam('id') id: string) {
    return this.favoritesService.deleteArtist(id);
  }

  @Post('track/:id')
  addTrack(@UUIDParam('id') id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrack(@UUIDParam('id') id: string) {
    return this.favoritesService.deleteTrack(id);
  }
}
