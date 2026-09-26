<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with multi-tenant testing data.
     */
    public function run(): void
    {
        // 1. Super Admin Seed
        DB::table('users')->updateOrInsert(
            ['email' => 'root@yoursaas.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Company Admin Seed
        DB::table('users')->updateOrInsert(
            ['email' => 'alex@nexusretail.com'],
            [
                'name' => 'Alex Sterling',
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 3. Cashier / Seller Seed
        DB::table('users')->updateOrInsert(
            ['email' => 'sarah.j@nexusretail.com'],
            [
                'name' => 'Sarah Jenkins',
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
