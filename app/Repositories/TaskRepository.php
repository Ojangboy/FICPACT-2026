<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Tasks;
use App\Models\Gardens;

class TaskRepository
{
    public function getAllByUser(User $user)
    {
        return $user->tasks()->latest()->get();
    }

    public function createForUser(User $user, array $data): Tasks
    {
        return $user->tasks()->create($data);
    }

    public function findByUserAndId(User $user, $id): ?Tasks
    {
        return $user->tasks()->find($id);
    }

    public function getDifficulty(User $user): ?Tasks
    {
        return $user->tasks()->where('is_completed', false)->first();
    }

    public function updateTask(Tasks $task, array $data): Tasks
    {
        $task->update($data);
        return $task->fresh();
    }

    public function deleteTask(Tasks $task): bool
    {
        return (bool) $task->delete();
    }

    public function markCompleted(Tasks $task): Tasks
    {
        $task->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);

        return $task->fresh();
    }
}