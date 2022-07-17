// generate random password with 8 characters, one uppercase letter, one lowercase letter, one number and one special character

const randomPassword = (passwordLength: number): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = lowercase.toUpperCase();
  const numbers = '0123456789';
  const special = '@$!%*?&';

  const randomLower = lowercase[Math.floor(Math.random() * lowercase.length)];
  const randomUpper = uppercase[Math.floor(Math.random() * uppercase.length)];
  const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
  const randomSpecial = special[Math.floor(Math.random() * special.length)];

  let password = `${randomLower}${randomUpper}${randomNumber}${randomSpecial}`;

  const leftChars = passwordLength - password.length;

  for (let i = 0; i < leftChars; i++) {
    const randomChar =
      Math.random() < 0.5
        ? randomLower[Math.floor(Math.random() * randomLower.length)]
        : randomUpper[Math.floor(Math.random() * randomUpper.length)];
    password += randomChar;
  }

  // shuffle password
  const shuffledPassword = [...password].sort(() => Math.random() - 0.5);

  return shuffledPassword.join('');
};

export { randomPassword };
