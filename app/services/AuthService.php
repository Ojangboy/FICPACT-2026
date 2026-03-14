<?php
namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthService {
    public function Login(Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8'
        ]);

        if(!Auth::attempt($credentials)) {
            return response([
                'message' => 'invalid credentials'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function Register(Request $request) {
        $credentials = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed'
        ]);

        if(User::where('email', $credentials['email'])->exists()) {
            return response([
                'message' => 'email already exists'
            ], 400);
        }

        $user = User::create([
            'name' => $credentials['name'],
            'email' => $credentials['email'],
            'password' => bcrypt($credentials['password'])
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function Logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response([
            'message' => 'Logout successful'
        ], 200);
    }   
}