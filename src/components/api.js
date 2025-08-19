export const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Нет accessToken");
  
    const res = await fetch(" https://dlm-agent.ru/api/v1/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (!res.ok) throw new Error("Не удалось получить данные пользователя");
    const data = await res.json();
    localStorage.setItem("currentUser", data.id)
    return data; // ожидаем, что data содержит { name, surname, ... }
  };
  