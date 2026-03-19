<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TaskService;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index()
    {
        $tasks = $this->taskService->getAllTasks();

        return response()->json([
            'message' => 'Tasks fetched successfully',
            'data' => $tasks,
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        $task = $this->taskService->createTask($request->validated());

        return response()->json([
            'message' => 'Task created successfully',
            'data' => $task,
        ], 201);
    }

    public function show($id)
    {
        $task = $this->taskService->getTaskById($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json([
            'message' => 'Task fetched successfully',
            'data' => $task,
        ]);
    }

    public function update(UpdateTaskRequest $request, $id)
    {
        $task = $this->taskService->updateTask($request->validated(), $id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json([
            'message' => 'Task updated successfully',
            'data' => $task,
        ]);
    }

    public function destroy($id)
    {
        $deleted = $this->taskService->deleteTask($id);

        if (!$deleted) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function complete($id)
    {
        $result = $this->taskService->markTaskAsComplete($id);

        if (!$result) {
            return response()->json(['message' => 'Task not found or already completed'], 404);
        }

        return response()->json([
            'message' => 'Task completed successfully',
            'data' => $result,
        ]);
    }
}