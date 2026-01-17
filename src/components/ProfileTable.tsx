import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Label,
  TextInput,
  Textarea
} from "flowbite-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { Profile } from "../types/Profile";
import { ProfileRow } from "./ProfileRow";
import { ProfileFormModal } from "./ProfileFormModal";
import { api } from "../helper/api";

const ProfileTable = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [commentText, setCommentText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  function fetchProfiles() {
    api.get("profiles").then((res) => setProfiles(res.data));
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  function handleClick(profile: Profile) {
    console.log(profile);
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.error('Lütfen bir yorum girin');
      return;
    }
    if (!titleText.trim()) {
      toast.error('Lütfen bir başlık girin');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", titleText);
      formData.append("desc", commentText);

      if (photo) {
        formData.append("img", photo);
      }

      const response = await api.post('/review', formData);
      console.log('Yorum başarıyla gönderildi:', response.data);
      toast.success('Yorum başarıyla gönderildi');
      
      setTitleText("");
      setCommentText("");
      setPhoto(null);

    } catch (error) {
      toast.error('Review gönderilirken hata oluştu');
      console.error('Yorum gönderilirken hata oluştu:', error);
    }
  };

  return (
    <>
      <ProfileFormModal fetchProfiles={fetchProfiles} profile={null} />
      <div className="bg-white rounded-lg shadow-md p-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Id</TableHeadCell>
              <TableHeadCell>Fotoğraf</TableHeadCell>
              <TableHeadCell>Kullanıcı Adı</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Profil Tipi</TableHeadCell>
              <TableHeadCell>Tagler</TableHeadCell>
              <TableHeadCell>İşlemler</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((p) => (
              <ProfileRow
                key={p.id}
                fetchProfiles={fetchProfiles}
                profile={p}
                handleClick={handleClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <section className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Review Ekle
          </h5>

          <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 my-4" />

          <form className="flex flex-col gap-4" onSubmit={handleSubmitComment}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Başlık Ekle" />
              </div>
              <TextInput
                id="title"
                type="text"
                placeholder="Örn: Harika bir deneyim!"
                required
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="photo-upload" value="Fotoğraf Ekle" />
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="photo-upload">
                  <Button color="light" as="span" className="cursor-pointer">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Fotoğraf Seç
                  </Button>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhoto(e.target.files[0]);
                    }
                  }}
                />
                <span className="text-xs text-gray-500">
                  {photo ? photo.name : "Dosya seçilmedi"}
                </span>
              </div>
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="content" value="İçerik Ekle" />
              </div>
              <Textarea
                id="content"
                placeholder="Yorumunuzu buraya yazın..."
                required
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>

            <Button type="submit" gradientDuoTone="purpleToBlue">
              Gönder
            </Button>
          </form>
        </section>
      </div>
    </>
  );
};

export default ProfileTable;