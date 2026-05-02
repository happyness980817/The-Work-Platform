import type { Route } from './+types/settings-page';
import { makeSSRClient } from '~/supa-client';
import {
  getLoggedInUserId,
  getUserById,
  getFacilitatorProfileById,
} from '../queries';
import {
  updateUser,
  updateUserAvatar,
  updateFacilitatorProfile,
  updatePassword,
} from '../mutations';
import ClientSettingsPage from '~/features/clients/users/pages/client-settings-page';
import FacilitatorSettingsPage from '~/features/facilitators/users/pages/facilitator-settings-page';
import { z } from 'zod';

export const meta: Route.MetaFunction = () => {
  return [
    { title: '설정 | The Work Platform' },
    { name: 'description', content: '프로필 설정 페이지' },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const user = await getUserById(userId, client);
  let facilitatorProfile = null;
  if (user.role === 'facilitator') {
    facilitatorProfile = await getFacilitatorProfileById(userId, client);
  }
  return { user, facilitatorProfile };
};

const profileFormSchema = z.object({
  name: z.string().min(1).max(100),
});

const facilitatorFormSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional().default(''),
  introduction: z.string().max(2000).optional().default(''),
  languages: z.string().optional().default(''),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '새 비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const user = await getUserById(userId, client);
  const formData = await request.formData();
  const intent = formData.get('intent');

  // 아바타 업로드
  if (intent === 'avatar') {
    const avatar = formData.get('avatar');
    if (avatar && avatar instanceof File) {
      if (avatar.size > 2 * 1024 * 1024 || !avatar.type.startsWith('image/')) {
        return {
          formErrors: {
            avatar: ['이미지 파일만 업로드 가능하며, 2MB 이하여야 합니다.'],
          },
        };
      }
      const { data, error } = await client.storage
        .from('avatars')
        .upload(`${userId}/${Date.now()}`, avatar, {
          contentType: avatar.type,
          upsert: false,
        });
      if (error) {
        return {
          formErrors: { avatar: ['아바타 업로드에 실패했습니다.'] },
        };
      }
      const {
        data: { publicUrl },
      } = client.storage.from('avatars').getPublicUrl(data.path);
      await updateUserAvatar(client, { id: userId, avatarUrl: publicUrl });
      return { ok: true };
    }
    return { formErrors: { avatar: ['파일을 선택해주세요.'] } };
  }

  // 비밀번호 변경
  if (intent === 'password') {
    const { success, error, data } = passwordFormSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!success) {
      return { formErrors: z.flattenError(error).fieldErrors };
    }
    // 현재 비밀번호 확인: 재로그인 시도
    const { error: signInError } = await client.auth.signInWithPassword({
      email: (await client.auth.getUser()).data.user?.email ?? '',
      password: data.currentPassword,
    });
    if (signInError) {
      return {
        formErrors: { currentPassword: ['현재 비밀번호가 올바르지 않습니다.'] },
      };
    }
    await updatePassword(client, { newPassword: data.newPassword });
    return { ok: true, passwordChanged: true };
  }

  // 프로필 수정 (client / facilitator)
  if (user.role === 'facilitator') {
    const { success, error, data } = facilitatorFormSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!success) {
      return { formErrors: z.flattenError(error).fieldErrors };
    }
    const languagesArray = data.languages
      ? data.languages
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean)
      : [];
    await updateUser(client, { id: userId, name: data.name });
    await updateFacilitatorProfile(client, {
      id: userId,
      bio: data.bio,
      introduction: data.introduction,
      languages: languagesArray,
    });
    return { ok: true };
  } else {
    const { success, error, data } = profileFormSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!success) {
      return { formErrors: z.flattenError(error).fieldErrors };
    }
    await updateUser(client, { id: userId, name: data.name });
    return { ok: true };
  }
};

export default function SettingsPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { user, facilitatorProfile } = loaderData;

  if (user.role === 'facilitator' && facilitatorProfile) {
    return (
      <FacilitatorSettingsPage
        user={user}
        facilitatorProfile={facilitatorProfile}
        actionData={actionData}
      />
    );
  }
  return <ClientSettingsPage user={user} actionData={actionData} />;
}
