<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Services\AuthService;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function Login(Request $request)
    {
        $user = $this->authService->Login($request);

        return response()->json($user);
    }

    public function Register(Request $request)
    {
        $user = $this->authService->Register($request);

        return response()->json($user);
    }   

    public function Logout(Request $request)
    {
        $user = $this->authService->Logout($request);

        return response()->json($user);
    }  
}
