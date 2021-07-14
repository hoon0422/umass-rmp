import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class RateWriteDto {
  @IsInt()
  @Min(1)
  @Max(5)
  overallScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  easyness: number;

  @IsInt()
  @Min(1)
  @Max(5)
  learned: number;

  @IsInt()
  @Min(1)
  @Max(5)
  teaching: number;

  @IsString()
  @MinLength(100)
  @MaxLength(10000)
  rate: string;
}

export class RateEditDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  overallScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  easyness?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  learned?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  teaching?: number;

  @IsOptional()
  @IsString()
  @MinLength(100)
  @MaxLength(10000)
  rate?: string;
}
