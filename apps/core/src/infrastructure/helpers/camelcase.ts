export function camelcase(str: string, pascalCase = false) {
    const words = str.match(/[a-z0-9]+/gi);
    if (!words) return '';
  
    const capitalizedWords = words.map((word, index) => {
      if (index === 0 && !pascalCase) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  
    return capitalizedWords.join('');
  }