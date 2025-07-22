export function generateRandomString(length = 8) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const characters = `${letters}0123456789`;

  let result = letters.charAt(Math.floor(Math.random() * letters.length)); // First character is a letter
  for (let i = 1; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
