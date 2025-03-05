import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/storage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    const user = createUser({
      username: name,
      name,
      id: uuidv4(),
      email,
      workouts: [],
    });
    if (user) {
      window.location.reload();
    }else{
        toast.error("Usuário já cadastrado");
    }
  };
  return (
    <div>
      <Layout props={{ guess: true }}>
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Cadastrar Usuário
          </h1>
          <p className="text-muted-foreground">
            Antes de gerenciar treinos, você precisa cadastrar um usuário
          </p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <Button type="submit" className="w-full">
            Cadastrar
          </Button>
        </form>
      </Layout>
    </div>
  );
};

export default CreateUser;
