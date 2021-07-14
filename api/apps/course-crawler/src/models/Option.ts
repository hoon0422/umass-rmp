export class Option {
  readonly value: string;
  readonly name: string;

  constructor({ value, name }: { value: string; name: string }) {
    this.value = value;
    this.name = name;
  }
}
