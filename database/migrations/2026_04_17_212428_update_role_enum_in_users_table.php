<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE users ALTER COLUMN role DROP DEFAULT");

        DB::statement("DROP TYPE IF EXISTS user_role");

        DB::statement("CREATE TYPE user_role AS ENUM ('user', 'admin', 'employee')");

        DB::statement("
            ALTER TABLE users
            ALTER COLUMN role TYPE user_role
            USING role::text::user_role
        ");

        DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users ALTER COLUMN role DROP DEFAULT");

        DB::statement("DROP TYPE IF EXISTS user_role_old");

        DB::statement("CREATE TYPE user_role_old AS ENUM ('user', 'admin')");

        DB::statement("
            ALTER TABLE users
            ALTER COLUMN role TYPE user_role_old
            USING role::text::user_role_old
        ");

        DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'");

        DB::statement("DROP TYPE IF EXISTS user_role");
    }
};
