import { IsString } from 'class-validator';

export class ProviderResponseDto {
  @IsString()
  id: string;
}
