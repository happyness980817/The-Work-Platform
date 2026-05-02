import type { Route } from './+types/profile-page';
import { makeSSRClient } from '~/supa-client';
import {
  getLoggedInUserId,
  getUserById,
  getFacilitatorProfileById,
} from '../queries';
import ClientProfilePage from '~/features/clients/users/pages/client-profile-page';
import FacilitatorProfilePage from '~/features/facilitators/users/pages/facilitator-profile-page';

export const meta: Route.MetaFunction = () => {
  return [
    { title: '내 프로필 | The Work Platform' },
    { name: 'description', content: '내 프로필 페이지' },
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

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
  const { user, facilitatorProfile } = loaderData;

  if (user.role === 'facilitator' && facilitatorProfile) {
    return (
      <FacilitatorProfilePage
        user={user}
        facilitatorProfile={facilitatorProfile}
      />
    );
  }
  return <ClientProfilePage user={user} />;
}
