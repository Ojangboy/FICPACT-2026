<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequests;
use App\Http\Requests\LoginRequests;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function Login(LoginRequests $request)
    {
        $result = $this->authService->Login($request->validated());
        return response()->json($result['data'], $result['status']);
    }

    public function Register(RegisterRequests $request)
    {
        $result = $this->authService->Register($request->validated());
        return response()->json($result['data'], $result['status']);
    }

    public function Logout(Request $request)
    {
        $result = $this->authService->Logout($request);
        return response()->json($result['data'], $result['status']);
    }
}