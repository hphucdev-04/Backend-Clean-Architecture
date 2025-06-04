import { UserResponseDto } from '~/modules/user/dto/user-response.dto';

export class TokenResponseDto {
  token!: string;
  expiresIn!: number;
}

export class AuthResponseDto {
  user!: UserResponseDto;
  tokens?: {
    accessToken: TokenResponseDto;
    refreshToken: TokenResponseDto;
  };

  static fromLoginResponse(user: UserResponseDto, accessToken: TokenResponseDto, refreshToken: TokenResponseDto): AuthResponseDto {
    const authResponse = new AuthResponseDto();
    authResponse.user = user;
    authResponse.tokens = {
      accessToken,
      refreshToken,
    };
    return authResponse;
  }
}