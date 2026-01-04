import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDidaticoDto } from './material-didatico.dto';

export class UpdateMaterialDidaticoDto extends PartialType(
  CreateMaterialDidaticoDto,
) {}
