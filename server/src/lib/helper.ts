
export function checkIfNull(item: any, property: string) {
   if (item[0] && item[0][property]) {
      return item[0][property]
   }
   return 0
}



