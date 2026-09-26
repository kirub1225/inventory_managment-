<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Default Landing Page Redirect
Route::get('/', function () {
    return redirect('/admin/dashboard');
});

// -----------------------------------------------------------------------------
// MODULE 1: SUPER ADMIN PORTAL (admin.yoursaas.com)
// -----------------------------------------------------------------------------
Route::get('/admin/dashboard', function () {
    return Inertia::render('SuperAdmin/Dashboard');
})->name('admin.dashboard');

Route::get('/admin/companies', function () {
    return Inertia::render('SuperAdmin/Companies');
})->name('admin.companies');

// -----------------------------------------------------------------------------
// MODULE 2: COMPANY ADMIN DASHBOARD (company.yoursaas.com)
// -----------------------------------------------------------------------------
Route::get('/company/home', function () {
    return Inertia::render('Company/Home');
})->name('company.home');

Route::get('/admin/home', function () {
    return Inertia::render('Company/Home');
});

Route::get('/company/branches', function () {
    return Inertia::render('Company/Branches');
})->name('company.branches');

Route::get('/admin/branches', function () {
    return Inertia::render('Company/Branches');
});

Route::get('/company/products', function () {
    return Inertia::render('Company/Products');
})->name('company.products');

Route::get('/admin/products', function () {
    return Inertia::render('Company/Products');
});

Route::get('/company/products/{id}/batches', function ($id) {
    return Inertia::render('Company/Batches', ['productId' => $id]);
})->name('company.products.batches');

Route::get('/admin/products/{id}/batches', function ($id) {
    return Inertia::render('Company/Batches', ['productId' => $id]);
});

Route::get('/company/sellers', function () {
    return Inertia::render('Company/Sellers');
})->name('company.sellers');

Route::get('/admin/sellers', function () {
    return Inertia::render('Company/Sellers');
});

Route::get('/company/sales', function () {
    return Inertia::render('Company/Sales');
})->name('company.sales');

Route::get('/admin/sales', function () {
    return Inertia::render('Company/Sales');
});

// -----------------------------------------------------------------------------
// MODULE 3: SELLER / POS TERMINAL (company.yoursaas.com/pos)
// -----------------------------------------------------------------------------
Route::get('/pos', function () {
    return Inertia::render('POS/Checkout');
})->name('pos.checkout');

Route::get('/pos/my-sales', function () {
    return Inertia::render('POS/MySales');
})->name('pos.my-sales');
