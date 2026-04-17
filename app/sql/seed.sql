-- =============================================================
-- seed.sql
-- Supabase SQL Editor 에 붙여넣고 실행하세요.
-- profiles.profile_id → auth.users FK 를 우회하기 위해
-- session_replication_role = 'replica' 를 사용합니다.
-- 유저 본인 프로필(93b65d21-...) 은 이미 존재하므로 건드리지 않습니다.
-- =============================================================

-- ── 0. 기존 seed 데이터 초기화 (재실행 안전) ─────────────────
DELETE FROM public.dm_messages      WHERE message_id::text LIKE 'dd0000%';
DELETE FROM public.dm_room_members  WHERE member_id::text  LIKE 'd00000%';
DELETE FROM public.dm_rooms         WHERE room_id::text    LIKE 'b00000%';
DELETE FROM public.session_messages WHERE message_id::text LIKE 'e00000%';
DELETE FROM public.session_rooms    WHERE session_id::text LIKE 'a00000%';
DELETE FROM public.facilitator_profiles WHERE profile_id::text LIKE 'f10000%';
DELETE FROM public.client_profiles      WHERE profile_id::text LIKE 'c10000%';
DELETE FROM public.profiles
  WHERE profile_id::text LIKE 'f10000%'
     OR profile_id::text LIKE 'c10000%';

-- ── 1. profiles (auth.users FK 우회) ────────────────────────
SET session_replication_role = 'replica';

INSERT INTO public.profiles (profile_id, role, name, avatar, is_editor, created_at, updated_at) VALUES
-- facilitators (facilitators.ts 기준)
('f1000001-0000-0000-0000-000000000001', 'facilitator', 'Sarah Jenkins',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXh6AuGuTwRu_SVMeV_O2NOB3mGLJxzoF9XCWWWe5WN8vX2IQao-efhpJ6weRRdkSzqpB_w848n6wlL5_KU_8Q7nxy_1Gtaw4s-HeiUOBj7O2r8V1nqDNoxZOb9j5VLSBOEv1eXZVu84bjfLHSt1RyDc5N4SCVBhvFvDu-sm1Yug1y9qIb2px-nRNtFFUSE6UJ9HdAUGfs8d9yf6o60NUr7b7ekhpcPWit0x20EtmcdaJLOAPLJH5-4soyAyypJGNKx8loua8gAFk',
 false, NOW(), NOW()),
('f1000002-0000-0000-0000-000000000002', 'facilitator', 'David Chen',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg99Qg2t1f76JWwizho_6u2fyEx6H3sKvYETKM3qz9tc2ok52lolYs6EhYwpDLUN96wBt331PIMMrOStdrth64EekfMQY55kH8YCuvcXGa2dfUxhapdp5M40uJXEOHHMRmrSA46dUjTTi18vKHDWP5xLtkWcR4ulix_2rqo0yQrjQ966axiBGGyrxNrm_0rbMh7CktgCQFsUQv3DuZXRaqRyPpjOVvKCmlGP3jQG2CW85EuyDbSoudC89b9V3wh8zUcibKjfEVGjQ',
 false, NOW(), NOW()),
('f1000003-0000-0000-0000-000000000003', 'facilitator', 'Elena Rodriguez',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-uOWDUXKLFU-Z3Kud1ZZAHcAG0W44HHmXsiUzCTKeD8LJaJeh1Ee3kRYICqxhmkbGfQyJX8ZuUoreLio9AZIfKgZOn1tzsn6dS9_2drM1D6KrWTMs-jfZyBk7HYcwXA2D59sqAuoRznsX7GU0JP8ejiE5WvOzUjFl2v1xQFEKbL2deioADuXMJW7FoY52hH99Yk7m93A8i9b0oOzrOtbWvStnqoaMV_hNdX_q_N1-YYVP6a171nMYstln8nz2qo93KRaA0ZQ5UFo',
 false, NOW(), NOW()),
('f1000004-0000-0000-0000-000000000004', 'facilitator', 'Marcus Johnson',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEijL7b4QAFlTggev8E_kgqbNEehkNrDCIUKpfXjTZTU7TBscLcQn1rk2P4Nf-fDYheEcFoSHLF0UQjhtf8a2voqYpvJithCg_k0TWUNxCsOUtwfu3P8M6qvVsQ0-6t2KAWEwNEAxTNlyDZa9s5iqEJ94CEcyWlexF2R3oueH-LfnmIBvlK1e_Yo5wTd5t2kCWy37h6q0M6WakVQ7xFIfuYdh-yx8b9y_CjPHzKi240ZfkH9QgaGPTOFKicxkwsoHOphJJ8dHV5o',
 false, NOW(), NOW()),
('f1000005-0000-0000-0000-000000000005', 'facilitator', 'Amara Patel',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz14KtqC0VKdu6SNx1NofYEJ5DoBkblzUV7uJnq-alSUca5JCfPOM404dslplvRdUw8W1IuUZ3MWjLmmrqYaiNX6J-bx3kdYrE4_TzWlTTxcrDN3WXJybpH17r8LqfHd399mD-NyF2c7nDgvheooQbkvv2ynIx-vijdZ6nOFVpPhgjDOwUwvDZkDePP0ivCMghJfat5FWQHmVzkqNjGPA3zSpTTQu2eSwsD5m9J3xJtWM8dPRMopecAtHBO4GxW16JspHqMWcRSrY',
 false, NOW(), NOW()),
('f1000006-0000-0000-0000-000000000006', 'facilitator', 'James Wilson',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxlZ1Ha0Su0iuokij8dIkuuc5X6XG18Vs846TIY3QPaSVUOfRW8p-RkLxcEnVV7wH-TMZHEe5WCzzksjR_Ew3I2X_y0AGVIoioIjAIvRQD6OyHisER40kKKRIKN8hOvW7q7D8STfJhbVyyzRh5UbIgeHUZkeYj4J0zRj9nOwyVn-gwNgvER-JxOkQ2gsXdcoN_wL4kpPS6x45EYoSbgfOqLdJmxZIKxioFkJ9fgZDp_qkZvdZxQLOfQ0LL4qf6MBtd9TDQGtHZhPg',
 false, NOW(), NOW()),
-- clients
('c1000001-0000-0000-0000-000000000001', 'client', 'Alice Kim',  NULL, false, NOW(), NOW()),
('c1000002-0000-0000-0000-000000000002', 'client', 'Bob Lee',    NULL, false, NOW(), NOW()),
('c1000003-0000-0000-0000-000000000003', 'client', 'Carol Park', NULL, false, NOW(), NOW()),
('c1000004-0000-0000-0000-000000000004', 'client', 'Dan Choi',   NULL, false, NOW(), NOW()),
('c1000005-0000-0000-0000-000000000005', 'client', 'Emily Oh',   NULL, false, NOW(), NOW());

SET session_replication_role = 'origin';

-- ── 2. facilitator_profiles ──────────────────────────────────
INSERT INTO public.facilitator_profiles (profile_id, bio, introduction, languages, availability, is_certified) VALUES
('93b65d21-f2ef-41db-8bc3-8e345d07471d',
 'Specializing in self-inquiry and inner transformation through The Work.',
 'I guide clients through Byron Katie''s four questions to find peace with any situation.',
 '["lang.ko", "lang.en"]', 'Weekdays 9am–6pm KST', true),
('f1000001-0000-0000-0000-000000000001',
 'Specializing in relationship conflicts and self-worth inquiries. I help clients apply The Work to dissolve painful beliefs about family dynamics.',
 'I help individuals untangle stressful thoughts using The Work. My sessions are direct, compassionate, and focused on finding your own truth.',
 '["lang.ko", "lang.en"]', 'Mon/Wed/Fri 10am–5pm', true),
('f1000002-0000-0000-0000-000000000002',
 'Deep experience with workplace stress and career transitions. Let''s question the thoughts that keep you stuck in professional anxiety.',
 'Deep experience with workplace stress and career transitions. Let''s question the thoughts that keep you stuck in professional anxiety.',
 '["lang.zh", "lang.en"]', 'Tue/Thu 9am–6pm', true),
('f1000003-0000-0000-0000-000000000003',
 'Gentle guidance for healing past traumas. I offer a safe space to do The Work on deep-seated beliefs and finding forgiveness.',
 'Gentle guidance for healing past traumas. I offer a safe space to do The Work on deep-seated beliefs and finding forgiveness.',
 '["lang.en", "lang.es"]', 'Weekdays 1pm–8pm EST', true),
('f1000004-0000-0000-0000-000000000004',
 'Focusing on addiction and recovery. The Work is a powerful tool for sobriety and understanding the mind''s cravings.',
 'Focusing on addiction and recovery. The Work is a powerful tool for sobriety and understanding the mind''s cravings.',
 '["lang.en"]', 'Mon–Sat 8am–4pm', false),
('f1000005-0000-0000-0000-000000000005',
 'Expert in marriage and partnership inquiries. Discover the love that is already present by questioning your judgments.',
 'Expert in marriage and partnership inquiries. Discover the love that is already present by questioning your judgments.',
 '["lang.hi", "lang.en"]', 'Weekdays 11am–7pm IST', true),
('f1000006-0000-0000-0000-000000000006',
 'Specializing in anxiety and body image issues. Learn to love what is, including yourself and your body.',
 'Specializing in anxiety and body image issues. Learn to love what is, including yourself and your body.',
 '["lang.en"]', 'Wed/Fri/Sat 10am–6pm', false);

-- ── 3. client_profiles ──────────────────────────────────────
INSERT INTO public.client_profiles (profile_id, bio) VALUES
('c1000001-0000-0000-0000-000000000001', 'Working through anxiety related to family relationships.'),
('c1000002-0000-0000-0000-000000000002', 'Seeking clarity on career stress and burnout.'),
('c1000003-0000-0000-0000-000000000003', 'Exploring grief and loss with The Work.'),
('c1000004-0000-0000-0000-000000000004', 'Interested in healing relationship patterns.'),
('c1000005-0000-0000-0000-000000000005', 'Looking to release chronic worry and overthinking.');

-- ── 4. session_rooms ─────────────────────────────────────────
INSERT INTO public.session_rooms (session_id, room_code, openai_conversation_id, client_id, facilitator_id, session_number, is_active, started_at, ended_at, created_at) VALUES
('a0000001-0000-0000-0000-000000000001', 'ROOM-0001', NULL,
 'c1000001-0000-0000-0000-000000000001', '93b65d21-f2ef-41db-8bc3-8e345d07471d',
 1, false, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '1 hour', NOW() - INTERVAL '5 days'),
('a0000002-0000-0000-0000-000000000002', 'ROOM-0002', NULL,
 'c1000002-0000-0000-0000-000000000002', 'f1000001-0000-0000-0000-000000000001',
 1, false, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '90 minutes', NOW() - INTERVAL '4 days'),
('a0000003-0000-0000-0000-000000000003', 'ROOM-0003', NULL,
 'c1000003-0000-0000-0000-000000000003', 'f1000002-0000-0000-0000-000000000002',
 2, false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '1 hour', NOW() - INTERVAL '3 days'),
('a0000004-0000-0000-0000-000000000004', 'ROOM-0004', NULL,
 'c1000004-0000-0000-0000-000000000004', 'f1000003-0000-0000-0000-000000000003',
 1, true, NOW() - INTERVAL '1 hour', NULL, NOW() - INTERVAL '1 hour'),
('a0000005-0000-0000-0000-000000000005', 'ROOM-0005', NULL,
 'c1000005-0000-0000-0000-000000000005', 'f1000004-0000-0000-0000-000000000004',
 3, false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '75 minutes', NOW() - INTERVAL '1 day');

-- ── 5. session_messages ──────────────────────────────────────
INSERT INTO public.session_messages (message_id, session_id, sender_id, sender_type, content, created_at) VALUES
-- ROOM-0001
('e0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001',
 'c1000001-0000-0000-0000-000000000001', 'client',
 'I feel so angry at my mother. She never listens to me.', NOW() - INTERVAL '5 days'),
('e0000002-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001',
 '93b65d21-f2ef-41db-8bc3-8e345d07471d', 'facilitator',
 'Is it true that she never listens to you?', NOW() - INTERVAL '5 days' + INTERVAL '2 minutes'),
('e0000003-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001',
 'c1000001-0000-0000-0000-000000000001', 'client',
 'Well... sometimes she does, but mostly no.', NOW() - INTERVAL '5 days' + INTERVAL '4 minutes'),
-- ROOM-0002
('e0000004-0000-0000-0000-000000000004', 'a0000002-0000-0000-0000-000000000002',
 'c1000002-0000-0000-0000-000000000002', 'client',
 'My boss thinks I am incompetent. It is ruining my confidence.', NOW() - INTERVAL '4 days'),
('e0000005-0000-0000-0000-000000000005', 'a0000002-0000-0000-0000-000000000002',
 'f1000001-0000-0000-0000-000000000001', 'facilitator',
 'Can you absolutely know that your boss thinks you are incompetent?', NOW() - INTERVAL '4 days' + INTERVAL '2 minutes'),
('e0000006-0000-0000-0000-000000000006', 'a0000002-0000-0000-0000-000000000002',
 'c1000002-0000-0000-0000-000000000002', 'client',
 'No, I cannot know for sure. I am just assuming.', NOW() - INTERVAL '4 days' + INTERVAL '5 minutes'),
-- ROOM-0003
('e0000007-0000-0000-0000-000000000007', 'a0000003-0000-0000-0000-000000000003',
 'c1000003-0000-0000-0000-000000000003', 'client',
 'I should not have left my last job. I regret it every day.', NOW() - INTERVAL '3 days'),
('e0000008-0000-0000-0000-000000000008', 'a0000003-0000-0000-0000-000000000003',
 'f1000002-0000-0000-0000-000000000002', 'facilitator',
 'How do you react when you believe the thought "I should not have left my job"?', NOW() - INTERVAL '3 days' + INTERVAL '3 minutes'),
-- ROOM-0004 (active)
('e0000009-0000-0000-0000-000000000009', 'a0000004-0000-0000-0000-000000000004',
 'c1000004-0000-0000-0000-000000000004', 'client',
 'My partner does not appreciate anything I do.', NOW() - INTERVAL '50 minutes'),
('e0000010-0000-0000-0000-000000000010', 'a0000004-0000-0000-0000-000000000004',
 'f1000003-0000-0000-0000-000000000003', 'facilitator',
 'Who would you be without the thought that your partner does not appreciate you?', NOW() - INTERVAL '45 minutes'),
-- ROOM-0005
('e0000011-0000-0000-0000-000000000011', 'a0000005-0000-0000-0000-000000000005',
 'c1000005-0000-0000-0000-000000000005', 'client',
 'I am not good enough. I have always believed this.', NOW() - INTERVAL '1 day'),
('e0000012-0000-0000-0000-000000000012', 'a0000005-0000-0000-0000-000000000005',
 'f1000004-0000-0000-0000-000000000004', 'facilitator',
 'Turn it around — "I am good enough." Can you find three genuine examples?', NOW() - INTERVAL '1 day' + INTERVAL '3 minutes');

-- ── 6. dm_rooms ──────────────────────────────────────────────
INSERT INTO public.dm_rooms (room_id, created_at) VALUES
('b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '6 days'),
('b0000002-0000-0000-0000-000000000002', NOW() - INTERVAL '5 days'),
('b0000003-0000-0000-0000-000000000003', NOW() - INTERVAL '4 days'),
('b0000004-0000-0000-0000-000000000004', NOW() - INTERVAL '3 days'),
('b0000005-0000-0000-0000-000000000005', NOW() - INTERVAL '2 days');

-- ── 7. dm_room_members ───────────────────────────────────────
INSERT INTO public.dm_room_members (member_id, room_id, profile_id, joined_at) VALUES
('d0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', '93b65d21-f2ef-41db-8bc3-8e345d07471d', NOW() - INTERVAL '6 days'),
('d0000002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000001', NOW() - INTERVAL '6 days'),
('d0000003-0000-0000-0000-000000000003', 'b0000002-0000-0000-0000-000000000002', 'f1000001-0000-0000-0000-000000000001', NOW() - INTERVAL '5 days'),
('d0000004-0000-0000-0000-000000000004', 'b0000002-0000-0000-0000-000000000002', 'c1000002-0000-0000-0000-000000000002', NOW() - INTERVAL '5 days'),
('d0000005-0000-0000-0000-000000000005', 'b0000003-0000-0000-0000-000000000003', 'f1000002-0000-0000-0000-000000000002', NOW() - INTERVAL '4 days'),
('d0000006-0000-0000-0000-000000000006', 'b0000003-0000-0000-0000-000000000003', 'c1000003-0000-0000-0000-000000000003', NOW() - INTERVAL '4 days'),
('d0000007-0000-0000-0000-000000000007', 'b0000004-0000-0000-0000-000000000004', 'f1000003-0000-0000-0000-000000000003', NOW() - INTERVAL '3 days'),
('d0000008-0000-0000-0000-000000000008', 'b0000004-0000-0000-0000-000000000004', 'c1000004-0000-0000-0000-000000000004', NOW() - INTERVAL '3 days'),
('d0000009-0000-0000-0000-000000000009', 'b0000005-0000-0000-0000-000000000005', 'f1000004-0000-0000-0000-000000000004', NOW() - INTERVAL '2 days'),
('d000000a-0000-0000-0000-000000000010', 'b0000005-0000-0000-0000-000000000005', 'c1000005-0000-0000-0000-000000000005', NOW() - INTERVAL '2 days');

-- ── 8. dm_messages ───────────────────────────────────────────
INSERT INTO public.dm_messages (message_id, room_id, sender_id, content, created_at) VALUES
-- room 1
('dd000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', '93b65d21-f2ef-41db-8bc3-8e345d07471d', 'Hi Alice, how are you feeling after our last session?', NOW() - INTERVAL '6 days' + INTERVAL '5 minutes'),
('dd000002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'c1000001-0000-0000-0000-000000000001', 'Much better, thank you. I have been journaling every day.', NOW() - INTERVAL '6 days' + INTERVAL '10 minutes'),
('dd000003-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', '93b65d21-f2ef-41db-8bc3-8e345d07471d', 'That is wonderful. See you next week.', NOW() - INTERVAL '6 days' + INTERVAL '12 minutes'),
-- room 2
('dd000004-0000-0000-0000-000000000004', 'b0000002-0000-0000-0000-000000000002', 'f1000001-0000-0000-0000-000000000001', 'Hello Bob. Just checking in before our session tomorrow.', NOW() - INTERVAL '5 days' + INTERVAL '3 minutes'),
('dd000005-0000-0000-0000-000000000005', 'b0000002-0000-0000-0000-000000000002', 'c1000002-0000-0000-0000-000000000002', 'Thanks Sarah, I have my worksheet ready.', NOW() - INTERVAL '5 days' + INTERVAL '8 minutes'),
-- room 3
('dd000006-0000-0000-0000-000000000006', 'b0000003-0000-0000-0000-000000000003', 'c1000003-0000-0000-0000-000000000003', 'Is it possible to reschedule to Friday?', NOW() - INTERVAL '4 days' + INTERVAL '2 minutes'),
('dd000007-0000-0000-0000-000000000007', 'b0000003-0000-0000-0000-000000000003', 'f1000002-0000-0000-0000-000000000002', 'Of course, Friday at 2pm works for me.', NOW() - INTERVAL '4 days' + INTERVAL '15 minutes'),
-- room 4
('dd000008-0000-0000-0000-000000000008', 'b0000004-0000-0000-0000-000000000004', 'f1000003-0000-0000-0000-000000000003', 'Great session today, Dan. You showed real courage.', NOW() - INTERVAL '3 days' + INTERVAL '5 minutes'),
('dd000009-0000-0000-0000-000000000009', 'b0000004-0000-0000-0000-000000000004', 'c1000004-0000-0000-0000-000000000004', 'Thank you Elena. The turnaround really shifted something for me.', NOW() - INTERVAL '3 days' + INTERVAL '20 minutes'),
-- room 5
('dd00000a-0000-0000-0000-000000000010', 'b0000005-0000-0000-0000-000000000005', 'c1000005-0000-0000-0000-000000000005', 'I want to work on the belief "I am not lovable" next time.', NOW() - INTERVAL '2 days' + INTERVAL '4 minutes'),
('dd00000b-0000-0000-0000-000000000011', 'b0000005-0000-0000-0000-000000000005', 'f1000004-0000-0000-0000-000000000004', 'Perfect. That is powerful work. I will prepare some questions.', NOW() - INTERVAL '2 days' + INTERVAL '9 minutes');
