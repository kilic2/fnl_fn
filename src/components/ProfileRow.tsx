import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    TableCell,
    TableRow,
    Avatar,
    Checkbox,
} from "flowbite-react";
import type { Profile } from "../types/Profile";
import { ProfileFormModal } from "./ProfileFormModal";
import { FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
    fetchProfiles: () => void;
    profile: Profile;
    handleClick: (profile: Profile) => void;
}

export const ProfileRow = ({ fetchProfiles, profile, handleClick }: Props) => {
    const [showDelete, setShowDelete] = useState(false);

    const handleAdminToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const newAdminStatus = profile.profileTypeId === 2 ? 1 : 2;
        
        api
            .patch(`/profiles/${profile.id}`, { profileTypeId: newAdminStatus })
            .then(() => {
                fetchProfiles();
                toast.success(newAdminStatus === 2 ? 'Kullanıcı admin yapıldı' : 'Admin yetkisi kaldırıldı');
            })
            .catch((err) => {
                console.error(err);
                toast.error('Admin durumu güncellenirken hata oluştu');
            });
    };

    return (
        <>
            <Modal
                show={showDelete}
                size="md"
                onClose={() => setShowDelete(false)}
                popup
            >
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Bu profili silmek istediğinize emin misiniz?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="red"
                                onClick={() => {
                                    api
                                        .delete(`/profiles/${profile.id}`)
                                        .then(() => {
                                            fetchProfiles();
                                            setShowDelete(false);
                                            toast.success("Profil silindi");
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                            toast.error("Bir hata oluştu");
                                        });
                                }}
                            >
                                Evet, eminim
                            </Button>
                            <Button color="alternative" onClick={() => setShowDelete(false)}>
                                Hayır, iptal
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <TableRow
                key={profile.id}
                className="cursor-pointer bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => handleClick(profile)}
            >
                <TableCell>{profile.id}</TableCell>

                <TableCell>
                    <Avatar img={profile.photo} rounded size="sm" />
                </TableCell>

                <TableCell className="font-medium text-gray-900 dark:text-white">
                    {profile.username}
                </TableCell>
                <TableCell>{profile.email}</TableCell>
                <TableCell>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            checked={profile.profileTypeId === 2}
                            onChange={handleAdminToggle}
                        />
                    </div>
                </TableCell>

                <TableCell className="max-w-xs">
                    <div className="whitespace-normal break-words">
                        {profile.tags && profile.tags.length > 0 ? (
                            <span>
                                {profile.tags.map((tag: any) => tag.name).join(', ')}
                            </span>
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex gap-2">
                        <div onClick={(e) => e.stopPropagation()}>
                            <ProfileFormModal fetchProfiles={fetchProfiles} profile={profile} />
                        </div>

                        <Button
                            size="xs"
                            color="red"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDelete(true);
                            }}
                        >
                            <FaTrash />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        </>
    );
};

export default ProfileRow;