import {
    Button,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
} from "flowbite-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    onSubmit: (password: string, rpPassword: string) => void;
}

export const PasswordChangeModal = ({ show, setShow, onSubmit }: Props) => {
    const [password, setPassword] = useState("");
    const [rpPassword, setRpPassword] = useState("");

    const handleSubmit = () => {
        if (!password || !rpPassword) {
            toast.error("Tüm alanlar gerekli");
            return;
        }

        if (password !== rpPassword) {
            toast.error("Şifreler eşleşmiyor");
            return;
        }

        toast.success("Şifre başarıyla ayarlandı");
        onSubmit(password, rpPassword);
        setPassword("");
        setRpPassword("");
        setShow(false);
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
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
                        >
                            Onayla
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
