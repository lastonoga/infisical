import { FormControl } from "@app/components/v2";
import { InfisicalSecretInput } from "@app/components/v2/InfisicalSecretInput";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const WebLogin = ({ control, errors }: any) => {
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
                            <InfisicalSecretInput
                                {...field}
                                required={true}
                                containerClassName="text-bunker-300 hover:border-primary-400/50 border border-mineshaft-600 bg-mineshaft-900 px-2 py-1.5"
                            />
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
            .min(3, "Username must be at least 3 characters long")
            .max(20, "Username cannot be more than 20 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(50, "Password cannot be more than 50 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[@$!%*?&]/, "Password must contain at least one special character")
    })
