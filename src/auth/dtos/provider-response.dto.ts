import { IsString, IsUrl, IsOptional } from 'class-validator';

export class GoogleResponseDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  picture: string;
}

export class NaverResponse {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsUrl()
  @IsOptional()
  profile_image?: string;
}

export class NaverResponseDto {
  response: NaverResponse;
}

export class KakaoProperties {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsUrl()
  @IsOptional()
  profile_image?: string;
}

export class KakaoResponseDto {
  @IsString()
  id: string;

  properties: KakaoProperties;
}

export interface ProviderResponse {
  id: string;
  nickname?: string;
  picture?: string;
}
