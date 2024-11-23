export function compareObjects(obj1: any, obj2: any): boolean {

  // Comprueba si los objetos / variables son iguales
  if(obj1 === obj2) return true

  // Comprueba que el valor del parámetro es un objeto y no es null
  if(typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  // Comprueba que la longitud de las keys sean iguales
  if(keys1.length !== keys2.length) return false

  // Comprueba si una key del objeto existe en la otra y que sus variables son iguales
  for(const key of keys1) {

    if(!keys2.includes(key) || !compareObjects(obj1[key], obj2[key])) {

      return false

    }

  }

  return true

}