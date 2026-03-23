<?php

namespace App\Services\Gamification;
use App\Models\User;
use App\Repositories\UserRepository;

class LevelService
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function checkLevelUp(User $user): array
    {
        $leveledUp = false;

        while(true) {
            $currentLevel = $this->userRepository->currentLevel($user);
            $currentExp = $this->userRepository->currentExp($user);

            $expReqForNextLevel = $this->getExpReqForNextLevel($currentLevel);

            if($currentExp >= $expReqForNextLevel) {
                $user = $this->userRepository->updateLevel($user, 1);
                $user = $this->userRepository->updateExp($user, -$expReqForNextLevel);
                $leveledUp = true;
            }else{
                break;
            }
        }

        return [
            'status' => 200,
            'data' => [
                'message' => $leveledUp ? 'Level up successfully' : 'No level up',
                'data' => [
                    'leveled_up' => $leveledUp,
                    'level' => $user->level,
                    'total_exp' => $user->total_exp,
                ],
            ],
        ];
    }

    private function getExpReqForNextLevel(int $currentLevel): int
    {
        if($currentLevel <= 10) {
            return 100 + (25 * ($currentLevel - 1));
        }

        return 100 + (50 * ($currentLevel - 1));
    }
}
