<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TicketCollection;
use App\Http\Resources\UserResource;
use App\Services\AdminService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        protected AdminService $adminService
    ) {}

    public function overview(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Overview stats retrieved successfully.',
            'data' => $this->adminService->getStats(),
        ]);
    }

    public function tickets(Request $request): JsonResponse
    {
        $filters = $request->only(['status']);
        $tickets = $this->adminService->getAllTickets($filters);

        return response()->json([
            'status' => 'success',
            'message' => 'Tickets retrieved successfully.',
            'data' => new TicketCollection($tickets),
        ]);
    }

    public function users(): JsonResponse
    {
        $users = $this->adminService->getAllUsers();

        return response()->json([
            'status' => 'success',
            'message' => 'Users retrieved successfully.',
            'data' => UserResource::collection($users)->resource,
        ]);
    }
}
