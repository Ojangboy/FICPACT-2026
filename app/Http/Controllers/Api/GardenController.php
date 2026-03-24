<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Gamification\GardenService;

class GardenController extends Controller
{
    protected GardenService $gardenService;

    public function __construct(GardenService $gardenService)
    {
        $this->gardenService = $gardenService;
    }

    public function show(Request $request)
    {
        $user   = $request->user();
        $result = $this->gardenService->applyDecay($user);

        return response()->json($result['data'], $result['status']);
    }
}
