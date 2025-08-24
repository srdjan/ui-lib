/** @jsx h */
import { h } from "https://deno.land/x/jsx@v0.1.5/mod.ts";
import type { User } from "../types.ts";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div class="card">
      <h3>{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>ID:</strong> #{user.id}</p>
    </div>
  );
}

