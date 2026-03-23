<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Repositories\TaskRepository;
use App\Repositories\GardenRepository;
use App\Services\Gamification\ExpService;
use App\Services\Gamification\LevelService;

class TaskService
{
    private TaskRepository $taskRepository;
    private GardenRepository $gardenRepository;
    private ExpService $expService;
    private LevelService $levelService;

    public function __construct(TaskRepository $taskRepository, GardenRepository $gardenRepository, ExpService $expService, LevelService $levelService)
    {
        $this->taskRepository = $taskRepository;
        $this->gardenRepository = $gardenRepository;
        $this->expService = $expService;
        $this->levelService = $levelService;
    }

    public function getAllTasks()
    {
        $user = Auth::user();
        $task = $this->taskRepository->getAllByUser($user);

        return [
            'status' => 200,
            'data' => [
                'message' => 'Tasks retrieved successfully',
                'data' => [
                    'task' => $task,
                ],
            ],
        ];
    }

    public function createTask(array $data)
    {
        $user = Auth::user();

        $deadlineMaps = [
            'easy' => 1,
            'medium' => 3,
            'hard' => 7,
        ];

        $difficulty = $data['difficulty'] ?? 'easy';
        $days = $deadlineMaps[$difficulty] ?? 1;
        $data['deadline'] = now()->addDays($days);

        $task = $this->taskRepository->createForUser($user, $data);

        return [
            'status' => 201,
            'data' => [
                'message' => 'Task created successfully',
                'data' => [
                    'task' => $task,
                ],
            ],
        ];
    }

    public function getTaskById($id)
    {
        $user = Auth::user();
        $task = $this->taskRepository->findByUserAndId($user, $id);

        return [
            'status' => 200,
            'data' => [
                'message' => 'Task retrieved successfully',
                'data' => [
                    'task' => $task,
                ],
            ],
        ];
    }

    public function updateTask(array $data, $id)
    {
        $user = Auth::user();
        $task = $this->taskRepository->findByUserAndId($user, $id);

        if (!$task) {
            return null;
        }

        $task = $this->taskRepository->updateTask($task, $data);

        return [
            'status' => 200,
            'data' => [
                'message' => 'Task updated successfully',
                'data' => [
                    'task' => $task,
                ],
            ],
        ];
    }

    public function deleteTask($id)
    {
        $user = Auth::user();
        $task = $this->taskRepository->findByUserAndId($user, $id);

        if (!$task) {
            return null;
        }

        $this->taskRepository->deleteTask($task);
        
        return [
            'status' => 200,
            'data' => [
                'message' => 'Task deleted successfully',
                'data' => [
                    'task' => $task,
                ],
            ],
        ];
    }

    public function markTaskAsComplete($id)
    {
        $user = Auth::user();
        $task = $this->taskRepository->findByUserAndId($user, $id);
        $garden = $this->gardenRepository->getGardenByUser($user);

        if (!$task || !$garden) {
            return null;
        }

        if ($task->is_completed) {
            return null;
        }

        $task = $this->taskRepository->markCompleted($task);
        $rewardExp = $this->expService->addExp($user, $task->difficulty);
        $rewardLevel = $this->levelService->checkLevelUp($user);

        return [
            'status' => 200,
            'data' => [
                'message' => 'Task completed successfully',
                'data' => [
                    'task' => $task,
                    'garden' => $garden,
                    'reward_exp' => $rewardExp,
                    'reward_level' => $rewardLevel,
                ],
            ],
        ];
    }
}