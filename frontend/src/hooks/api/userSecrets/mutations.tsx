import { MutationOptions, useMutation } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";
import { TCreateUserSecret, TDeleteUserSecret, TGetUserSecret, TUpdateUserSecret, TUserSecret } from "./types";
import { createNotification } from "@app/components/notifications";

export const useCreateUserSecret = ({
  options
}: {
  options?: Omit<MutationOptions<{}, {}, TCreateUserSecret>, "mutationFn">;
} = {}) => {
  return useMutation<{}, {}, TCreateUserSecret>({
    mutationFn: async (body) => {
      const { data } = await apiRequest.post(`/api/v1/user-secrets`, body);
      return data;
    },
    onSuccess: (_, response) => {
      createNotification({
        type: "success",
        text: `User Secret "${response.key}" is created successfully`,
      });
    },
    ...options
  });
};

export const useDeleteUserSecret = ({
  options
}: {
  options?: Omit<MutationOptions<{}, {}, TDeleteUserSecret>, "mutationFn">;
} = {}) => {
  return useMutation<{}, {}, TDeleteUserSecret>({
    mutationFn: async ({ id }) => {
      const { data } = await apiRequest.delete(`/api/v1/user-secrets/${id}`);
      return data;
    },
    onSuccess: (_, response) => {
      createNotification({
        type: "success",
        text: `User Secret is deleted successfully`,
      });
    },
    ...options
  });
};

export const useUpdateUserSecret = ({
  options
}: {
  options?: Omit<MutationOptions<{}, {}, TUpdateUserSecret>, "mutationFn">;
} = {}) => {
  return useMutation<{}, {}, TUpdateUserSecret>({
    mutationFn: async ({ id, ...body }) => {
      const { data } = await apiRequest.patch(`/api/v1/user-secrets/${id}`, body);
      return data;
    },
    onSuccess: (_, response) => {
      createNotification({
        type: "success",
        text: `User Secret "${response.key}" has beedn updated successfully`,
      });
    },
    ...options
  });
};

export const useGetDetailedUserSecret = ({
  options
}: {
  options?: Omit<MutationOptions<{}, {}, TGetUserSecret>, "mutationFn">;
} = {}) => {
  return useMutation<{}, {}, TGetUserSecret>({
    mutationFn: async ({ id }) => {
      const { data } = await apiRequest.get(`/api/v1/user-secrets/${id}`);
      return data as TUserSecret;
    },
    onSuccess: (_, response) => {
      console.log(response);
    },
    ...options
  });
};
