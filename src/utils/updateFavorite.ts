export const updateFavorite = (ids: string[], id: string) => {
    const albumId = ids.find(item => item === id);
    if (albumId) {
      const index: number = ids.indexOf(albumId);
      ids.splice(index, 1);
    }
}