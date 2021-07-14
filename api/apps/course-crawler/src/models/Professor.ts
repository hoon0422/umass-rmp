export class ProfessorData {
  readonly email: string;
  readonly name: string;

  constructor({ email, name }: { email: string; name: string }) {
    this.email = email;
    this.name = name;
  }
}
