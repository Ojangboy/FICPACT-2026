<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Gardens;

class GardenRepository
{
    public function getGardenByUser(User $user): ?Gardens
    {
        return $user->garden;
    }

    public function updateGarden(Gardens $garden, array $data): Gardens
    {
        $garden->update($data);
        return $garden->fresh();
    }

    public function updateHp(Gardens $garden, int $hp): Gardens
    {
        $garden->update([
            'hp' => $garden->hp + $hp,
        ]);
        return $garden->fresh();
    }


    public function updateLastDecayCheck(Gardens $garden, $timestamp): Gardens
    {
        $garden->update([
            'last_decay_check' => $timestamp,
        ]);
        return $garden->fresh();
    }
}
