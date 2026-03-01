import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (dto.password !== dto.confirm_password) {
      throw new ConflictException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        full_name: dto.full_name,
        email: dto.email,
        password: hashedPassword,
        institution: dto.institution,
        admin_code: dto.admin_code,
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(dto: RefreshTokenDto) {
    if (!dto.refresh_token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    // Find the refresh token in database
    const storedRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refresh_token },
    });

    if (!storedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (new Date() > new Date(storedRefreshToken.expiresAt)) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Check if token was revoked (logged out)
    if (storedRefreshToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Get user data
    const user = await this.prisma.user.findUnique({
      where: { id: storedRefreshToken.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new tokens
    return this.generateTokens(user);
  }

  async logout(userId: number, refreshToken?: string) {
    if (!refreshToken) {
      return { message: 'Logged out successfully' };
    }

    // Revoke the refresh token by setting revokedAt timestamp
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        token: refreshToken,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return { message: 'Logged out successfully' };
  }

  async logoutAllDevices(userId: number) {
    // Revoke all refresh tokens for this user
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });

    return { message: 'Logged out from all devices' };
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Generate access token (15 minutes)
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    // Generate refresh token (7 days)
    const refresh_token = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      },
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refresh_token,
        expiresAt,
      },
    });

    return {
      access_token,
      refresh_token,
      token_type: 'Bearer',
      expires_in: 900, // 15 minutes in seconds
    };
  }
}
