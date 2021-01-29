

export interface PlaceLocation {
    x: number;
    y: number;
}

export type DateKey = string;
export type PlaceName = string|Array<string>;
export type CharacterName = string

export type PlaceData =  Map<PlaceName, PlaceLocation>;

export type CharacterPlaces = Map<CharacterName, PlaceName>;

export interface DateEntry {
    event: string
    characters: CharacterPlaces
}

export type History = Map<DateKey,DateEntry>

export interface Base {
    dates: History
}

export type LocationSet = Map<DateKey, PlaceName>

export async function getPlaceData() : Promise<PlaceData>{
    const res = await fetch("/data/places.json")
    const obj = await res.json()
    return objToStrMap(obj)
}
export async function getBaseData(): Promise<Base> {
    const res = await fetch("/data/lotr_nocomment.json")
    const ret = await res.json()
    if(ret.dates) {
        ret.dates = objToStrMap(ret.dates)
        Array.from(ret.dates.keys()).forEach(key => {
            if(ret.dates.get(key).characters)
            ret.dates.get(key).characters = objToStrMap(ret.dates.get(key).characters)
        })
    }
    
    console.log("ret:", ret)
    return  ret
}

export async function getAllDateKeys(): Promise<DateKey[]> {
    const base = await getBaseData();
    return Array.from(base.dates.keys())
}

export async function getCharacterNames(): Promise<string[]> {
    const base = await getBaseData();
    const chars = new Set<string>()
    Array.from(base.dates.keys()).forEach((date) => {
        Array.from(base.dates.get(date).characters.keys()).forEach(char => chars.add(char))
    })
    return Array.from(chars)
}

export async function getLocationSetByCharacter(character: string) :Promise<LocationSet> {
    const base = await getBaseData()
    let ret: LocationSet = new Map()
    Array.from(base.dates.keys()).forEach((date) => {
        let entry = base.dates.get(date)
        if(entry.characters.has(character)){
            const loc = entry.characters.get(character)
            if(Array.isArray(loc))
                loc.forEach(item=> ret.set(date,item) )
            else
                ret.set(date,loc)
        }
    })
        
    return ret;
}


function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  }

export async function getPlaceLocation(place: PlaceName): Promise<PlaceLocation> {
    const data = await getPlaceData()
    console.log(`Get Coords for Place : "${place}"` )
    console.log("Places:", data)
    console.log("Has:", data.has(place))
    return data.has(place) ?  data.get(place) : undefined
}