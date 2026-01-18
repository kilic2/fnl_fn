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
    onVerifySuccess: () => void;
}

export const PasswordVerificationModal = ({ show, setShow, userId, onVerifySuccess }: Props) => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!password) {
            toast.error("Şifre gerekli");
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/profiles/${userId}`, {
                params: { password }
            });

            if (response.status === 200) {
                toast.success("Şifre doğru");
                setPassword("");
                setShow(false);
                onVerifySuccess();
            }
        } catch (error: any) {
            toast.error("Şifre yanlış");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} size="sm" onClose={() => {
            setPassword("");
            setShow(false);
        }} popup>
            <ModalHeader className="border-b border-gray-200 px-6 py-4">
                <span>Kimliğinizi Doğrulayın</span>
            </ModalHeader>
            <ModalBody className="p-6">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Profilinizi düzenlemek için şifrenizi girin
                    </p>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="verify-password">Şifre</Label>
                        </div>
                        <TextInput
                            id="verify-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Şifrenizi girin"
                            onKeyPress={(e) => e.key === "Enter" && handleVerify()}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleVerify}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
                        >
                            {loading ? "Doğrulanıyor..." : "Doğrula"}
                        </Button>
                        <Button
                            onClick={() => {
                                setPassword("");
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

export default PasswordVerificationModal;
