import { DeleteActionModal, IconButton, Td, Tooltip, Tr } from "@app/components/v2";
import { useToggle } from "@app/hooks";
import { useDeleteUserSecret, useGetDetailedUserSecret } from "@app/hooks/api/userSecrets/mutations";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserSecretForm } from "./UserSecretForm";
import { useState } from "react";
import { useTranslation } from "react-i18next";


type UserSecretsRowProps = {
    id: string;
    name: string;
    type: string;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

export const UserSecretsRow = ({ id, name, type, onDelete, onEdit }: UserSecretsRowProps) => {
    const { t } = useTranslation();

    const { mutateAsync: deleteUserSecret } = useDeleteUserSecret();
    const { mutateAsync: getUserSecret } = useGetDetailedUserSecret();

    const [defaultValues, setDefaultValues] = useState({
        key: name,
        type,
    });

    const [isDeleteModalOpen, toggleDeleteModal] = useToggle();
    const [isEditModalOpen, toggleEditModal] = useToggle();

    const handleDeleteSecret = async () => {
        await deleteUserSecret({ id, });
        
        if (onDelete) {
            await onDelete(id);
        }

        toggleDeleteModal.off();
    }

    const openEditPopup = async () => {
        const response: any = await getUserSecret({ id });
        
        setDefaultValues({
            key: name,
            type,
            ...response.value,
        });

        toggleEditModal.on();
    }

    return (

        <Tr>
            <Td className="items-center">
                {name}
            </Td>
            <Td className="items-center">
                <div className="group flex w-full cursor-text items-center space-x-2">
                    <div className="flex-grow border-r border-r-mineshaft-600 pr-2 pl-1">
                    {t(`user-secrets.types.${type}`)}
                    </div>
                    <div className="flex w-24 justify-center space-x-3 pl-2 transition-all">
                        <div className="opacity-0 group-hover:opacity-100">
                            <UserSecretForm
                                action="update"
                                onExecute={onEdit}
                                defaultValues={defaultValues}
                                id={id}
                                isOpen={isEditModalOpen}
                                onTogglePopUp={toggleEditModal.toggle}
                                onClose={toggleEditModal.off}
                            />
                            <Tooltip content="Edit">
                                <IconButton
                                    variant="plain"
                                    ariaLabel="edit-value"
                                    className="h-full"
                                    onClick={openEditPopup}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100">
                            <DeleteActionModal
                                isOpen={isDeleteModalOpen}
                                onClose={toggleDeleteModal.off}
                                title="Do you want to delete the selected secret?"
                                deleteKey="delete"
                                onDeleteApproved={handleDeleteSecret}
                            />
                            <Tooltip content="Delete">
                                <IconButton
                                    variant="plain"
                                    ariaLabel="delete-value"
                                    className="h-full"
                                    onClick={toggleDeleteModal.on}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </Td>
        </Tr>
    )
};