import api from '../lib/api';

export async function getConversations() {
  const r = await api.get('/messages/conversations');
  return r.data;
}

export async function getMessagesWith(userId: number | string) {
  const r = await api.get(`/messages/${userId}`);
  return r.data;
}
export async function getMessagesBetween(a, b) {
  const res = await api.get(`/messages/${a}/${b}`);
  return (res.data || []).map(m => ({
    ...m,
    content: m.content || m.text || "",
    image: m.image || null,
  }));
}

export async function sendMessage({ to, text }) {
  const r = await api.post('/messages', { to, text });
  return r.data;
}

export async function getMe() {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    console.error("❌ getMe error:", err);
    return null;
  }
}
