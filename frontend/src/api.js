
export function chefEvent(type, detail = {}) {
  window.dispatchEvent(
    new CustomEvent("prepwise:chef", {
      detail: { type, ...detail },
    })
  );
}

async function request(path, options = {}) {
  const method = options.method || "GET";

  const res = await fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
    body: options.body
      ? JSON.stringify(options.body)
      : undefined,
  });

  const data =
    res.status === 204
      ? null
      : await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.error || "Request failed"
    );
  }

  // Notify the mascot only after a successful request.

  if (method !== "GET") {
    if (path.startsWith("/pantry-items")) {
      chefEvent("pantry-updated");
    }

    if (
      method === "POST" &&
      path === "/saved-recipes"
    ) {
      chefEvent("celebrate", {
        message: "Recipe saved!",
      });
    }

    if (
      method === "POST" &&
      path === "/meal-plan"
    ) {
      chefEvent("celebrate", {
        message: "Meal planned!",
      });
    }

    if (
      method === "POST" &&
      path === "/chat/weekly-plan" &&
      Number(data?.added) > 0
    ) {
      chefEvent("celebrate", {
        message: "Weekly plan saved!",
      });
    }

    if (
      method === "POST" &&
      path === "/shopping-list/generate"
    ) {
      chefEvent("celebrate", {
        message: "Shopping list ready!",
      });
    }
  }

  return data;
}

export const api = {
  get: (p) => request(p),

  post: (p, body) =>
    request(p, {
      method: "POST",
      body: body ?? {},
    }),

  patch: (p, body) =>
    request(p, {
      method: "PATCH",
      body,
    }),

  del: (p) =>
    request(p, {
      method: "DELETE",
    }),
};

export const getRecipes = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) =>
        value !== "" && value != null
    )
  ).toString();

  const path = query
    ? `/recipes?${query}`
    : "/recipes";

  return api.get(path);
};

export const getRecipe = async (id) => {
  const recipe = await api.get(`/recipes/${id}`);

  // The chef reacts to the actual recipe being viewed.
  chefEvent("recipe-viewed", { recipe });

  return recipe;
};
