<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Repositories\UserRepository;

class AuthService
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function Login(array $data): array
    {
        $ok = Auth::attempt([
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        if (!$ok) {
            return [
                'status' => 401,
                'data' => [
                    'message' => 'Invalid credentials',
                ],
            ];
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'status' => 200,
            'data' => [
                'message' => 'Login successful',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ],
            ],
        ];
    }

    public function Register(array $data): array
    {
        if ($this->userRepository->existsByEmail($data['email'])) {
            return [
                'status' => 400,
                'data' => [
                    'message' => 'Email already exists',
                ],
            ];
        }

        $user = $this->userRepository->create($data);
        $this->userRepository->createGardenForUser($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'status' => 201,
            'data' => [
                'message' => 'User registered successfully',
                'data' => [
                    'user' => $user->fresh('garden'),
                    'token' => $token,
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
                'data' => [
                    'message' => 'Unauthenticated',
                ],
            ];
        }

        $token = $user->currentAccessToken();

        if ($token) {
            $user->tokens()->where('id', $token->id)->delete();
        }

        return [
            'status' => 200,
            'data' => [
                'message' => 'Logout successful',
            ],
        ];
    }
}