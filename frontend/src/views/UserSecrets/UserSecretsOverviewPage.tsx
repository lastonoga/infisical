import { useState } from "react";
import {
    faFolderBlank,
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    Button,
    EmptyState,
    Pagination,
    Table,
    TableContainer,
    TableSkeleton,
    TBody,
    Td,
    Th,
    THead,
    Tr
} from "@app/components/v2";
import { usePagination, usePopUp, useResetPageHelper } from "@app/hooks";
import { DashboardSecretsOrderBy } from "@app/hooks/api/dashboard/types";
import { UserSecretForm } from "./components/UserSecretForm";
import { UserSecretsRow } from "./components/UserSecretsRow";
import { useGetSecretsOverview } from "@app/hooks/api/userSecrets/queries";

export const UserSecretsOverviewPage = () => {
    const [_, setScrollOffset] = useState(0);

    const { handlePopUpOpen, handlePopUpToggle, handlePopUpClose, popUp } = usePopUp([
        "addUsersSecret",
        "updateUsersSecret"
    ] as const);

    const {
        offset,
        limit,
        setPage,
        perPage,
        page,
        setPerPage,
    } = usePagination<DashboardSecretsOrderBy>(DashboardSecretsOrderBy.Name);

    const { isLoading: isOverviewLoading, data: overview, refetch } = useGetSecretsOverview({
        limit,
        offset
    });

    const {
        userSecrets,
        totalCount = 0,
    } = overview ?? {};

    useResetPageHelper({
        totalCount,
        offset,
        setPage
    });

    const refreshTable = () => {
        refetch();
    }

    const isTableEmpty = userSecrets?.length === 0 && !isOverviewLoading;

    return (
        <>
            <div className="container mx-auto px-6 text-mineshaft-50 dark:[color-scheme:dark]">
                <div className="space-y-8">
                    <div className="mt-6">
                        <p className="text-3xl font-semibold text-bunker-100">User Secrets Overview</p>
                        <p className="text-md text-bunker-300">
                            Explore and manage your user secrets
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div></div>
                        <div className="flex flex-row items-center justify-center space-x-2">
                            <Button
                                variant="outline_bg"
                                leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={() => handlePopUpOpen("addUsersSecret")}
                                className="h-10 rounded"
                            >
                                Add Secret
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="thin-scrollbar mt-4">
                    <TableContainer
                        onScroll={(e) => setScrollOffset(e.currentTarget.scrollLeft)}
                        className="thin-scrollbar"
                    >
                        <Table>
                            <THead>
                                <Tr className="sticky top-0 z-20 border-0">
                                    <Th className="sticky top-0 z-20 border-0 bg-mineshaft-800 p-0">
                                        <div className="flex items-center border-b border-r border-mineshaft-600 pr-5 pl-3 pt-3.5 pb-3">
                                            Name
                                        </div>
                                    </Th>
                                    <Th className="sticky top-0 z-20 border-0 bg-mineshaft-800 p-0">
                                        <div className="flex items-center border-b border-r border-mineshaft-600 pr-5 pl-3 pt-3.5 pb-3">
                                            Type
                                        </div>
                                    </Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {isOverviewLoading && (
                                    <TableSkeleton
                                        columns={2}
                                        innerKey="secret-overview-loading"
                                        rows={5}
                                        className="bg-mineshaft-700"
                                    />
                                )}

                                {/* Content */}
                                {userSecrets?.map((secret) => (
                                    <UserSecretsRow
                                        key={secret.id}
                                        id={secret.id}
                                        name={secret.key}
                                        type={secret.type}
                                        onDelete={refreshTable}
                                        onEdit={refreshTable}
                                    />
                                ))}

                                {isTableEmpty && !isOverviewLoading && (
                                    <Tr>
                                        <Td colSpan={2}>
                                            <EmptyState
                                                title={"Let's add some secrets"}
                                                icon={faFolderBlank}
                                                iconSize="3x"
                                            >
                                                <Button
                                                    className="mt-4"
                                                    variant="outline_bg"
                                                    colorSchema="primary"
                                                    size="md"
                                                    onClick={() => handlePopUpOpen("addUsersSecret")}
                                                >
                                                    Add Secrets
                                                </Button>
                                            </EmptyState>
                                        </Td>
                                    </Tr>
                                )}
                            </TBody>
                        </Table>
                    </TableContainer>
                    {!isOverviewLoading && totalCount > 0 && (
                        <Pagination
                            className="rounded-b-md border-t border-solid border-t-mineshaft-600"
                            count={totalCount}
                            page={page}
                            perPage={perPage}
                            onChangePage={(newPage) => setPage(newPage)}
                            onChangePerPage={(newPerPage) => setPerPage(newPerPage)}
                        />
                    )}
                </div>
            </div>
            <UserSecretForm
                action="create"
                onExecute={refreshTable}
                isOpen={popUp.addUsersSecret.isOpen}
                onTogglePopUp={(isOpen) => handlePopUpToggle("addUsersSecret", isOpen)}
                onClose={() => handlePopUpClose("addUsersSecret")}
            />
        </>
    );
};
