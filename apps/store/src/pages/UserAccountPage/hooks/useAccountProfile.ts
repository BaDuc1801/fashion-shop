import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { UploadFile } from 'antd';
import { useTranslation } from 'react-i18next';
import { resolveImageUrls, userService, useAuthStore } from '@shared';

export type AccountProfileFormValues = {
  avatar: UploadFile[];
  name: string;
  email: string;
  phone: string;
  address: string;
};

const ACCOUNT_PROFILE_QUERY_KEY = ['store', 'account-profile'];

export const useAccountProfile = () => {
  return useQuery({
    queryKey: ACCOUNT_PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await userService.getCurrentUser();
      return response;
    },
  });
};

export const mapProfileToFormValues = (
  profile: Awaited<ReturnType<typeof userService.getCurrentUser>> | undefined,
): AccountProfileFormValues => ({
  avatar: profile?.avatar
    ? [
        {
          uid: `${profile._id}-avatar`,
          name: `${profile.name}-avatar`,
          status: 'done',
          url: profile.avatar,
        } as UploadFile,
      ]
    : [],
  name: profile?.name ?? '',
  email: profile?.email ?? '',
  phone: profile?.phone ?? '',
  address: profile?.address ?? '',
});

export const useUpdateAccountProfile = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (values: AccountProfileFormValues) => {
      const userId = authUser?.userId;
      if (!userId) {
        throw new Error('Missing current user id');
      }

      const avatarUrls = await resolveImageUrls(values.avatar);
      return userService.updateUser(userId, {
        name: values.name.trim(),
        phone: values.phone.trim(),
        avatar: avatarUrls[0] ?? '',
        address: values.address.trim(),
      });
    },
    onSuccess: async (updatedUser) => {
      useAuthStore.getState().mergeUserFromMe(updatedUser);
      await queryClient.invalidateQueries({
        queryKey: ACCOUNT_PROFILE_QUERY_KEY,
      });
      message.success(t('account.profile.updateSuccess'));
    },
    onError: () => {
      message.error(t('account.profile.updateFailed'));
    },
  });
};
