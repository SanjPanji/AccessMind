-- Supabase PostgreSQL schema for AccessMind application
-- Generated based on frontend data models

-- Users (if applicable, can be extended later)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    teacher TEXT NOT NULL,
    average NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assignments (Lessons)
CREATE TABLE IF NOT EXISTS public.assignments (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('homework','quiz','exam','participation')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Grades per assignment and date
CREATE TABLE IF NOT EXISTS public.grades (
    id SERIAL PRIMARY KEY,
    assignment_id INT NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    grade_date DATE NOT NULL,
    value NUMERIC(5,2) NOT NULL,
    max_value NUMERIC(5,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('homework','quiz','exam','participation')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (assignment_id, grade_date)
);

-- Attendance records
CREATE TABLE IF NOT EXISTS public.attendance (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    time_range TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present','absent','late')),
    teacher TEXT NOT NULL,
    room TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('grade','assignment','deadline','system')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional: linking notifications to users
CREATE TABLE IF NOT EXISTS public.user_notifications (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    notification_id INT NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, notification_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_grades_assignment_id ON public.grades (assignment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_subject_id ON public.attendance (subject_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications (type);

-- Enable Row Level Security for Supabase
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Policies can be added later according to auth requirements.
