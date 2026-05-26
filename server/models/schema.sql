-- Residential Apartment Society Management System Schema
-- Designed for PostgreSQL

-- Enable UUID extension if required
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Profiles Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Resident', 'Security')),
    gender VARCHAR(20),
    flat_no VARCHAR(20),
    phone VARCHAR(20),
    occupancy_status VARCHAR(30) DEFAULT 'Self-Occupied' CHECK (occupancy_status IN ('Self-Occupied', 'Rented', 'Vacant')),
    tenant_type VARCHAR(20) DEFAULT 'Family' CHECK (tenant_type IN ('Family', 'Bachelor')),
    owner_name VARCHAR(100),
    owner_phone VARCHAR(20),
    aadhaar_number VARCHAR(20),
    family_members INTEGER,
    family_member_names TEXT,
    vehicles TEXT,
    move_in_date DATE,
    lease_duration VARCHAR(50),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    profile_picture TEXT,
    has_pet BOOLEAN DEFAULT FALSE,
    pet_details VARCHAR(255),
    is_legacy_bachelor BOOLEAN DEFAULT FALSE,
    exemption_ref VARCHAR(100),
    police_verification_status VARCHAR(20) DEFAULT 'pending' CHECK (police_verification_status IN ('pending', 'verified', 'rejected')),
    police_verification_date DATE,
    noc_document_ref VARCHAR(200),
    bachelor_notes TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Notices Table (Broadcast Announcements)
CREATE TABLE IF NOT EXISTS notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Maintenance Bills Table
CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    resident_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
    billing_month VARCHAR(30) NOT NULL, -- e.g., 'May 2026'
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Complaints & Support Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., 'Plumbing', 'Electrical', 'Security'
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Visitor Logs Table (Gatekeeper Module)
CREATE TABLE IF NOT EXISTS visitor_logs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(20),
    purpose VARCHAR(150) NOT NULL, -- e.g., 'Delivery', 'Guest', 'Maintenance'
    flat_no VARCHAR(20) NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    check_out TIMESTAMP WITH TIME ZONE,
    logged_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- 6. RWA Committee Members Table
CREATE TABLE IF NOT EXISTS committee_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    flat_no VARCHAR(20),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. RWA Helplines Table
CREATE TABLE IF NOT EXISTS helplines (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    number VARCHAR(50) NOT NULL,
    note VARCHAR(200),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. RWA Gallery Events Table
CREATE TABLE IF NOT EXISTS gallery_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    image_url VARCHAR(300),
    event_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SEED DATA - Complete Mock Data for All Tables
-- =============================================
-- Note: Default passwords are 'password123' (hashed via bcrypt)
-- All user accounts: password123

-- Seed Users (schema.sql is run via initializeSchema, but seeding is done in db.js)
-- The INSERT statements below serve as a standalone fallback if running schema.sql directly via psql.
