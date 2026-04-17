<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Registered successfully.',
            'data' => [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->email, $request->password);

        if (! $result) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials.',
                'data' => null,
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logged in successfully.',
            'data' => [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout(auth()->user());

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully.',
            'data' => null,
        ]);
    }
}
