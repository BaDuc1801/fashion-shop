import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { UploadFile } from 'antd';
import { useTranslation } from 'react-i18next';
import { resolveImageUrls, userService } from '@shared';
import type { UserFormValues } from '../schemas/userFormSchema';

type UseUpdateUserParams = {
  userId?: string;
  currentUserId?: string;
};

export const useUpdateUser = ({ userId, currentUserId }: UseUpdateUserParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UserFormValues) => {
      if (!userId) {
        throw new Error('Missing user id');
      }

      const avatarFiles = Array.isArray(values.avatar)
        ? (values.avatar as UploadFile[])
        : [];
      const imageUrls = await resolveImageUrls(avatarFiles);
      return userService.updateUser(userId, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: imageUrls[0],
        status: values.status ? 'active' : 'inactive',
      });
    },
    onSuccess: async () => {
      message.success(t('admin.user.form.updateSuccess'));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['users'] }),
        queryClient.invalidateQueries({
          queryKey: ['users', 'detail-by-id', currentUserId ?? userId],
        }),
      ]);
    },
    onError: () => {
      message.error(t('admin.user.form.updateFailed'));
    },
  });
};
