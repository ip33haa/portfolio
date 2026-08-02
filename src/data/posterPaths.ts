/** Public poster art path for a library app id. Replace SVGs in /public/posters/ with real box art. */
export function posterPath(id: string): string {
  return `/posters/${id}.svg`;
}
