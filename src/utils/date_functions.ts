export function getAge(birthDate: string): number {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

export function getIsoDateFromAge(age: number): string {
  // 3. Если сюда случайно залетит NaN, мы не дадим приложению упасть!
  if (isNaN(age)) age = 0;

  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  date.setDate(1);
  date.setMonth(0);

  return date.toISOString().substring(0, 10);
}
