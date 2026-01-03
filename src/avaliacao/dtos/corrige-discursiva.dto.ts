import { IsNumber, Min } from 'class-validator';

export class CorrigirDiscursivaDto {
  @IsNumber()
  @Min(0)
  nota: number;
}
