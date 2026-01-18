import {
    Button,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
} from "flowbite-react";
import { useState } from "react";
import { api } from "../helper/api";
import { toast } from "sonner";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    userId: number;
    onLogout?: () => void;
}

export const PasswordChangeModal = ({ show, setShow, userId, onLogout }: Props) => {
    const [password, setPassword] = useState("");
    const [rpPassword, setRpPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!password || !rpPassword) {
            toast.error("Tüm alanlar gerekli");
            return;
        }

        if (password !== rpPassword) {
            toast.error("Şifreler eşleşmiyor");
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/profiles/${userId}`, { password });
            toast.success("Şifre başarıyla değiştirildi. Lütfen yeniden giriş yapınız.");
            setPassword("");
            setRpPassword("");
            setShow(false);
            
            // Logout after password change
            localStorage.removeItem('user');
            if (onLogout) {
                onLogout();
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Şifre değiştirilemedi";
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} size="sm" onClose={() => {
            setPassword("");
            setRpPassword("");
            setShow(false);
        }} popup>
            <ModalHeader className="border-b border-gray-200 px-6 py-4">
                <span>Şifre Değiştir</span>
            </ModalHeader>
            <ModalBody className="p-6">
                <div className="space-y-4">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="new-password">Yeni Şifre</Label>
                        </div>
                        <TextInput
                            id="new-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Yeni şifrenizi girin"
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="confirm-password">Şifreyi Tekrarla</Label>
                        </div>
                        <TextInput
                            id="confirm-password"
                            type="password"
                            value={rpPassword}
                            onChange={(e) => setRpPassword(e.target.value)}
                            placeholder="Şifrenizi tekrar girin"
                            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Kaydediliyor..." : "Onayla"}
                        </Button>
                        <Button
                            onClick={() => {
                                setPassword("");
                                setRpPassword("");
                                setShow(false);
                            }}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2"
                        >
                            İptal
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default PasswordChangeModal;
