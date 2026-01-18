import {
    Button,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
    FileInput
} from "flowbite-react";
import { useState, useEffect } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    userData: {
        id: number;
        username: string;
        email: string;
        pp: string;
    };
    onLogout?: () => void;
}

export const ProfileFormModal = ({ show, setShow, userData, onLogout }: Props) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);

    useEffect(() => {
        if (userData && show) {
            // Pre-fill with user data
            setUsername(userData.username);
            setEmail(userData.email);
            setPhoto(null);
        }
    }, [show, userData]);

    function handleSave() {
        if (!username || !email) {
            toast.error("Kullanıcı adı ve email gerekli");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);

        if (photo) {
            formData.append("photo", photo);
        }

        api.patch(`/profiles/${userData.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(() => {
                toast.success("Profil başarıyla güncellendi. Lütfen yeniden giriş yapınız.");
                resetForm();
                setShow(false);
                
                // Logout after profile update
                localStorage.removeItem('user');
                if (onLogout) {
                    onLogout();
                }
            })
            .catch((err) => {
                const msg = err.response?.data?.message || "Güncelleme başarısız";
                toast.error(Array.isArray(msg) ? msg[0] : msg);
            });
    }

    const resetForm = () => {
        setUsername("");
        setEmail("");
        setPhoto(null);
    };

    return (
        <Modal show={show} size="md" onClose={() => {
            resetForm();
            setShow(false);
        }} popup>
            <ModalHeader className="border-b border-gray-200 px-6 py-4">
                <span>Profili Düzenle</span>
            </ModalHeader>
            <ModalBody className="p-6">
                <div className="space-y-6">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="u">Kullanıcı Adı</Label>
                        </div>
                        <TextInput
                            id="u"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Kullanıcı adınız"
                        />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="e">Email</Label>
                        </div>
                        <TextInput
                            id="e"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="örnek@email.com"
                        />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="photo">Profil Fotoğrafı</Label>
                        </div>
                        <FileInput
                            id="photo"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setPhoto(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    <div className="w-full pt-4">
                        <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
                            Güncelle
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ProfileFormModal;
