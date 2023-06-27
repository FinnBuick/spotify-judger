/**
 * Extract the initials from a name of <= 2 words
 */
export function getInitials(name: string | null | undefined) {
  if (!name) return '';

  const [firstName, lastName] = name.split(' ');

  if (!lastName) return firstName.charAt(0);

  return firstName.charAt(0) + lastName.charAt(0);
}
