<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
 public function up(): void
{
    DB::statement("CREATE TYPE user_role AS ENUM ('user', 'admin', 'employee')");
    DB::statement("ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::text::user_role");
    DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'");
}

    /**
     * Reverse the migrations.
     */
public function down(): void
{
    DB::statement("CREATE TYPE user_role_old AS ENUM ('user', 'admin')");
    DB::statement("ALTER TABLE users ALTER COLUMN role TYPE user_role_old USING role::text::user_role_old");
    DB::statement("DROP TYPE user_role");
}
};
