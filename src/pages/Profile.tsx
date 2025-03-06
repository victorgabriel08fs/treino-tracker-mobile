import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportUserData, getSelectedUser, importUserData, updateUser } from "@/storage";
import { set } from "date-fns";
import { ArrowLeft, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { FaFileExport, FaFileImport } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const [selectedUser, setSelectedUser] = useState(getSelectedUser());
  const [name, setName] = useState(selectedUser.name);
  const [email, setEmail] = useState(selectedUser.email);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleUpdate = (e) => {
    e.preventDefault();
    const user = { ...selectedUser, name, email };
    const updatedUser = updateUser(user);
    setSelectedUser(updatedUser);
    if (updatedUser == null) toast.error("Usuário já cadastrado");
    else toast.success("Usuário atualizado com sucesso!");
  };
  const handleExport = () => {
    exportUserData();
  };

  const handleImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    let result = false;
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        result = importUserData(e.target.result as string);
      };
      reader.readAsText(file);
    };
    fileInput.click();
    if(result){
      toast.success("Importação concluída com sucesso!");
    }else{
      toast.error("Importação falhou!");
    }
  };
  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="flex items-center justify-between mb-6">
          <div className="mt-10">
            <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
            <p className="text-muted-foreground">
              Aqui você pode gerenciar suas informações pessoais
            </p>
          </div>
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div
              onClick={() => {
                navigate(-1);
              }}
              className="rounded-full bg-background/80 backdrop-blur-sm p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </div>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-full bg-background/80 backdrop-blur-sm p-2"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50 animate-scale-in">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleExport();
                      }}
                      className="flex items-center w-full text-yellow-300 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <FaFileExport className="h-4 w-4 mr-2" />
                      Exportar dados
                    </button>
                    <button
                      onClick={() => {
                        handleImport();
                      }}
                    className="flex items-center w-full text-green-500 px-4 py-2 text-sm hover:bg-accent transition-colors">
                      <FaFileImport className="h-4 w-4 mr-2" />
                      Importar dados
                    </button>
                    <button
                      onClick={() => {
                        console.log("Excluir dados");
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir dados
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Treino</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Button type="submit" className="w-full">
                Salvar
              </Button>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
};

export default Profile;
