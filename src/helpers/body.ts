function checkMissingFields<T>(fields: T[]): boolean {
  return fields.includes(undefined);
}

export { checkMissingFields };
