import { normalizeString } from "./Utils"

export function filterAutocomplete<T>(
  options: T[],
  searchTerm: string,
  keys: string[] // Las propiedades en las que se desea buscar
): T[] {

  const normalizedSearchTerm = normalizeString(searchTerm)

  if(normalizedSearchTerm) {

    return options.filter((option: any) => 
      keys.some((key: string) => normalizeString(String(option[key])).includes(normalizedSearchTerm))
    )

  } else {

    return options

  }

}