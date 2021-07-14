import { ValidationError } from 'class-validator';

export class ErrorDto {
  property: string;
  value: any;
  contraint: string;
  message: string;

  static createErrorDto({
    property,
    value,
    constraint,
    message,
  }: {
    property: string;
    value: any;
    constraint: string;
    message: string;
  }) {
    const errorDto = new ErrorDto();
    errorDto.property = property;
    errorDto.value = value;
    errorDto.contraint = constraint;
    errorDto.message = message;
    return errorDto;
  }

  static fromClassValidatonErrors(errors: ValidationError[]) {
    return errors
      .map((error) =>
        Reflect.ownKeys(error.constraints).map((constraint) =>
          ErrorDto.createErrorDto({
            property: error.property,
            value: error.value,
            constraint: constraint as string,
            message: error.constraints[constraint as string],
          }),
        ),
      )
      .reduce((acc, el) => acc.concat(el), []);
  }
}
