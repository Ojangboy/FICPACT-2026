<?php

use App\Models\User;
use App\Services\Gamification\StreakService;
use Illuminate\Http\Request;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = User::first();
if (!$user) {
    echo "No user found\n";
    exit;
}

echo "Testing user: {$user->username}\n";
echo "Initial streak: {$user->streak_count}\n";

// Manually set streak to 5 and expired_at to 1 hour ago
$user->streak_count = 5;
$user->streak_expired_at = now()->subMinutes(61);
$user->save();

echo "Manually set streak to 5 and expired_at to " . $user->streak_expired_at . "\n";

// Mock a request and call UserController@getProfile
$streakService = app(StreakService::class);
$user = User::find($user->id); // Fresh instance

echo "Checking streak expiration...\n";
$user = $streakService->checkAndResetStreak($user);

echo "Final streak: {$user->streak_count}\n";

if ($user->streak_count == 0) {
    echo "SUCCESS: Streak correctly reset after expiration.\n";
} else {
    echo "FAIL: Streak did not reset!\n";
}
