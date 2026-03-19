<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class GardenController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $garden = $user->garden;

        if (!$garden) {
            $garden = $user->garden()->create([
                'exp' => 0,
                'hp' => 100,
            ]);
        }

        return response()->json([
            'message' => 'Garden fetched successfully',
            'data' => $garden,
        ]);
    }
}