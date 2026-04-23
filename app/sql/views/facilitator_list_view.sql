-- View: facilitator_list_view
-- profiles + facilitator_profiles 조인을 캡슐화하여 퍼실리테이터 목록/카드/공개 프로필 페이지에서 단일 쿼리로 조회.

CREATE OR REPLACE VIEW public.facilitator_list_view AS
SELECT
  p.profile_id,
  p.name,
  p.avatar,
  p.created_at,
  p.updated_at,
  fp.bio,
  fp.introduction,
  fp.languages,
  fp.availability,
  fp.is_certified
FROM public.profiles AS p
INNER JOIN public.facilitator_profiles AS fp
  ON fp.profile_id = p.profile_id
WHERE p.role = 'facilitator';
