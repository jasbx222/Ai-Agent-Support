<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = [];

        // إنشاء 10 مستخدمين

        User::create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin', // حدد الدور
        ]);

        // $users[] = $user;

        // إنشاء تذاكر
        // for ($i = 0; $i < 10; $i++) {
        //     Ticket::create([
        //         'user_id' => $users[$i]->id,
        //         'subject' => "تذكرة رقم " . ($i + 1),
        //         'description' => "هذا وصف التذكرة رقم " . ($i + 1),
        //         'status' => ['Open', 'Closed', 'Pending'][rand(0, 2)],
        //         'priority' => ['Low', 'Medium', 'High'][rand(0, 2)],
        //     ]);
        // }
    }
}
