import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportUserData, getSelectedUser } from "@/storage";
import { useState } from "react";

const Profile = () => {
  const [selectedUser, setSelectedUser] = useState(getSelectedUser());
  const [name, setName] = useState(selectedUser.name);
  const [email, setEmail] = useState(selectedUser.email);
  const handleExport = () => {
    exportUserData();
  };

  const handleImport = () => {
  }
  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
            <p className="text-muted-foreground">
              Aqui você pode gerenciar suas informações pessoais
            </p>
          </div>
        </header>
        <main>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
            <Button onClick={handleImport} type="button" className="w-full bg-green-400">
              Importar dados
            </Button>
            <Button onClick={handleExport} type="button" className="w-full bg-yellow-400">
              Exportar dados
            </Button>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
};

export default Profile;
