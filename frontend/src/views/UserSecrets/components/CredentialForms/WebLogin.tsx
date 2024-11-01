import { FormControl, Input } from "@app/components/v2";
import { InfisicalSecretInput } from "@app/components/v2/InfisicalSecretInput";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const WebLogin = ({ control, errors, isView = false }: any) => {
    const { t } = useTranslation();
    const fields = ['username', 'password'];

    return (
        <div>
            {fields.map((fieldName) => (
                <Controller
                    control={control}
                    name={fieldName}
                    key={fieldName}
                    render={({ field }) => (
                        <FormControl
                            label={t(`user-secrets.fields.${fieldName}`)}
                            isError={Boolean(errors[fieldName])}
                            errorText={errors[fieldName]?.message}
                        >
                            {isView ? (
                                <Input
                                    {...field}
                                    isDisabled={isView}
                                />
                            ) : (
                                <InfisicalSecretInput
                                    {...field}
                                    required={true}
                                    disabled={isView}
                                    containerClassName="text-bunker-300 hover:border-primary-400/50 border border-mineshaft-600 bg-mineshaft-900 px-2 py-1.5"
                                />
                            )}
                        </FormControl>
                    )}
                />
            ))}
        </div>
    )
}

export const WebLoginFormSchema = z
    .object({
        username: z
            .string()
            .min(1, "Username is required"),
        password: z
            .string()
            .min(1, "Password is required")
    })
