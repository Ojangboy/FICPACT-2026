<?php

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Test 1: Explicit hashing during creation via Repository
$repo = new UserRepository();
$username = "testuser_" . time();
$password = "secret123";

echo "Creating user: $username\n";
$user = $repo->create([
    'username' => $username,
    'email' => "$username@example.com",
    'password' => $password
]);

echo "Stored hash: " . $user->password . "\n";
if (Hash::check($password, $user->password)) {
    echo "SUCCESS: Creation hashing works.\n";
} else {
    echo "FAIL: Creation hashing failed.\n";
}

// Test 2: explicit hashing during update
echo "Updating password...\n";
$newPassword = "new_secret_456";
$user->password = Hash::make($newPassword);
$user->save();

$user->refresh();
if (Hash::check($newPassword, $user->password)) {
    echo "SUCCESS: Update hashing works.\n";
} else {
    echo "FAIL: Update hashing failed.\n";
}

// Cleanup
$user->delete();
echo "Test user deleted.\n";
