export function normalizeString(str: string): string {

  if(str) {

    return str
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Eliminar los acentos
    .trim() // Eliminar espacios al inicio y final
    .replace(/\s+/g, ''); // Eliminar todos los espacios

  } else {

    return str
    
  }

}