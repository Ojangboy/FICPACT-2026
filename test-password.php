<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = User::first();
if (!$user) {
    echo "No user found\n";
    exit;
}

echo "Testing user: {$user->username}\n";
$oldPass = $user->password;

$newPassRaw = "newpassword123";
$user->password = $newPassRaw;
$user->save();

$user->refresh();
$newPassHashed = $user->password;

if ($oldPass === $newPassHashed) {
    echo "FAIL: Password did not change in DB!\n";
} else {
    echo "SUCCESS: Password changed in DB.\n";
    if (Hash::check($newPassRaw, $newPassHashed)) {
        echo "SUCCESS: Hash::check passed for new password.\n";
    } else {
        echo "FAIL: Hash::check failed for new password. Double hashing?\n";
    }
}
