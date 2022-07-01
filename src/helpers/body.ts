function checkMissingFields<T>(fields: T[]) {
  fields.forEach((field) => {
    if (field === undefined)
      throw new Error('There are missing fields in the body!');
  });
}

export { checkMissingFields };
