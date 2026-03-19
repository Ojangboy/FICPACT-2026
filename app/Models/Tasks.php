<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tasks extends Model
{
    protected $fillable = [
        'title',
        'description',
        'difficulty',
        'deadline',
        'is_completed'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
