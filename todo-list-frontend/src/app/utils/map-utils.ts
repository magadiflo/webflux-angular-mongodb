export class MapUtils {

  private constructor() {}

  public static findKeyByValue(map: Map<unknown, unknown>, value: unknown): unknown {
    for(const key of map.keys()) {
      if(map.get(key) === value) {
        return key;
      }
    }
    return undefined;
  }
}
