import request from 'supertest';
import 'dotenv/config'

/**
 * Realiza o login na API e retorna o token JWT 
 */
export async function getToken(ADMIN_EMAIL, ADMIN_SENHA) {
  const response = await request('http://localhost:3000')
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send({ 
      email: ADMIN_EMAIL,
      senha: ADMIN_SENHA
    });

  return response.body.token;
}