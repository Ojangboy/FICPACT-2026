<?php

namespace App\Services\Gamification;

use App\Models\Gardens;
use App\Repositories\GardenRepository;
use App\Models\User;

class GardenService
{
    private GardenRepository $gardenRepository;

    public function __construct(GardenRepository $gardenRepository)
    {
        $this->gardenRepository = $gardenRepository;
    }

    public function applyDecay(User $user)
    {
        $garden = $this->gardenRepository->getGardenByUser($user);

        if ($garden === null) {
            return [
                'status' => 404,
                'data' => [
                    'message' => 'Garden not found',
                ],
            ];
        }

        $lastDecayCheck = $garden->last_decay_check;
        $now = now();
        $diffInHours = $now->diffInHours($lastDecayCheck);
        $diffInDays = (int) ($diffInHours / 24);

        if ($diffInDays > 0) {
            $garden = $this->gardenRepository->updateHp($garden, -$diffInDays * 10);
        } else {
            $garden = $this->gardenRepository->updateLastDecayCheck($garden, $now);
        }

        return [
            'status' => 200,
            'data' => [
                'message' => 'Garden decay applied successfully',
                'data' => [
                    'garden' => $garden,
                ],
            ],
        ];
    }

    public function addHp(User $user, string $difficulty)
    {
        $garden = $this->gardenRepository->getGardenByUser($user);

        if ($garden === null) {
            return [
                'status' => 404,
                'data' => [
                    'message' => 'Garden not found',
                ],
            ];
        }

        $hpMapping = [
            'easy' => 5,
            'medium' => 10,
            'hard' => 20,
        ];
        $hp = $hpMapping[$difficulty] ?? 5;

        $garden = $this->gardenRepository->updateHp($garden, $hp);
        $hpGained = $hp;

        return [
            'status' => 200,
            'data' => [
                'message' => 'Hp added successfully',
                'data' => [
                    'hp_gained' => $hpGained,
                    'total_hp' => $garden->hp,
                ],
            ],
        ];
    }
}
