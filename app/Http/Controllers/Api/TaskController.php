<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Services\Task\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index()
    {
        $result = $this->taskService->getAllTasks();
        return response()->json($result['data'], $result['status']);
    }

    public function store(StoreTaskRequest $request)
    {
        $result = $this->taskService->createTask($request->validated());
        return response()->json($result['data'], $result['status']);
    }

    public function show($id)
    {
        $result = $this->taskService->getTaskById($id);

        if (!$result) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($result['data'], $result['status']);
    }

    public function update(UpdateTaskRequest $request, $id)
    {
        $result = $this->taskService->updateTask($request->validated(), $id);

        if (!$result) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($result['data'], $result['status']);
    }

    public function destroy($id)
    {
        $result = $this->taskService->deleteTask($id);

        if (!$result) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($result['data'], $result['status']);
    }

    public function complete($id)
    {
        $result = $this->taskService->markTaskAsComplete($id);

        if (!$result) {
            return response()->json(['message' => 'Task not found or already completed'], 404);
        }

        return response()->json($result['data'], $result['status']);
    }
}
