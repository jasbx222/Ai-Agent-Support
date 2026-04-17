<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Agent Nexus',
            'email' => 'nexus@example.com',
        ]);

        \App\Models\Ticket::create([
            'user_id' => $user->id,
            'subject' => 'نظام تجريبي',
            'description' => 'تذكرة تجريبية لاختبار نظام الذكاء الاصطناعي',
            'status' => 'Open',
            'priority' => 'Medium',
        ]);
    }
}
