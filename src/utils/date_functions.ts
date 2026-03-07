export function getAge(birthDate: string): number {
    return new Date().getFullYear()
      - new Date(birthDate).getFullYear()
}
export function getIsoDateFromAge(age: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  date.setDate(1);
  date.setMonth(0)
  return date.toISOString().substring(0, 10)
}