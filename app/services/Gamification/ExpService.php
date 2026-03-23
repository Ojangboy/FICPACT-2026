<?php

namespace App\Services\Gamification;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Repositories\TaskRepository;
use App\Services\Gamification\LevelService;

class ExpService
{
    private UserRepository $userRepository;
    private TaskRepository $taskRepository;
    private LevelService $levelService;

    public function __construct(UserRepository $userRepository, TaskRepository $taskRepository, LevelService $levelService)
    {
        $this->userRepository = $userRepository;
        $this->taskRepository = $taskRepository;
        $this->levelService = $levelService;
    }

    public function addExp(User $user, string $difficulty): array
    {

        $expMapping = [
            'easy' => 10,
            'medium' => 20,
            'hard' => 30,
        ];
        $exp = $expMapping[$difficulty] ?? 10;

        $user = $this->userRepository->updateExp($user, $exp);
        $expGained = $exp;

        $levelResult = $this->levelService->checkLevelUp($user);

        return [
            'status' => 200,
            'data' => [
                'message' => 'Exp added successfully',
                'data' => [
                    'exp_gained' => $expGained,
                    'total_exp' => $user->total_exp,
                    'level_up' => $levelResult['data']['data']['leveled_up'],
                    'level'    => $levelResult['data']['data']['level'],
                ],
            ],
        ];
    }
}
