<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Repositories\TaskRepository;

class TaskService
{
    private TaskRepository $taskRepository;

    public function __construct(TaskRepository $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function getAllTasks()
    {
        $user = Auth::user();
        return $this->taskRepository->getAllByUser($user);
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

        return $this->taskRepository->createForUser($user, $data);
    }

    public function getTaskById($id)
    {
        $user = Auth::user();
        return $this->taskRepository->findByUserAndId($user, $id);
    }

    public function updateTask(array $data, $id)
    {
        $user = Auth::user();
        $task = $this->taskRepository->findByUserAndId($user, $id);

        if (!$task) {
            return null;
        }

        return $this->taskRepository->updateTask($task, $data);
    }

    public function deleteTask($id)
    {
        $user = Auth::user();
        $task = $this->taskRepository->findByUserAndId($user, $id);

        if (!$task) {
            return null;
        }

        return $this->taskRepository->deleteTask($task);
    }

    public function markTaskAsComplete($id)
    {
        $user = Auth::user();

        return DB::transaction(function () use ($user, $id) {
            $task = $this->taskRepository->findByUserAndId($user, $id);
            $garden = $this->taskRepository->getGardenByUser($user);

            if (!$task || !$garden) {
                return null;
            }

            if ($task->is_completed) {
                return null;
            }

            $rewardMap = [
                'easy' => ['exp' => 10, 'hp' => 5],
                'medium' => ['exp' => 20, 'hp' => 10],
                'hard' => ['exp' => 30, 'hp' => 15],
            ];

            $reward = $rewardMap[$task->difficulty] ?? $rewardMap['easy'];
            $expGain = $reward['exp'];
            $hpGain = $reward['hp'];

            $maxHp = 100;
            $currentHp = (int) ($garden->hp ?? $maxHp);
            $newHp = min($maxHp, $currentHp + $hpGain);

            $updatedGarden = $this->taskRepository->updateGarden($garden, [
                'exp' => ((int) $garden->exp) + $expGain,
                'hp' => $newHp,
            ]);

            $updatedTask = $this->taskRepository->markCompleted($task);

            return [
                'user' => $user,
                'task' => $updatedTask,
                'exp_gained' => $expGain,
                'hp_gained' => $newHp - $currentHp,
                'current_exp' => $updatedGarden->exp,
                'current_hp' => $updatedGarden->hp,
            ];
        });
    }
}