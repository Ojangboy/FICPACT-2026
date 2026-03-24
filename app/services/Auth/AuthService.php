<?php

namespace App\Services\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\UserRepository;
use App\Repositories\RefreshTokenRepository;

class AuthService
{
    private UserRepository $userRepository;
    private RefreshTokenRepository $refreshTokenRepository;

    public function __construct(UserRepository $userRepository, RefreshTokenRepository $refreshTokenRepository)
    {
        $this->userRepository = $userRepository;
        $this->refreshTokenRepository = $refreshTokenRepository;
    }

    public function Login(array $data): array
    {
        $ok = Auth::attempt([
            'email'    => $data['email'],
            'password' => $data['password'],
        ]);

        if (!$ok) {
            return [
                'status' => 401,
                'data'   => ['message' => 'Invalid credentials'],
            ];
        }

        $user         = Auth::user();
        $accessToken  = $user->createToken('access_token')->plainTextToken;
        $refreshToken = $this->refreshTokenRepository->create($user);

        return [
            'status' => 200,
            'data'   => [
                'message' => 'Login successful',
                'data'    => [
                    'user'          => $user,
                    'access_token'  => $accessToken,
                    'refresh_token' => $refreshToken->token,
                ],
            ],
        ];
    }

    public function Register(array $data): array
    {
        if ($this->userRepository->existsByEmail($data['email'])) {
            return [
                'status' => 400,
                'data'   => ['message' => 'Email already exists'],
            ];
        }

        $user         = $this->userRepository->create($data);
        $this->userRepository->createGardenForUser($user, $data);
        $accessToken  = $user->createToken('access_token')->plainTextToken;
        $refreshToken = $this->refreshTokenRepository->create($user);

        return [
            'status' => 201,
            'data'   => [
                'message' => 'User registered successfully',
                'data'    => [
                    'user'          => $user->fresh('garden'),
                    'access_token'  => $accessToken,
                    'refresh_token' => $refreshToken->token,
                ],
            ],
        ];
    }

    public function Logout(Request $request): array
    {
        $user = $request->user();

        if (!$user) {
            return [
                'status' => 401,
                'data'   => ['message' => 'Unauthenticated'],
            ];
        }

        $token = $user->currentAccessToken();
        if ($token) {
            $user->tokens()->where('id', $token->id)->delete();
        }

        $this->refreshTokenRepository->deleteByUser($user);

        return [
            'status' => 200,
            'data'   => ['message' => 'Logout successful'],
        ];
    }

    public function Refresh(string $refreshToken): array
    {
        $record = $this->refreshTokenRepository->findValid($refreshToken);

        if (!$record) {
            return [
                'status' => 401,
                'data'   => ['message' => 'Invalid or expired refresh token'],
            ];
        }

        $user = $record->user;
        $user->tokens()->delete();

        $accessToken     = $user->createToken('access_token')->plainTextToken;
        $newRefreshToken = $this->refreshTokenRepository->create($user);

        return [
            'status' => 200,
            'data'   => [
                'message' => 'Token refreshed successfully',
                'data'    => [
                    'access_token'  => $accessToken,
                    'refresh_token' => $newRefreshToken->token,
                ],
            ],
        ];
    }
}