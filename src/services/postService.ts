import axios from "axios";
import {Post} from "@/types";
import {getUserByEmail} from "@/services/userService";

const API_BASE_URL = 'http://localhost:3001';

export async function getPosts(): Promise<Post[]> {
  const response = await axios.get(API_BASE_URL + '/posts', {
    params: {
      _expand: 'user',
    }
  });
  if (response.status !== 200) {
    throw new Error('Erro ao buscar posts');
  }

  return response.data;
}

export async function getPostById(id: number): Promise<Post> {
  const response = await axios.get(API_BASE_URL + '/posts/' + id, {
    params: {
      _expand: 'user',
      _embed: 'comments',
    }
  });

  if (response.status !== 200) {
    throw new Error('Erro ao buscar post');
  }

  return response.data;
}

export async function createPost(title: string, content: string, email: string): Promise<Post> {
  const user = await getUserByEmail(email);
  const userId = user ? user[0].id : null;

  if (!userId) {
    throw new Error('Usuário não encontrado');
  }

  const response = await axios.post(API_BASE_URL + '/posts', {
    title,
    content,
    userId,
    publishedAt: new Date().toISOString(),
  });

  if (response.status !== 201) {
    throw new Error('Erro ao criar post');
  }

  return response.data;
}
