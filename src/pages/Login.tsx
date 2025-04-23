import api from "@/api";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    await api
      .post("/auth/login", { email, password })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/");
        } else {
          toast.error("Usuário ou senha inválidos");
        }
      })
      .catch((err) => {
        toast.error("Usuário ou senha inválidos");
        console.log(err);
      });
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <Button
            type="button"
            className="w-full bg-green-400"
            onClick={() => navigate("/register")}
          >
            Cadastrar
          </Button>
        </form>
      </Layout>
    </div>
  );
};

export default Login;
