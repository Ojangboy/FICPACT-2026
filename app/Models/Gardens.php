<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gardens extends Model
{
    protected $fillable = [
        'user_id',
        'plant_stage',
        'hp',
        'last_decay_check'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
