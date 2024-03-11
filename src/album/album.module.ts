import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, ArtistService]
})
export class AlbumModule {}
