import {
  useQuery,
} from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { GetUserSecretsDTO, TListUserSecrets } from "./types";

const fetchUserSecrets = async (offset: number, limit: number) => {
  const { data } = await apiRequest.get<TListUserSecrets>("/api/v1/user-secrets", {
    params: {
      limit,
      offset
    }
  });
  return data;
};


export const useGetSecretsOverview = (dto: GetUserSecretsDTO) =>
  useQuery({
    queryFn: () => fetchUserSecrets(dto.offset, dto.limit),
  });

