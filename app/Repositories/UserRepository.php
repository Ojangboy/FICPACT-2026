<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Gardens;

class UserRepository
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function existsByEmail(string $email): bool
    {
        return User::where('email', $email)->exists();
    }

    public function createGardenForUser(User $user, array $data = []): Gardens
    {
        return $user->garden()->create([
            'exp' => $data['exp'] ?? 0,
            'hp' => $data['hp'] ?? 100,
        ]);
    }
}