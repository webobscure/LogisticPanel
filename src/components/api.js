export const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Нет accessToken");
  
    const res = await fetch("http://91.197.97.68:33333/api/v1/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (!res.ok) throw new Error("Не удалось получить данные пользователя");
    const data = await res.json();
    return data; // ожидаем, что data содержит { name, surname, ... }
  };
  