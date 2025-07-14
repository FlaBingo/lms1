

export function formatPlural(
  count: number,
  { singular, plural }: {singular: string, plural: string },
  { includeCount = true } = {} // i don't know what is this syntax
){
  const word = count === 1 ? singular: plural

  return includeCount ? `${count} ${word}` : word;
  // use case:
  // formatPlural(2, { singular: "course", plural: "courses"}, {includeCount = false})
  // output: 'courses'
}
